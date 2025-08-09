import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";
import { Reel, Prisma } from "@prisma/client";
interface CreateReelUseCaseRequest {
  id?: string;
  title: string;
  image_url: string;
  link?: string;
  created_at: Date;
}

export class CreateReelUseCase {
  constructor(private reelsRepository: ReelsRepository) {}
  async execute({
    id,
    title,
    image_url,
    link,
    created_at,
  }: CreateReelUseCaseRequest) {
    const reel = await this.reelsRepository.create({
      id,
      title,
      image_url,
      link,
      created_at,
    });
    return {
      reel,
    };
  }
}
