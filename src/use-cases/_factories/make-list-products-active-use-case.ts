import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { ListProductsActiveUseCase } from '../products/list-products-active'
export function makeListProductsActiveUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new ListProductsActiveUseCase(productsRepository)
  return useCase
}
