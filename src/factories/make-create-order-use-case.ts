// src/use-cases/factories/make-create-order-use-case.ts
import { OrderUseCase } from '@/use-cases/orders/create-order'
import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { PrismaOrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository'

export function makeCreateOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const productsRepository = new PrismaProductsRepository()
  const orderItemsRepository = new PrismaOrderItemsRepository()
  const storesRepository = new PrismaStoresRepository()
  const usersRepository = new PrismaUsersRepository()
  const cashbacksRepository = new PrismaCashbacksRepository()

  const useCase = new OrderUseCase(
    ordersRepository,
    productsRepository,
    orderItemsRepository,
    storesRepository,
    usersRepository,
    cashbacksRepository,
  )
  return useCase
}
