// src/repositories/prisma/prisma-user-locations-repository.ts
import { prisma } from '@/lib/prisma'
import { UserLocation, Prisma } from '@prisma/client'
import { UserLocationRepository } from './Iprisma/user-locations-repository'

export class PrismaUserLocationsRepository implements UserLocationRepository {
  async create(
    data: Prisma.UserLocationUncheckedCreateInput,
  ): Promise<UserLocation> {
    const location = await prisma.userLocation.create({ data })
    return location
  }

  async findByUserId(user_id: string): Promise<UserLocation | null> {
    return await prisma.userLocation.findFirst({
      where: { user_id },
    })
  }
}
