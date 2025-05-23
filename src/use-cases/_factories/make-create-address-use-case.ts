import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'
import { CreateAddressUseCase } from '../addresses/create-address'
export function makeAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository()
  const addressUseCase = new CreateAddressUseCase(addressesRepository)
  return addressUseCase
}
