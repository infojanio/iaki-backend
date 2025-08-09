import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";
import { Reel } from "@prisma/client";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface UpdateReelUseCaseRequest {
  reelId: string;
  title?: string;
  image_url?: string;
  link?: string;
}

interface UpdateReelUseCaseResponse {
  updatedReel: Reel;
}

export class UpdateReelUseCase {
  constructor(private reelsRepository: ReelsRepository) {}

  async execute({
    reelId,
    ...data
  }: UpdateReelUseCaseRequest): Promise<UpdateReelUseCaseResponse> {
    // Verifica se o Reel existe
    const existingReel = await this.reelsRepository.findById(reelId);

    if (!existingReel) {
      throw new ResourceNotFoundError();
    }

    // Formata os dados de quantidade para o Prisma
    const updateData = {
      ...data,
    };

    // Atualiza o produto
    const updatedReel = await this.reelsRepository.update(reelId, updateData);

    return { updatedReel };
  }
}
