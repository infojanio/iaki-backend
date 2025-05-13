import { PrismaCashbacksRepository } from '@/repositories/prisma/prisma-cashbacks-repository'
import { GetUserCashbackBalanceUseCase } from '../cashbacks/get-user-cashback-balance'
export function makeGetUserCashbackBalanceUseCase() {
  const cashbacksRepository = new PrismaCashbacksRepository()
  const useCase = new GetUserCashbackBalanceUseCase(cashbacksRepository)
  return useCase
}
