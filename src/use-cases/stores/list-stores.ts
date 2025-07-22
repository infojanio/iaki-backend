import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

export class ListStoresUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute() {
    const stores = await this.storesRepository.listMany();
    return stores;
  }
}
