//get-order.ts
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { OrderItem } from '@prisma/client'

interface GetOrderUseCaseRequest {
  orderId: string
}

interface GetOrderUseCaseResponse {
  orderItems: OrderItem[]
}

export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const orderItems = await this.ordersRepository.getItemsByOrderId(orderId)
    return { orderItems }
  }
}
