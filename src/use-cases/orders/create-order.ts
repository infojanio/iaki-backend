import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { OrderItem, UserLocation } from '@prisma/client'
import { UserLocationRepository } from '@/repositories/prisma/Iprisma/user-locations-repository'

interface CreateOrderUseCaseRequest {
  user_id: string
  store_id: string
  latitude?: number
  longitude?: number
  items: {
    product_id: string
    quantity: number
    subtotal: number
  }[]
}

export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userLocationRepository: UserLocationRepository,
  ) {}

  async execute({
    user_id,
    store_id,
    latitude,
    longitude,
    items,
  }: CreateOrderUseCaseRequest) {
    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: items.reduce((total, item) => total + item.subtotal, 0),
      status: 'PENDING',
    })

    await this.ordersRepository.createOrderItems(order.id, items)

    if (latitude !== undefined && longitude !== undefined) {
      await this.userLocationRepository.create({
        user_id,
        latitude,
        longitude,
      })
    }

    return {
      id: order.id,
      qrCodeUrl: order.qrCodeUrl,
      totalAmount: order.totalAmount,
      status: order.status,
    }
  }
}
