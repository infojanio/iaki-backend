import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { CreateCategoryUseCase } from '../categories/create-category'
export function makeCreateCategoryUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const useCase = new CreateCategoryUseCase(categoriesRepository)
  return useCase
}
