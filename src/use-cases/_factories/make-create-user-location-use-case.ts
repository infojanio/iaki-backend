import { PrismaUserLocationsRepository } from "@/repositories/prisma/prisma-user-locations-repository";
import { CreateUserLocationUseCase } from "../users/create-user-location";

export function makeCreateUserLocationUseCase() {
  const repository = new PrismaUserLocationsRepository();
  const useCase = new CreateUserLocationUseCase(repository);

  return useCase;
}
