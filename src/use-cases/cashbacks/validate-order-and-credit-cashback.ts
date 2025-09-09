import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { Decimal } from "@prisma/client/runtime/library";

interface ValidateOrderAndCreditCashbackRequest {
  orderId: string;
}

const EPSILON = new Decimal(0.01); // Tolerância de 1 centavo

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
    const discount = new Decimal(order.discountApplied ?? 0).toDecimalPlaces(2);

    if (discount.greaterThan(0)) {
      const availableBalance = new Decimal(
        await this.cashbackRepository.getBalance(order.user_id)
      ).toDecimalPlaces(2);

      console.log(
        `[UseCase] Verificando saldo disponível: ${availableBalance.toString()} vs desconto: ${discount.toString()}`
      );

      // converte para centavos
      const discountCents = discount.mul(100).toDecimalPlaces(0);
      const balanceCents = availableBalance.mul(100).toDecimalPlaces(0);

      if (balanceCents.lessThan(discountCents)) {
        throw new Error(
          "Saldo de cashback insuficiente para validar o pedido com desconto aplicado."
        );
      }

      await this.cashbackRepository.redeemCashback({
        user_id: order.user_id,
        order_id: order.id,
        amount: discount.toNumber(),
      });

      console.log(`[UseCase] Cashback debitado com sucesso.`);
    }

    // ✅ Valida o pedido
    await this.orderRepository.validateOrder(orderId);

    // ⚠️ NOVA REGRA: se usou desconto, não gera cashback de retorno
    if (discount.greaterThan(0)) {
      console.log(
        `[UseCase] Pedido teve desconto aplicado, cashback de retorno será zero.`
      );
      return {
        cashback: null,
        message:
          "Pedido validado. Cashback foi usado como desconto e não gerará novo cashback.",
      };
    }

    // Percorre os itens do pedido e aplica cashback por produto
    let totalCashbackGerado = 0;

    for (const item of order.orderItems) {
      if (!item.product || item.product.cashback_percentage === undefined) {
        continue;
      }

      const percentual = item.product.cashback_percentage;
      const valorTotalItem = new Decimal(item.subtotal ?? 0).toNumber();

      await this.cashbackRepository.applyCashback(
        order.id,
        order.user_id,
        valorTotalItem,
        percentual
      );

      const cashbackItem = valorTotalItem * (percentual / 100);
      totalCashbackGerado += cashbackItem;
    }

    if (totalCashbackGerado > 0) {
      console.log(
        `[UseCase] Cashback total gerado: R$ ${totalCashbackGerado.toFixed(2)}`
      );
      return {
        cashback: totalCashbackGerado,
        message: `Pedido validado com sucesso. Cashback de R$ ${totalCashbackGerado.toFixed(
          2
        )} gerado.`,
      };
    } else {
      console.log(`[UseCase] Nenhum cashback gerado.`);
      return {
        cashback: null,
        message: `Pedido validado. Nenhum item com cashback aplicável.`,
      };
    }
  }
}
