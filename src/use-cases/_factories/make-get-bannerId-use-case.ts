import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { GetBannerUseCase } from "../banners/get-banner";
export function makeGetBannerUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new GetBannerUseCase(bannersRepository);
  return useCase;
}
