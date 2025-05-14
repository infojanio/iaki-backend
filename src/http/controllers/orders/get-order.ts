import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetOrderUseCase } from '@/use-cases/_factories/make-get-order-use-case'

export async function getOrder(
  request: FastifyRequest<{ Params: { orderId: string } }>,
  reply: FastifyReply,
) {
  const orderId = request.params.orderId

  const getOrderUseCase = makeGetOrderUseCase()
  const { orderItems } = await getOrderUseCase.execute({ orderId })

  return reply.status(201).send({ orderItems })
}
