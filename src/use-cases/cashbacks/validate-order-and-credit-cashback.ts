import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'
import { Decimal } from '@prisma/client/runtime/library'

interface ValidateOrderAndCreditCashbackRequest {
  orderId: string
}

export class ValidateOrderAndCreditCashbackUseCase {
  constructor(
    private orderRepository: OrdersRepository,
    private cashbackRepository: CashbacksRepository,
  ) {}

  async execute({ orderId }: ValidateOrderAndCreditCashbackRequest) {
    console.log(`[UseCase] Buscando pedido com ID: ${orderId}`)
    console.log(`[UseCase] Buscando pedido com ID: ${orderId}`)
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      console.error(`[UseCase] Pedido não encontrado: ${orderId}`)
      throw new ResourceNotFoundError()
    }
    console.log(`[UseCase] Status do pedido: ${order.status}`)
    if (order.status !== 'PENDING') {
      console.error(
        `[UseCase] Pedido não está pendente: Status ${order.status}`,
      )
      throw new Error('Order is not pending.')
    }

    console.log('[UseCase] Calculando valor do cashback...')
    const cashbackAmount = order.orderItems.reduce((acc, item) => {
      try {
        console.log(
          `[UseCase] Processando item: ${item.id}, Subtotal: ${item.subtotal}, % Cashback: ${item.product.cashbackPercentage}`,
        )
        const percentage = item.product.cashbackPercentage / 100
        const itemTotal = item.subtotal || new Decimal(0)
        const itemCashback = itemTotal.toNumber() * percentage
        console.log(`[UseCase] Cashback do item: ${itemCashback}`)
        return acc + itemCashback
      } catch (error) {
        console.error(
          `[UseCase] Erro ao calcular cashback para item ${item.id}:`,
          error,
        )
        throw error
      }
    }, 0)

    console.log(`[UseCase] Total cashback calculado: ${cashbackAmount}`)
    console.log(`[UseCase] Validando pedido: ${orderId}`)
    await this.orderRepository.validateOrder(orderId)

    console.log(`[UseCase] Criando cashback para usuário: ${order.user_id}`)
    const cashback = await this.cashbackRepository.createCashback({
      userId: order.user_id,
      orderId,
      amount: cashbackAmount,
    })

    console.log(`[UseCase] Criando transação de cashback: ${cashbackAmount}`)
    await this.cashbackRepository.createTransaction({
      userId: order.user_id,
      amount: cashbackAmount,
      type: 'RECEIVE',
    })

    console.log('[UseCase] Processo concluído com sucesso')
    return { cashback }
  }
}
