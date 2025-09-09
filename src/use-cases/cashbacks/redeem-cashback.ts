import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";

interface RedeemCashbackUseCaseRequest {
  user_id: string;
  order_id: string; // Agora recebe o ID do pedido em vez do produto
  amount: number;
}

export class RedeemCashbackUseCase {
  constructor(
    private cashbacksRepository: CashbacksRepository,
    private ordersRepository: OrdersRepository // Troca ProductsRepository por OrdersRepository
  ) {}

  async execute({ user_id, order_id, amount }: RedeemCashbackUseCaseRequest) {
    // Validação básica do amount
    if (amount <= 0) {
      throw new Error("O valor deve ser positivo.");
    }

    // Verifica saldo disponível
    const balance = await this.cashbacksRepository.getBalance(user_id);
    if (balance < amount) {
      throw new Error("Saldo de cashback insuficiente.");
    }

    // 🔒 Comparação segura com tolerância
    if (balance + 0.001 < amount) {
      throw new Error("Saldo de cashback insuficiente.");
    }

    // Busca o pedido em vez do produto
    const order = await this.ordersRepository.findById(order_id);
    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    // Verifica se o valor do cashback não excede o total do pedido
    if (amount > order.totalAmount.toNumber()) {
      throw new Error("O valor do cashback excede o total do pedido.");
    }

    // Cria a transação de uso do cashback
    await this.cashbacksRepository.createTransaction({
      user_id: user_id,
      amount,
      type: "USE",
    });

    // Registra o débito no cashback vinculado ao pedido
    await this.cashbacksRepository.redeemCashback({
      user_id,
      order_id, // Vincula ao pedido que recebeu o desconto
      amount: -amount, // Valor negativo para débito
    });
  }
}
