import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeOrderUseCase } from "@/use-cases/_factories/make-create-order-use-case";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log("📩 Dados recebidos:", request.body);

  const createOrderBodySchema = z.object({
    user_id: z.string().uuid({ message: "ID do usuário inválido" }),
    store_id: z.string().uuid({ message: "ID da loja inválido" }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    discountApplied: z.number().min(0).optional(),
    useCashback: z.boolean().optional().default(false),
    items: z
      .array(
        z.object({
          product_id: z.string().min(1, { message: "ID do produto inválido" }),
          quantity: z
            .number()
            .positive({ message: "Quantidade deve ser positiva" }),
          subtotal: z.number().positive().optional(), // apenas ignorado
        })
      )
      .min(1, { message: "O pedido deve ter pelo menos um item" }),
  });

  try {
    const validatedData = createOrderBodySchema.parse(request.body);

    const discountApplied = validatedData.discountApplied ?? 0;

    // Validar saldo de cashback se necessário
    if (validatedData.useCashback && discountApplied > 0) {
      const validatedCashbacks = await prisma.cashback.findMany({
        where: {
          user_id: validatedData.user_id,
          validated: true,
        },
        select: { amount: true },
      });

      const cashbackBalance = validatedCashbacks.reduce(
        (acc, cb) => acc + new Decimal(cb.amount).toNumber(),
        0
      );

      if (new Decimal(cashbackBalance).lessThan(discountApplied)) {
        return reply.status(400).send({
          message: "Saldo de cashback insuficiente para aplicar o desconto",
        });
      }
    }

    const orderUseCase = makeOrderUseCase();

    const order = await orderUseCase.execute({
      user_id: validatedData.user_id,
      store_id: validatedData.store_id,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      discountApplied: validatedData.discountApplied,
      useCashback: validatedData.useCashback,
      items: validatedData.items.map(({ product_id, quantity }) => ({
        product_id,
        quantity,
        subtotal: 0, // será ignorado e recalculado no use-case
      })),
    });

    console.log("✅ Pedido criado:", order);

    return reply.status(201).send({
      message: "Pedido criado com sucesso",
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        discountApplied: order.discountApplied,
        qrCodeUrl: order.qrCodeUrl,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
    });
  }
}
