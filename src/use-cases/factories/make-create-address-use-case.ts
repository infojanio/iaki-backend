import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'
<<<<<<< HEAD
import { CreateAddressUseCase } from '../update-address'
export function makeCreateAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository()
  const useCase = new CreateAddressUseCase(addressesRepository)
  return useCase
=======
import { CreateAddressUseCase } from '../create-address'
export function makeAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository()
  const addressUseCase = new CreateAddressUseCase(addressesRepository)
  return addressUseCase
>>>>>>> master
}
