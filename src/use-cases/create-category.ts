import { CategoriesRepository } from '@/repositories/categories-repository'
import { Category, Prisma } from '@prisma/client'
interface CreateCategoryUseCaseRequest {
  name: string
<<<<<<< HEAD
  image: string | null  
  subcategory:  Prisma.SubCategoryCreateNestedManyWithoutCategoryInput | string
  created_at: Date

=======
  image: string | null
  subcategory: string
  created_at: Date
>>>>>>> master
}
interface CreateCategoryUseCaseResponse {
  category: Category
}
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute({
    name,
    image,
    subcategory,
<<<<<<< HEAD
    created_at
 
=======
    created_at,
>>>>>>> master
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.create({
      name,
      image,
      SubCategory: subcategory,
<<<<<<< HEAD
      created_at
=======
      created_at,
>>>>>>> master
    })
    return {
      category,
    }
  }
}
