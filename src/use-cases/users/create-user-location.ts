// src/use-cases/user-location/create-user-location-use-case.ts

import { UserLocationRepository } from "@/repositories/prisma/Iprisma/user-locations-repository";

interface CreateUserLocationRequest {
  userId: string;
  latitude: number;
  longitude: number;
}

export class CreateUserLocationUseCase {
  constructor(private userLocationRepository: UserLocationRepository) {}

  async execute({ userId, latitude, longitude }: CreateUserLocationRequest) {
    const location = await this.userLocationRepository.create({
      user_id: userId,
      latitude,
      longitude,
    });

    return { location };
  }
}
