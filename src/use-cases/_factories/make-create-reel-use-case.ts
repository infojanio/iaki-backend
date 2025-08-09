import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { CreateReelUseCase } from "../reels/create-reel";
export function makeCreateReelUseCase() {
  const reelsRepository = new PrismaReelsRepository();
  const useCase = new CreateReelUseCase(reelsRepository);
  return useCase;
}
