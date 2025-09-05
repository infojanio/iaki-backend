import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";

interface ValidateCashbackUseCaseRequest {
  order_id: string;
  user_id: string;
  cashbackAmount: number;
}

export class ValidateCashback {
  constructor(
    private cashbacksRepository: CashbacksRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    order_id,
    user_id,
    cashbackAmount,
  }: ValidateCashbackUseCaseRequest): Promise<void> {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.user_id !== user_id) {
      throw new Error("Unauthorized operation.");
    }

    if (order.validated_at) {
      throw new Error("Cashback already validated for this order.");
    }

    /* Aplica cashback positivo
    await this.cashbacksRepository.applyCashback(
      order_id,
      user_id,
      cashbackAmount,
    )
      */

    // Atualiza o pedido como validado
    await this.ordersRepository.markAsValidated(order_id);
  }
}
