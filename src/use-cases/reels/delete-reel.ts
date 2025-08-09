import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";

export class DeleteReelUseCase {
  constructor(private reelRepository: ReelsRepository) {}

  async execute(id: string) {
    await this.reelRepository.delete(id);
  }
}
