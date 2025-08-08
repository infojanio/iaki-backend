import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

interface GetBannerUseCaseRequest {
  bannerId: string;
}

export class GetBannerUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute({ bannerId }: GetBannerUseCaseRequest) {
    const banner = await this.bannersRepository.findByIdBanner(bannerId);

    if (!banner) {
      throw new Error("Banner não encontrado");
    }

    return banner;
  }
}
