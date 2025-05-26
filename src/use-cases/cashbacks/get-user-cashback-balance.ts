import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'

interface GetUserCashbackBalanceUseCaseRequest {
  user_id: string
}

interface GetUserCashbackBalanceUseCaseResponse {
  totalReceived: number
  totalUsed: number
  balance: number
}

export class GetUserCashbackBalanceUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({
    user_id,
  }: GetUserCashbackBalanceUseCaseRequest): Promise<
    GetUserCashbackBalanceUseCaseResponse
  > {
    const totalCashback =
      (await this.cashbacksRepository.totalCashbackByUserId(user_id)) || 0

    const usedCashback =
      (await this.cashbacksRepository.totalUsedCashbackByUserId(user_id)) || 0

    const balance = totalCashback - usedCashback

    return {
      totalReceived: totalCashback,
      totalUsed: usedCashback,
      balance,
    }
  }
}
