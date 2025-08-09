import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { UpdateBannerUseCase } from "../banners/update-banners";
export function makeUpdateBannerUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new UpdateBannerUseCase(bannersRepository);
  return useCase;
}
