import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCancelOrderUseCase } from "@/use-cases/_factories/make-cancel-order-use-case";

export async function cancel(request: FastifyRequest, reply: FastifyReply) {
  const cancelOrderParamsSchema = z.object({
    orderId: z.string().uuid(),
  });

  const { orderId } = cancelOrderParamsSchema.parse(request.params);
  const adminUserId = request.user.sub; // ID do usuário autenticado (ADMIN)

  const cancelOrderUseCase = makeCancelOrderUseCase();

  try {
    const result = await cancelOrderUseCase.execute({
      order_id: orderId,
      admin_user_id: adminUserId,
    });

    return reply
      .status(200)
      .send({ message: "Pedido cancelado com sucesso.", result });
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
    return reply.status(400).send({ message: error });
  }
}
