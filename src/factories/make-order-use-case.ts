import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { OrderUseCase } from '../use-cases/orders/order'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaOrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository'
import { PrismaUserLocationsRepository } from '@/repositories/prisma/prisma-user-locations-repository'

export function makeOrderUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const productsRepository = new PrismaProductsRepository()
  const ordersRepository = new PrismaOrdersRepository()
  const orderItemsRepository = new PrismaOrderItemsRepository()
  const storesRepository = new PrismaStoresRepository()
  const cashbacksRepository = new PrismaCashbacksRepository()
  const userLocationsRepository = new PrismaUserLocationsRepository()

  const useCase = new OrderUseCase(
    ordersRepository,
    productsRepository,
    orderItemsRepository,
    storesRepository,
    usersRepository,
    cashbacksRepository,
    userLocationsRepository,
  )
  return useCase
}
