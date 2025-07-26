import { SubCategoriesRepository } from "@/repositories/prisma/Iprisma/subcategories-repository";
import { SubCategory } from "@prisma/client";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface UpdateSubCategoryUseCaseRequest {
  subcategoryId: string;
  name?: string;
  image?: string;
  category_id?: string;
}

interface UpdateSubCategoryUseCaseResponse {
  updatedSubcategory: SubCategory;
}

export class UpdateSubCategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}

  async execute({
    subcategoryId,
    ...data
  }: UpdateSubCategoryUseCaseRequest): Promise<
    UpdateSubCategoryUseCaseResponse
  > {
    // Verifica se o subcategory existe
    const existingSubCategory = await this.subcategoriesRepository.findById(
      subcategoryId
    );

    if (!existingSubCategory) {
      throw new ResourceNotFoundError();
    }

    // Formata os dados de quantidade para o Prisma
    const updateData = {
      ...data,
    };

    // Atualiza o produto
    const updatedSubcategory = await this.subcategoriesRepository.update(
      subcategoryId,
      updateData
    );

    return { updatedSubcategory };
  }
}
