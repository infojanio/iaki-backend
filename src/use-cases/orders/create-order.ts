import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { StoresRepository } from '@/repositories/prisma/Iprisma/stores-repository'
import { Order, OrderStatus } from '@prisma/client'
import { OrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'

interface OrderItem {
  product_id: string
  quantity: number
  subtotal: number
}

interface OrderUseCaseRequest {
  id?: string
  user_id: string
  store_id: string
  totalAmount?: number
  created_at?: Date
  validated_at?: Date | null
  status?: OrderStatus
  items: OrderItem[]
}

interface OrderUseCaseResponse {
  order: Order
  storeMapUrl: string
}

export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
    private orderItemsRepository: OrderItemsRepository,
    private storesRepository: StoresRepository,
    private usersRepository: UsersRepository,
    private cashbacksRepository: CashbacksRepository,
  ) {}

  async execute({
    user_id,
    store_id,
    items,
    created_at = new Date(),
  }: OrderUseCaseRequest): Promise<OrderUseCaseResponse> {
    const userExists = await this.usersRepository.findById(user_id)
    if (!userExists) throw new Error('Usuário não encontrado.')

    const storeExists = await this.storesRepository.findById(store_id)
    if (!storeExists) throw new Error('Loja não encontrada.')

    const storeMapUrl = `https://www.google.com/maps/search/?api=1&query=${storeExists.latitude},${storeExists.longitude}`

    const productIds = items.map((item) => item.product_id)
    const products = await this.productsRepository.findByIds(productIds)

    let totalAmount = new Decimal(0)
    let totalCashback = new Decimal(0)

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id)
      if (!product)
        throw new Error(`Produto ${item.product_id} não encontrado.`)

      const itemPrice = new Decimal(product.price)
      const itemQuantity = new Decimal(item.quantity)
      const itemCashback = new Decimal(product.cashbackPercentage || 0)

      totalAmount = totalAmount.plus(itemPrice.times(itemQuantity))
      totalCashback = totalCashback.plus(
        itemPrice.times(itemQuantity).times(itemCashback.div(100)),
      )
    }

    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          user_id,
          store_id,
          totalAmount: totalAmount.toNumber(),
          status: 'PENDING',
          created_at,
        },
      })

      await this.orderItemsRepository.create(
        newOrder.id,
        items.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          subtotal: new Decimal(item.subtotal).toNumber(),
        })),
      )

      if (totalCashback.gt(0)) {
        // Cashback apenas calculado, não creditado ainda
        console.log(`Cashback calculado: ${totalCashback.toFixed(2)}`)
      }

      return newOrder
    })

    return { order, storeMapUrl }
  }
}
