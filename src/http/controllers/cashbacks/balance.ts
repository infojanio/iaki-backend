// http/cashbacks/balance.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserCashbackBalanceUseCase } from '@/use-cases/_factories/make-get-user-cashback-balance-use-case'

export async function balance(request: FastifyRequest, reply: FastifyReply) {
  const getUserCashbackBalanceUseCase = makeGetUserCashbackBalanceUseCase()

  const {
    balance,
    totalReceived,
    totalUsed,
  } = await getUserCashbackBalanceUseCase.execute({
    user_id: request.user.sub,
  })

  return reply.status(200).send({
    balance,
    totalReceived,
    totalUsed,
  })
}
