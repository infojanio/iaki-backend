import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { FetchProductsByCashbackUseCase } from '../products/fetch-products-by-cashback.ts.js'
export function makeFetchProductsByCashbackUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new FetchProductsByCashbackUseCase(productsRepository)
  return useCase
}
