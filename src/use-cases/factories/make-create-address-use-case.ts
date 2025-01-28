import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'
import { CreateAddressUseCase } from '../update-address'
export function makeCreateAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository()
  const useCase = new CreateAddressUseCase(addressesRepository)
  return useCase
}
