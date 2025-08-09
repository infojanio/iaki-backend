import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { GetReelUseCase } from "../reels/get-reel";
export function makeGetReelUseCase() {
  const reelsRepository = new PrismaReelsRepository();
  const useCase = new GetReelUseCase(reelsRepository);
  return useCase;
}
