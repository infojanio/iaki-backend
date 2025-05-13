import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAddToCartUseCase } from '@/use-cases/_factories/make-add-to-cart-use-case'

export async function addToCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const schema = z.object({
    productId: z.string(),
    quantity: z.number().min(1),
  })

  const { productId, quantity } = schema.parse(request.body)

  const addToCartUseCase = makeAddToCartUseCase()
  await addToCartUseCase.execute({ userId, productId, quantity })

  return reply.status(201).send()
}
