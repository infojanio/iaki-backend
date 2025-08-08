import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { CreateBannerUseCase } from "../banners/create-banner";
export function makeCreateBannerUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new CreateBannerUseCase(bannersRepository);
  return useCase;
}
