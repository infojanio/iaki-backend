import { PrismaCartsRepository } from '@/repositories/prisma/prisma-carts-repository'
import { RemoveItemFromCartUseCase } from '@/use-cases/carts/remove-item'

export function makeRemoveItemFromCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  return new RemoveItemFromCartUseCase(cartsRepository)
}
