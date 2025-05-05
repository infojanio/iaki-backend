import { PrismaCartsRepository } from '@/repositories/prisma/prisma-carts-repository'
import { UpdateItemQuantityUseCase } from '@/use-cases/carts/update-cart-item-quantity'

export function makeUpdateCartItemQuantityUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  const useCase = new UpdateItemQuantityUseCase(cartsRepository)
  return useCase
}
