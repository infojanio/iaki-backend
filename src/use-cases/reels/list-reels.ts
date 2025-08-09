import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";

export class ListReelsUseCase {
  constructor(private reelsRepository: ReelsRepository) {}

  async execute() {
    const reels = await this.reelsRepository.listMany();
    return reels;
  }
}
