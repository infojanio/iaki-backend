import { PrismaSubCategoriesRepository } from "@/repositories/prisma/prisma-subcategories-repository";
import { UpdateSubCategoryUseCase } from "../subcategories/update-subcategories";
export function makeUpdateSubcategoryUseCase() {
  const subcategoriesRepository = new PrismaSubCategoriesRepository();
  const useCase = new UpdateSubCategoryUseCase(subcategoriesRepository);
  return useCase;
}
