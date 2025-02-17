import { Category, Prisma } from '@prisma/client'
<<<<<<< HEAD


=======
>>>>>>> master
export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  create(data: Prisma.CategoryCreateInput): Promise<Category>
  searchMany(search: string, page: number): Promise<Category[]> //buscar por nome
<<<<<<< HEAD

=======
>>>>>>> master
}
