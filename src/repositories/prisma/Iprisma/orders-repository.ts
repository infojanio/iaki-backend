import { Order, OrderStatus, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>

  createOrderItems(
    orderId: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void>

  findById(id: string): Promise<Order | null>
  findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null>

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
}
