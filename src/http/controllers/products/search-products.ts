import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchProductsUseCase } from '@/use-cases/_factories/make-search-products-use-case'

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchQuerySchema = z.object({
    query: z.string().min(1, 'O nome do produto é obrigatório'),
  })

  const { query } = searchQuerySchema.parse(request.query)

  const searchProductsUseCase = makeSearchProductsUseCase()

  const products = await searchProductsUseCase.execute({ query })

  return reply.send({ products })
}
