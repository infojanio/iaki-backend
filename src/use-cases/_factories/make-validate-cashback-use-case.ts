import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository'
import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { ValidateCashback } from '../cashbacks/validate-cashback'

export function makeValidateCashbackUseCase() {
  const cashbacksRepository = new PrismaCashbacksRepository()
  const ordersRepository = new PrismaOrdersRepository()

  const useCase = new ValidateCashback(cashbacksRepository, ordersRepository)

  return useCase
}
