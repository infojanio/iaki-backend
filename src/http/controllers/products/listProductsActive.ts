import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListProductsActiveUseCase } from '@/use-cases/_factories/make-list-products-active-use-case'

export async function listProductsActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listProductsUseCase = makeListProductsActiveUseCase()

  const products = await listProductsUseCase.execute()

  return reply.status(200).send(products)
}
