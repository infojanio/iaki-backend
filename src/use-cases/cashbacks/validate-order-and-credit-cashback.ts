import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'

interface ValidateOrderAndCreditCashbackRequest {
  orderId: string
}

export class ValidateOrderAndCreditCashbackUseCase {
  constructor(
    private orderRepository: OrdersRepository,
    private cashbackRepository: CashbacksRepository,
  ) {}

  async execute({ orderId }: ValidateOrderAndCreditCashbackRequest) {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new ResourceNotFoundError()
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order is not pending.')
    }

    const cashbackAmount = order.orderItems.reduce((acc, item) => {
      const percentage = item.product.cashbackPercentage / 100
      const itemTotal = item.subtotal
      return acc + itemTotal.toNumber() * percentage
    }, 0)

    await this.orderRepository.validateOrder(orderId)

    const cashback = await this.cashbackRepository.createCashback({
      userId: order.user_id,
      orderId,
      amount: cashbackAmount,
    })

    await this.cashbackRepository.createTransaction({
      userId: order.user_id,
      amount: cashbackAmount,
      type: 'RECEIVE',
    })

    return {
      cashback,
    }
  }
}
