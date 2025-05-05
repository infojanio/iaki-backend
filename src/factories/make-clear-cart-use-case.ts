import { PrismaCartsRepository } from '@/repositories/prisma/prisma-carts-repository'
import { ClearCartUseCase } from '@/use-cases/carts/clear-cart'

export function makeClearCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  return new ClearCartUseCase(cartsRepository)
}
