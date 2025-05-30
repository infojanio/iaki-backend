// src/use-cases/_factories/make-fetch-all-orders-history-use-case.ts

import { FetchAllOrdersHistoryUseCase } from '@/use-cases/orders/fetch-all-orders-history-use-case'
import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'

export function makeFetchAllOrdersHistoryUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const useCase = new FetchAllOrdersHistoryUseCase(ordersRepository)

  return useCase
}
