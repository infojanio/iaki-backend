import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'
import { Cashback } from '@prisma/client'

interface GetUserCashbackHistoryUseCaseRequest {
  user_id: string
}

interface GetUserCashbackHistoryUseCaseResponse {
  cashbacks: Cashback[]
}

export class GetUserCashbackHistory {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({
    user_id,
  }: GetUserCashbackHistoryUseCaseRequest): Promise<
    GetUserCashbackHistoryUseCaseResponse
  > {
    const cashbacks = await this.cashbacksRepository.findByUserId(user_id)

    return {
      cashbacks,
    }
  }
}
