// src/repositories/prisma/Iprisma/user-locations-repository.ts
import { UserLocation, Prisma } from "@prisma/client";

export interface UserLocationRepository {
  create(data: Prisma.UserLocationUncheckedCreateInput): Promise<UserLocation>;
  findByUserId(
    userId: string
  ): Promise<{ latitude: number; longitude: number } | null>;
}
