import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { GetUserAddressUseCase } from "../addresses/get-address";

export function makeGetUserAddressUseCase() {
  const userRepository = new PrismaAddressesRepository();
  const useCase = new GetUserAddressUseCase(userRepository);

  return useCase;
}
