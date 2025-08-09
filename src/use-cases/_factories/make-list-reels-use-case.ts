import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { ListReelsUseCase } from "../reels/list-reels";
export function makeListReelsUseCase() {
  const reelsRepository = new PrismaReelsRepository();
  const useCase = new ListReelsUseCase(reelsRepository);
  return useCase;
}
