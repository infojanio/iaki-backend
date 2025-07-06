// src/repositories/prisma/prisma-user-locations-repository.ts
import { prisma } from "@/lib/prisma";
import { UserLocation, Prisma } from "@prisma/client";
import { UserLocationRepository } from "./Iprisma/user-locations-repository";

export class PrismaUserLocationsRepository implements UserLocationRepository {
  async create(
    data: Prisma.UserLocationUncheckedCreateInput
  ): Promise<UserLocation> {
    const location = await prisma.userLocation.create({
      data: {
        user_id: data.user_id,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    return location;
  }

  async findByUserId(userId: string) {
    const location = await prisma.userLocation.findFirst({
      where: { user_id: userId },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    return location ?? null;
  }
}
