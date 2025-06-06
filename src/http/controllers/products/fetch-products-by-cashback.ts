import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchProductsByCashbackUseCase } from '@/use-cases/_factories/make-fetch-products-by-cashback-use-case'

export async function fetchProductsByCashback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Alteramos para buscar da QUERY, não do BODY
  const fetchProductsQuerySchema = z.object({
    cashback_percentage: z.string().optional(), // Agora espera string (porque query params sempre são strings)
  })

  const { cashback_percentage } = fetchProductsQuerySchema.parse(request.query)

  // Converte para número e define 3 como valor padrão caso não seja passado
  const cashbackValue = cashback_percentage ? Number(cashback_percentage) : 3

  const fetchProductsByCashbackUseCase = makeFetchProductsByCashbackUseCase()

  const { products } = await fetchProductsByCashbackUseCase.execute({
    cashback_percentage: cashbackValue, // Usa o valor convertido
  })

  return reply.status(200).send(products)
}
