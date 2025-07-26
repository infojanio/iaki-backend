import { SubCategoriesRepository } from "@/repositories/prisma/Iprisma/subcategories-repository";

interface GetSubcategoryUseCaseRequest {
  subcategoryId: string;
}

export class GetSubcategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}

  async execute({ subcategoryId }: GetSubcategoryUseCaseRequest) {
    const subcategory = await this.subcategoriesRepository.findByIdSubCategory(
      subcategoryId
    );

    if (!subcategory) {
      throw new Error("Produto não encontrado");
    }

    return subcategory;
  }
}
