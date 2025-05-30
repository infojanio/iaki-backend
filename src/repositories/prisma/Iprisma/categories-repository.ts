import { Category, Prisma } from '@prisma/client'
export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  create(data: Prisma.CategoryCreateInput): Promise<Category>
  listMany(): Promise<Category[]> //listar todas
  searchMany(search: string, page: number): Promise<Category[]> //buscar por nome
}
