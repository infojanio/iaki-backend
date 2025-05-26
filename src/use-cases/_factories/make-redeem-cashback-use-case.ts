import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { RedeemCashbackUseCase } from '../cashbacks/redeem-cashback'

export function makeRedeemCashbackUseCase() {
  const cashbacksRepository = new PrismaCashbacksRepository()
  const productsRepository = new PrismaProductsRepository()

  const useCase = new RedeemCashbackUseCase(
    cashbacksRepository,
    productsRepository,
  )

  return useCase
}
