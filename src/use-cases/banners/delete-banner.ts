import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

export class DeleteBannerUseCase {
  constructor(private bannerRepository: BannersRepository) {}

  async execute(id: string) {
    await this.bannerRepository.delete(id);
  }
}
