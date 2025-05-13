import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository' // ✅ Importando repositório de cashback
import { ValidateOrderUseCase } from '../orders/validate-order'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeValidateOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const cashbacksRepository = new PrismaCashbacksRepository() // ✅ Adicionando repositório de cashback
  const usersRepository = new PrismaUsersRepository()

  const useCase = new ValidateOrderUseCase(
    ordersRepository,
    usersRepository,
    cashbacksRepository,
  ) // ✅ Passando ambos os repositórios
  return useCase
}
