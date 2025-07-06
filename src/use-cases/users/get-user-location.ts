import { UserLocationRepository } from "@/repositories/prisma/Iprisma/user-locations-repository";

interface GetUserLocationUseCaseRequest {
  userId: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

// ✅ Corrigir aqui:
type GetUserLocationUseCaseResponse = Location | null;

export class GetUserLocation {
  constructor(private userLocationRepository: UserLocationRepository) {}

  async execute({
    userId,
  }: GetUserLocationUseCaseRequest): Promise<GetUserLocationUseCaseResponse> {
    const location = await this.userLocationRepository.findByUserId(userId);
    return location ?? null;
  }
}
