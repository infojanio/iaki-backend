import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { hash } from "bcryptjs";
import { StoreAlreadyExistsError } from "../../utils/messages/errors/store-already-exists-error";
import { Role, Store } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface RegisterUseCaseRequest {
  id?: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  phone: string;
  avatar: string;
  cnpj: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface RegisterUseCaseResponse {
  store: Store;
}

export class RegisterUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({
    id,
    name,
    slug,
    latitude,
    longitude,
    phone,
    avatar,
    cnpj,
    street,
    city,
    state,
    postalCode,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    try {
      const storeWithSameCnpj = await this.storesRepository.findByCnpj(cnpj);

      if (storeWithSameCnpj) {
        throw new StoreAlreadyExistsError();
      }

      // Cria o usuário
      const store = await this.storesRepository.create({
        id,
        name,
        phone,
        city,
        longitude,
        latitude,
        slug,
        cnpj,
        state,
        postalCode,
        street,
        avatar,
      });

      return { store };
    } catch (error) {
      if (error instanceof StoreAlreadyExistsError) {
        throw error;
      }
      throw new Error("Erro inesperado ao registrar loja");
    }
  }
}
