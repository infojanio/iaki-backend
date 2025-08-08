import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";
import { Banner, Prisma } from "@prisma/client";
interface CreateBannerUseCaseRequest {
  id?: string;
  title: string;
  image_url: string;
  link?: string;
  created_at: Date;
}

export class CreateBannerUseCase {
  constructor(private bannersRepository: BannersRepository) {}
  async execute({
    id,
    title,
    image_url,
    link,
    created_at,
  }: CreateBannerUseCaseRequest) {
    const banner = await this.bannersRepository.create({
      id,
      title,
      image_url,
      link,
      created_at,
    });
    return {
      banner,
    };
  }
}
