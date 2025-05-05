import { PrismaCartsRepository } from '@/repositories/prisma/prisma-carts-repository'
import { AddToCartUseCase } from '@/use-cases/carts/add-to-cart'

export function makeAddToCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  const useCase = new AddToCartUseCase(cartsRepository)

  return useCase
}
