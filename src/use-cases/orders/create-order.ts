import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { UserLocationRepository } from '@/repositories/prisma/Iprisma/user-locations-repository'
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

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
    private productsRepository: ProductsRepository, // <- novo
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

    // Atualiza o estoque dos produtos e status
    for (const item of items) {
      const product = await this.productsRepository.findByIdProduct(
        item.product_id,
      )

      if (!product) {
        throw new Error(`Produto com ID ${item.product_id} não encontrado.`)
      }

      const newQuantity = product.quantity - item.quantity

      if (newQuantity < 0) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}.`)
      }

      await this.productsRepository.updateQuantity(product.id, {
        quantity: newQuantity,
        status: newQuantity > 0, // desativa se quantidade for 0
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
