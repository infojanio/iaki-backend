import { Order, OrderItem, OrderStatus, Prisma, Product } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export type OrderWithItemsAndProducts = Order & {
  orderItems: (OrderItem & {
    product: Product
  })[]
}

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>

  createOrderItems(
    orderId: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void>

  findById(orderId: string): Promise<OrderWithItemsAndProducts | null>
  validateOrder(orderId: string): Promise<void>
  markAsValidated(order_id: string): Promise<void>
  findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null>

  findManyWithItems(
    page: number,
    status?: OrderStatus,
    storeId?: string,
  ): Promise<
    Array<{
      id: string
      store_id: string
      user_id: string
      totalAmount: number
      qrCodeUrl?: string | null // Permitir null
      status: string
      validated_at: Date | null
      created_at: Date
      items: Array<{
        product: {
          id: string
          name: string
          image: string | null
          price: number
          cashbackPercentage: number
        }
        quantity: number
      }>
    }>
  >

  findManyByOrderIdWithItems(
    orderId: string,
    page: number,
    status?: string,
  ): Promise<
    Array<{
      id: string
      store_id: string
      totalAmount: number
      qrCodeUrl?: string | null // Permitir null
      status: string
      validated_at: Date | null
      created_at: Date
      items: Array<{
        product: {
          id: string
          name: string
          image: string | null
          price: number
          cashbackPercentage: number
        }
        quantity: number
      }>
    }>
  >

  findManyByUserIdWithItems(
    userId: string,
    page: number,
    status?: string,
  ): Promise<
    Array<{
      id: string
      store_id: string
      totalAmount: number
      qrCodeUrl?: string | null // Permitir null
      status: string
      validated_at: Date | null
      created_at: Date
      items: Array<{
        product: {
          id: string
          name: string
          image: string | null
          price: number
          cashbackPercentage: number
        }
        quantity: number
      }>
    }>
  >

  save(order: Order): Promise<Order>
  balanceByUserId(userId: string): Promise<number | Decimal>

  updateStatus(orderId: string, status: OrderStatus): Promise<Order | null>

  getItemsByOrderId(orderId: string): Promise<OrderItem[]>
}
