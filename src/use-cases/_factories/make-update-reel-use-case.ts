import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { UpdateReelUseCase } from "../reels/update-reels";
export function makeUpdateReelUseCase() {
  const reelsRepository = new PrismaReelsRepository();
  const useCase = new UpdateReelUseCase(reelsRepository);
  return useCase;
}
