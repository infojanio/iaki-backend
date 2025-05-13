import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetCartUseCase } from '@/use-cases/_factories/make-get-cart-use-case'

export async function getCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const getCartUseCase = makeGetCartUseCase()
  const { cartItems } = await getCartUseCase.execute({ userId })

  return reply.status(201).send({ cartItems })
}
