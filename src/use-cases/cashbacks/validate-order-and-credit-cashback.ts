import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { Decimal } from "@prisma/client/runtime/library";

interface ValidateOrderAndCreditCashbackRequest {
  orderId: string;
}

export class ValidateOrderAndCreditCashbackUseCase {
  constructor(
    private orderRepository: OrdersRepository,
    private cashbackRepository: CashbacksRepository
  ) {}

  async execute({ orderId }: ValidateOrderAndCreditCashbackRequest) {
    console.log(`[UseCase] Buscando pedido com ID: ${orderId}`);
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new ResourceNotFoundError();
    }

    if (order.status !== "PENDING") {
      throw new Error(
        `Pedido não está pendente. Status atual: ${order.status}`
      );
    }

    await this.orderRepository.validateOrder(orderId);

    const discount = new Decimal(order.discountApplied ?? 0);

    // ✅ Se o usuário usou cashback como desconto, registra apenas o débito
    if (discount.greaterThan(0)) {
      console.log(
        `[UseCase] Desconto aplicado via cashback: -${discount.toFixed(2)}`
      );

      // Apenas debita cashback
      await this.cashbackRepository.redeemCashback({
        user_id: order.user_id,
        order_id: order.id,
        amount: discount.toNumber(),
      });

      await this.cashbackRepository.createTransaction({
        user_id: order.user_id,
        amount: discount.toNumber(),
        type: "USE",
      });

      console.log(`[UseCase] Cashback debitado com sucesso.`);
      return {
        cashback: null,
        message: `Cashback usado no pedido e debitado corretamente.`,
      };
    }

    // ✅ Nenhum desconto aplicado => gera crédito normalmente
    let cashbackAmount = 0;

    for (const item of order.orderItems) {
      const itemSubtotal = new Decimal(item.subtotal ?? 0);
      const cashbackPercent = item.product.cashback_percentage / 100;
      const itemCashback = itemSubtotal.mul(cashbackPercent).toNumber();
      cashbackAmount += itemCashback;
    }

    if (cashbackAmount > 0) {
      console.log(`[UseCase] Cashback a gerar: +${cashbackAmount.toFixed(2)}`);

      const cashback = await this.cashbackRepository.createCashback({
        userId: order.user_id,
        orderId: order.id,
        amount: cashbackAmount,
      });

      await this.cashbackRepository.createTransaction({
        user_id: order.user_id,
        amount: cashbackAmount,
        type: "RECEIVE",
      });

      console.log(`[UseCase] Cashback gerado com sucesso.`);
      return {
        cashback,
        message: `Cashback de ${cashbackAmount.toFixed(2)} gerado com sucesso.`,
      };
    }

    console.log(`[UseCase] Nenhum cashback gerado.`);
    return {
      cashback: null,
      message: `Pedido validado, mas nenhum cashback aplicável.`,
    };
  }
}
