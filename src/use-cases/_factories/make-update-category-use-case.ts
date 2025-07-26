import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { UpdateCategoryUseCase } from "../categories/update-categories";
export function makeUpdateCategoryUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository();
  const useCase = new UpdateCategoryUseCase(categoriesRepository);
  return useCase;
}
