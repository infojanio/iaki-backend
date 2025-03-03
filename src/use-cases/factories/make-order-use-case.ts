import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { OrderUseCase } from '../order'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaOrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
export function makeOrderUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const productsRepository = new PrismaProductsRepository()
  const ordersRepository = new PrismaOrdersRepository()
  const orderItemsRepository = new PrismaOrderItemsRepository()
  const storesRepository = new PrismaStoresRepository()

  const useCase = new OrderUseCase(
    ordersRepository,
    productsRepository,
    orderItemsRepository,
    storesRepository,
    usersRepository,
  )
  return useCase
}
