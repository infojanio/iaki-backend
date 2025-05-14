import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { GetOrderUseCase } from '@/use-cases/orders/get-order'

export function makeGetOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const useCase = new GetOrderUseCase(ordersRepository)

  return useCase
}
