import { PrismaSubCategoriesRepository } from "@/repositories/prisma/prisma-subcategories-repository";
import { GetSubcategoryUseCase } from "../subcategories/get-subcategory";
export function makeGetSubcategoryUseCase() {
  const subcategoriesRepository = new PrismaSubCategoriesRepository();
  const useCase = new GetSubcategoryUseCase(subcategoriesRepository);
  return useCase;
}
