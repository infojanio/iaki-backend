import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchProductsUseCase } from '@/use-cases/_factories/make-search-products-use-case'

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchQuerySchema = z.object({
    query: z.string().min(1, 'O nome do produto é obrigatório'),
    page: z.number().int().positive().optional().default(1),
  })

  const { query, page } = searchQuerySchema.parse(request.query)

  const searchProductsUseCase = makeSearchProductsUseCase()

  const products = await searchProductsUseCase.execute({ query, page })

  return reply.send({ products })
}
