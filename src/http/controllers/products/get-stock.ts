import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetProductUseCase } from '@/use-cases/_factories/make-get-product-use-case'
import { makeUpdateProductUseCase } from '@/use-cases/_factories/make-update-product-use-case'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'
import { InsufficientStockError } from '@/utils/messages/errors/insufficient-stock-error'

const stockParamsSchema = z.object({
  productId: z.string().uuid(),
})

const stockActionSchema = z.object({
  action: z.enum(['increment', 'decrement']),
  value: z.number().positive(),
})

export async function getStock(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { productId } = stockParamsSchema.parse(request.params)

    const getProductUseCase = makeGetProductUseCase()
    const stockInfo = await getProductUseCase.executeForStock({ productId })

    return reply.status(200).send({
      success: true,
      data: {
        stock: stockInfo.quantity,
        productName: stockInfo.name,
      },
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      })
    }

    console.error('Stock check error:', error)
    return reply.status(500).send({
      success: false,
      message: 'Failed to check product stock',
    })
  }
}

export async function updateStock(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { productId } = stockParamsSchema.parse(request.params)
    const { action, value } = stockActionSchema.parse(request.body)

    const updateProductUseCase = makeUpdateProductUseCase()

    await updateProductUseCase.execute({
      productId,
      quantity:
        action === 'increment' ? { increment: value } : { decrement: value },
    })

    return reply.status(204).send()
  } catch (error) {
    console.error('Stock update error:', error)

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      })
    }

    if (error instanceof InsufficientStockError) {
      return reply.status(409).send({
        success: false,
        message: error.message,
      })
    }

    return reply.status(400).send({
      success: false,
      message:
        error instanceof Error ? error.message : 'Invalid stock operation',
    })
  }
}
