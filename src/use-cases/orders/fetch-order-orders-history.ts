// src/use-cases/fetch-user-orders-history.ts
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { OrderStatus } from '@prisma/client'

interface FetchOrderOrdersHistoryUseCaseRequest {
  orderId: string
  page: number
  status?: OrderStatus
}

interface FetchOrderOrdersHistoryUseCaseResponse {
  orders: Array<{
    id: string
    store_id: string
    totalAmount: number
    qrCodeUrl?: string // Agora é string | undefined
    status: string
    validated_at: Date | null
    created_at: Date
    items: Array<{
      product: {
        //  id: string
        name: string
        image: string | null
        price: number
        cashbackPercentage: number
      }
      quantity: number
    }>
  }>
}

export class FetchOrderOrdersHistoryUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    page,
    status,
  }: FetchOrderOrdersHistoryUseCaseRequest): Promise<
    FetchOrderOrdersHistoryUseCaseResponse
  > {
    const orders = await this.ordersRepository.findManyByOrderIdWithItems(
      orderId,
      page,
      status,
    )

    return {
      orders: orders.map((order) => ({
        ...order,
        qrCodeUrl: order.qrCodeUrl ?? undefined, // Garantindo que qrCodeUrl seja string | undefined
        items: order.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: item.product.image ?? '',
          },
        })),
      })),
    }
  }
}
