import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

export class ListBannersUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute() {
    const banners = await this.bannersRepository.listMany();
    return banners;
  }
}
