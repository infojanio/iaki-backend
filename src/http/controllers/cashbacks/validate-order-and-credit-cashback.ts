import { makeValidateOrderAndCreditCashback } from '@/use-cases/_factories/make-validate-order-and-credit-cashback'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function validateOrderAndCreditCashback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    orderId: z.string().uuid(),
  })

  const { orderId } = paramsSchema.parse(request.params)

  try {
    const useCase = makeValidateOrderAndCreditCashback()

    const { cashback } = await useCase.execute({ orderId })

    return reply.status(200).send({
      cashback,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
