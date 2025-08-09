import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { DeleteBannerUseCase } from "../banners/delete-banner";
export function makeDeleteBannerUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new DeleteBannerUseCase(bannersRepository);
  return useCase;
}
