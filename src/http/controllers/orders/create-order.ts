// src/controllers/orders/create-order.ts
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/use-cases/_factories/make-create-order-use-case'
import { Decimal } from '@prisma/client/runtime/library'
import { prisma } from '@/lib/prisma'

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('📩 Dados recebidos:', request.body)

  const createOrderBodySchema = z.object({
    user_id: z.string().uuid({ message: 'ID do usuário inválido' }),
    store_id: z.string().uuid({ message: 'ID da loja inválido' }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    discountApplied: z.number().min(0).optional(),
    useCashback: z.boolean().optional().default(false),
    items: z
      .array(
        z.object({
          product_id: z.string().min(1, { message: 'ID do produto inválido' }),
          quantity: z
            .number()
            .positive({ message: 'Quantidade deve ser positiva' }),
          subtotal: z
            .number()
            .positive({ message: 'Subtotal deve ser maior que zero' }),
        }),
      )
      .min(1, { message: 'O pedido deve ter pelo menos um item' }),
  })

  try {
    const validatedData = createOrderBodySchema.parse(request.body)

    // 1. Calcular subtotal dos itens
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    )

    // 2. Validar desconto aplicado
    const discountApplied = validatedData.discountApplied ?? 0
    const effectiveDiscount = Math.min(discountApplied, subtotal)

    // 3. Validar saldo se estiver usando cashback
    if (validatedData.useCashback && discountApplied > 0) {
      const user = await prisma.user.findUnique({
        where: { id: validatedData.user_id },
        select: { cashback_balance: true },
      })

      if (
        !user ||
        new Decimal(user.cashback_balance).lessThan(discountApplied)
      ) {
        return reply.status(400).send({
          message: 'Saldo de cashback insuficiente para aplicar o desconto',
        })
      }
    }

    // 4. Calcular total final
    const totalAmount = subtotal - effectiveDiscount

    const orderUseCase = makeOrderUseCase()

    const order = await orderUseCase.execute({
      user_id: validatedData.user_id,
      store_id: validatedData.store_id,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      discountApplied: effectiveDiscount,
      totalAmount,
      useCashback: validatedData.useCashback,
      items: validatedData.items,
    })

    // 5. Atualizar saldo se usou cashback
    if (validatedData.useCashback && effectiveDiscount > 0) {
      await prisma.user.update({
        where: { id: validatedData.user_id },
        data: {
          cashback_balance: {
            decrement: effectiveDiscount,
          },
        },
      })
    }

    console.log('✅ Pedido criado:', order)

    return reply.status(201).send({
      message: 'Pedido criado com sucesso',
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied,
        qrCodeUrl: order.qrCodeUrl,
      },
    })
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error)

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    return reply.status(500).send({
      message: 'Erro interno no servidor',
      error: error.message,
    })
  }
}
