import { PrismaCartsRepository } from '@/repositories/prisma/prisma-carts-repository'
import { GetCartUseCase } from '@/use-cases/carts/get-cart'

export function makeGetCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  const useCase = new GetCartUseCase(cartsRepository)

  return useCase
}
