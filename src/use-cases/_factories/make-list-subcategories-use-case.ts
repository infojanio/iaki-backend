import { PrismaSubCategoriesRepository } from '@/repositories/prisma/prisma-subcategories-repository'
import { ListSubCategoriesUseCase } from '../subcategories/list-subcategories'
export function makeListSubCategoriesUseCase() {
  const subcategoriesRepository = new PrismaSubCategoriesRepository()
  const useCase = new ListSubCategoriesUseCase(subcategoriesRepository)
  return useCase
}
