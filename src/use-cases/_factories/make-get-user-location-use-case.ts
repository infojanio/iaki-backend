import { GetUserLocation } from "../users/get-user-location";
import { PrismaUserLocationsRepository } from "@/repositories/prisma/prisma-user-locations-repository";

export function makeGetUserLocation() {
  const usersLocationRepository = new PrismaUserLocationsRepository();
  const useCase = new GetUserLocation(usersLocationRepository);

  return useCase;
}
