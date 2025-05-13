import { PrismaSubCategoriesRepository } from '@/repositories/prisma/prisma-subcategories-repository'
import { CreateSubCategoryUseCase } from '../subcategories/create-subcategory'
export function makeCreateSubCategoryUseCase() {
  const subcategoriesRepository = new PrismaSubCategoriesRepository()
  const useCase = new CreateSubCategoryUseCase(subcategoriesRepository)
  return useCase
}
