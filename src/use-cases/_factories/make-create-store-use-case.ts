import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { RegisterUseCase } from "../stores/create-store";
import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
export function makeCreateStoreUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const addressesRepository = new PrismaAddressesRepository();

  const createStoreUseCase = new RegisterUseCase(storesRepository);
  return createStoreUseCase;
}
