import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { ListBannersUseCase } from "../banners/list-banners";
export function makeListBannersUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new ListBannersUseCase(bannersRepository);
  return useCase;
}
