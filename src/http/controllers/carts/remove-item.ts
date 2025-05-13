import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRemoveItemFromCartUseCase } from '@/use-cases/_factories/make-remove-item-use-case'

export async function removeItemFromCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    productId: z.string().uuid(),
  })

  const { productId } = paramsSchema.parse(request.params)
  const userId = request.user.sub

  const removeItemFromCartUseCase = makeRemoveItemFromCartUseCase()
  await removeItemFromCartUseCase.execute({ userId, productId })

  return reply.status(204).send()
}
