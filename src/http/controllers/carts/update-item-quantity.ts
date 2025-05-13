import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCartItemQuantityUseCase } from '@/use-cases/_factories/make-update-cart-item-quantity-use-case'

export async function updateItemQuantity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  const bodySchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1),
  })

  const { productId, quantity } = bodySchema.parse(request.body)

  const useCase = makeUpdateCartItemQuantityUseCase()

  await useCase.execute({
    userId,
    productId,
    quantity,
  })

  return reply
    .status(200)
    .send({ message: 'Quantidade atualizada com sucesso.' })
}
