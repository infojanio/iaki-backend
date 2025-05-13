import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { FetchUserOrdersHistoryUseCase } from '../orders/fetch-user-orders-history'
export function makeFetchUserOrdersHistoryUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const useCase = new FetchUserOrdersHistoryUseCase(ordersRepository)
  return useCase
}
