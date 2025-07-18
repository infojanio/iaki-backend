import { makeGetWeekOrdersAmountUseCase } from "@/use-cases/_factories/make-get-week-orders-amount-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getWeekOrdersAmount(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z.object({
    storeId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  });

  const { storeId, userId } = querySchema.parse(request.query);

  const useCase = makeGetWeekOrdersAmountUseCase();

  const { amount, diffFromLastWeek } = await useCase.execute({
    storeId,
    userId,
  });

  return reply.send({
    amount,
    diffFromLastWeek,
  });
}
