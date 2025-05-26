// http/cashbacks/history.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserCashbackHistoryUseCase } from '@/use-cases/_factories/make-get-user-cashback-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const getUserCashbackHistoryUseCase = makeGetUserCashbackHistoryUseCase()

  const { cashbacks } = await getUserCashbackHistoryUseCase.execute({
    user_id: request.user.sub,
  })

  return reply.status(200).send({ cashbacks })
}
