import { AddressesRepository } from "@/repositories/prisma/Iprisma/addresses-repository";

interface GetUserAddressUseCaseRequest {
  userId: string;
}

interface GetUserAddressUseCaseResponse {
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export class GetUserAddressUseCase {
  constructor(private addressRepository: AddressesRepository) {}

  async execute({
    userId,
  }: GetUserAddressUseCaseRequest): Promise<GetUserAddressUseCaseResponse> {
    const address = await this.addressRepository.findByUserId(userId);

    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    const { street, city, state, postalCode } = address;

    return {
      address: {
        street,
        city,
        state,
        postalCode,
      },
    };
  }
}
