import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";

interface GetCategoryUseCaseRequest {
  categoryId: string;
}

export class GetCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ categoryId }: GetCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findByIdCategory(
      categoryId
    );

    if (!category) {
      throw new Error("Categoria não encontrado");
    }

    return category;
  }
}
