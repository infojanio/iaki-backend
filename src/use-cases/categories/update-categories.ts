import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";
import { Category } from "@prisma/client";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface UpdateCategoryUseCaseRequest {
  categoryId: string;
  name?: string;
  image?: string;
  category_id?: string;
}

interface UpdateCategoryUseCaseResponse {
  updatedCategory: Category;
}

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    ...data
  }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    // Verifica se o category existe
    const existingCategory = await this.categoriesRepository.findById(
      categoryId
    );

    if (!existingCategory) {
      throw new ResourceNotFoundError();
    }

    // Formata os dados de quantidade para o Prisma
    const updateData = {
      ...data,
    };

    // Atualiza o produto
    const updatedCategory = await this.categoriesRepository.update(
      categoryId,
      updateData
    );

    return { updatedCategory };
  }
}
