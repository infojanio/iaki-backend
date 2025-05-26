import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCashbackUseCase } from '@/use-cases/_factories/make-validate-cashback-use-case'

export async function validateCashback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    orderId: z.string(),
  })

  const bodySchema = z.object({
    cashbackAmount: z.number().positive('Saldo deve ser positivo'),
  })

  const { orderId } = paramsSchema.parse(request.params)
  const { cashbackAmount } = bodySchema.parse(request.body)

  const validateCashbackUseCase = makeValidateCashbackUseCase()

  await validateCashbackUseCase.execute({
    order_id: orderId,
    user_id: request.user.sub,
    cashbackAmount,
  })

  return reply.status(204).send()
}
