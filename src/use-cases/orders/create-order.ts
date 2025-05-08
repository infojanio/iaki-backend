// src/use-cases/orders/order.ts - Caso de Uso de Criação do Pedido
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { OrderItem, UserLocation } from '@prisma/client'
import { UserLocationRepository } from '@/repositories/prisma/Iprisma/user-locations-repository'

interface CreateOrderUseCaseRequest {
  user_id: string
  store_id: string
  latitude?: number | null
  longitude?: number | null
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
    // Cria o pedido
    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: items.reduce((total, item) => total + item.subtotal, 0),
      status: 'PENDING',
    })

    // Salva os itens do pedido
    await this.ordersRepository.createOrderItems(order.id, items)

    // Salva a localização do usuário, se fornecida
    if (latitude !== undefined && longitude !== undefined) {
      await this.userLocationRepository.create({
        user_id,
        latitude,
        longitude,
      })
    }

    return order
  }
}
