import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { DeleteReelUseCase } from "../reels/delete-reel";
export function makeDeleteReelUseCase() {
  const reelsRepository = new PrismaReelsRepository();
  const useCase = new DeleteReelUseCase(reelsRepository);
  return useCase;
}
