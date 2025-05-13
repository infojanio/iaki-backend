import { FastifyRequest, FastifyReply } from 'fastify'
import { makeClearCartUseCase } from '@/use-cases/_factories/make-clear-cart-use-case'

export async function clearCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const clearCartUseCase = makeClearCartUseCase()
  await clearCartUseCase.execute({ userId })

  return reply.status(204).send()
}
