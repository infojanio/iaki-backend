import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { ListProductsUseCase } from '../products/list-products'
export function makeListProductsUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new ListProductsUseCase(productsRepository)
  return useCase
}
