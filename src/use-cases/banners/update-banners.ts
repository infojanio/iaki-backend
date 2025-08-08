import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";
import { Banner } from "@prisma/client";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface UpdateBannerUseCaseRequest {
  bannerId: string;
  title?: string;
  image_url?: string;
  link?: string;
}

interface UpdateBannerUseCaseResponse {
  updatedBanner: Banner;
}

export class UpdateBannerUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute({
    bannerId,
    ...data
  }: UpdateBannerUseCaseRequest): Promise<UpdateBannerUseCaseResponse> {
    // Verifica se o Banner existe
    const existingBanner = await this.bannersRepository.findById(bannerId);

    if (!existingBanner) {
      throw new ResourceNotFoundError();
    }

    // Formata os dados de quantidade para o Prisma
    const updateData = {
      ...data,
    };

    // Atualiza o produto
    const updatedBanner = await this.bannersRepository.update(
      bannerId,
      updateData
    );

    return { updatedBanner };
  }
}
