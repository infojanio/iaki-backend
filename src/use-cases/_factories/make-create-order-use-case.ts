// src/factories/make-order-use-case.ts
import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { OrderUseCase } from '../orders/create-order'

import { PrismaUserLocationsRepository } from '@/repositories/prisma/prisma-user-locations-repository'

export function makeOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository()

  const userLocationsRepository = new PrismaUserLocationsRepository()

  const useCase = new OrderUseCase(ordersRepository, userLocationsRepository)

  return useCase
}
