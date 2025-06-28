import { makeGetUserCashbackTransactions } from "@/use-cases/_factories/make-get-user-cashback-transactions";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getUserCashbackTransactions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request.user.sub;

  const useCase = makeGetUserCashbackTransactions();
  const { transactions } = await useCase.execute({ user_id });

  return reply.send({ transactions });
}
