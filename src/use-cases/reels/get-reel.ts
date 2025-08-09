import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";

interface GetReelUseCaseRequest {
  reelId: string;
}

export class GetReelUseCase {
  constructor(private reelsRepository: ReelsRepository) {}

  async execute({ reelId }: GetReelUseCaseRequest) {
    const reel = await this.reelsRepository.findByIdReel(reelId);

    if (!reel) {
      throw new Error("Reel não encontrado");
    }

    return reel;
  }
}
