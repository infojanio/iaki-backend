import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { FetchProductsBySubCategoryUseCase } from '../products/fetch-products-by-subcategory'
export function makeFetchProductsBySubCategoryUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new FetchProductsBySubCategoryUseCase(productsRepository)
  return useCase
}
