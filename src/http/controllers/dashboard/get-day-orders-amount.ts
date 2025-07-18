import { makeGetDayOrdersAmountUseCase } from "@/use-cases/_factories/make-get-day-orders-amount-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getDayOrdersAmount(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z.object({
    storeId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  });

  const { storeId, userId } = querySchema.parse(request.query);

  const useCase = makeGetDayOrdersAmountUseCase();

  const { amount, diffFromYesterday } = await useCase.execute({
    storeId,
    userId,
  });

  return reply.send({
    amount,
    diffFromYesterday,
  });
}
