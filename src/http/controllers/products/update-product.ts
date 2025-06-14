import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateProductUseCase } from '@/use-cases/_factories/make-update-product-use-case'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'

const updateProductParamsSchema = z.object({
  productId: z.string().uuid(),
})

const updateProductBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  quantity: z.number().nonnegative().optional(),
  image: z.string().optional(),
  status: z.boolean().optional(),
  cashback_percentage: z.number().min(0).max(100).optional(),
  subcategory_id: z.string().uuid().optional(),
})

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { productId } = updateProductParamsSchema.parse(request.params)
    const updateData = updateProductBodySchema.parse(request.body)

    const updateProductUseCase = makeUpdateProductUseCase()

    const updatedProduct = await updateProductUseCase.execute({
      productId,
      ...updateData,
    })

    return reply.status(200).send({
      success: true,
      data: updatedProduct,
    })
  } catch (error) {
    console.error('Product update error:', error)

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      })
    }

    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : 'Invalid product data',
    })
  }
}
