import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'

interface ValidateCashbackUseCaseRequest {
  cashbackId: string
}

export class ValidateCashbackUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({ cashbackId }: ValidateCashbackUseCaseRequest) {
    const cashback = await this.cashbacksRepository.findById(cashbackId)

    if (!cashback) {
      throw new Error('Cashback not found.')
    }

    if (cashback.validated) {
      throw new Error('Cashback already validated.')
    }

    await this.cashbacksRepository.validateCashback(cashbackId)
  }
}
