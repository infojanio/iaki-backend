import { makeValidateOrderAndCreditCashback } from "@/use-cases/_factories/make-validate-order-and-credit-cashback";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function validateOrderAndCreditCashback(
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log("[Cashback] Iniciando validação de pedido e crédito de cashback");

  const paramsSchema = z.object({
    orderId: z.string().uuid(),
  });

  try {
    const { orderId } = paramsSchema.parse(request.params);
    console.log(`[Cashback] OrderID recebido: ${orderId}`);

    const useCase = makeValidateOrderAndCreditCashback();
    console.log("[Cashback] UseCase criado com sucesso");

    const { cashback } = await useCase.execute({ orderId });
    console.log("[Cashback] Cashback processado com sucesso:", cashback);

    return reply.status(200).send({ cashback });
  } catch (err) {
    console.error("[Cashback] Erro durante o processamento:", err);

    if (err instanceof ResourceNotFoundError) {
      console.error(`[Cashback] Pedido não encontrado: ${err.message}`);
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof Error) {
      console.error(`[Cashback] Erro de negócio: ${err.message}`);
      return reply.status(400).send({ message: err.message });
    }

    console.error("[Cashback] Erro interno não tratado:", err);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
