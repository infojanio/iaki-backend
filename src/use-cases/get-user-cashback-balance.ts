<<<<<<< HEAD
import { OrdersRepository } from '@/repositories/orders-repository';
import { CashbacksRepository } from '@/repositories/cashbacks-repository';
=======
import { CashbacksRepository } from '@/repositories/cashbacks-repository'
>>>>>>> master

interface GetUserCashbackBalanceUseCaseRequest {
  userId: string;
}

interface GetUserCashbackBalanceUseCaseResponse {
  balance: number;
}

export class GetUserCashbackBalanceUseCase {
  constructor(
<<<<<<< HEAD
  //  private ordersRepository: OrdersRepository,
    private cashbacksRepository: CashbacksRepository
=======
    //  private ordersRepository: OrdersRepository,
    private cashbacksRepository: CashbacksRepository,
>>>>>>> master
  ) {}

  async execute(
    request: GetUserCashbackBalanceUseCaseRequest
  ): Promise<GetUserCashbackBalanceUseCaseResponse> {
    const { userId } = request;

    // Soma dos cashbacks recebidos
<<<<<<< HEAD
    const receivedCashback = await this.cashbacksRepository.totalCashbackByUserId(userId);
=======
    const receivedCashback = await this.cashbacksRepository.totalCashbackByUserId(
      userId,
    )

    // Soma dos cashbacks usados
    const usedCashback = await this.cashbacksRepository.totalUsedCashbackByUserId(
      userId,
    )

    // Calcula o saldo atual
    const balance = receivedCashback - usedCashback
>>>>>>> master

    // Soma dos cashbacks usados
    const usedCashback = await this.cashbacksRepository.totalUsedCashbackByUserId(userId);

    // Calcula o saldo atual
    const balance = receivedCashback - usedCashback;
console.log('Extrato:', balance)
    return { balance };
  }
}