import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { PrismaUserLocationsRepository } from '@/repositories/prisma/prisma-user-locations-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository'
import { OrderUseCase } from '@/use-cases/orders/create-order'

export function makeOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const userLocationRepository = new PrismaUserLocationsRepository()
  const productsRepository = new PrismaProductsRepository()
  const cashbacksRepository = new PrismaCashbacksRepository() // Novo repositório

  const useCase = new OrderUseCase(
    ordersRepository,
    userLocationRepository,
    productsRepository,
    cashbacksRepository, // Adicionado
  )

  return useCase
}
