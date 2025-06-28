import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";

interface GetUserCashbackTransactionsRequest {
  user_id: string;
}

export class GetUserCashbackTransactionsUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({ user_id }: GetUserCashbackTransactionsRequest) {
    const transactions = await this.cashbacksRepository.getTransactionsByUserId(
      user_id
    );
    return { transactions };
  }
}
