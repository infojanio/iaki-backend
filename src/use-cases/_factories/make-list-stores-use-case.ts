import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ListStoresUseCase } from "../stores/list-stores";
export function makeListStoresUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const useCase = new ListStoresUseCase(storesRepository);
  return useCase;
}
