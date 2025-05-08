import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { Order, OrderStatus, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'

export class PrismaOrdersRepository implements OrdersRepository {
  async findById(id: string): Promise<Order | null> {
    return await prisma.order.findUnique({ where: { id } })
  }

  async updateStatus(
    order_id: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    return prisma.order.update({
      where: { id: order_id },
      data: { status },
    })
  }

  async findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null> {
    const oneHourAgo = dayjs(date).subtract(1, 'hour').toDate()

    return await prisma.order.findFirst({
      where: { user_id: userId, created_at: { gte: oneHourAgo } },
    })
  }

  async findManyByUserId(userId: string, page: number): Promise<Order[]> {
    return await prisma.order.findMany({
      where: { user_id: userId },
      skip: (page - 1) * 20,
      take: 20,
    })
  }

  async create(data: Prisma.OrderUncheckedCreateInput) {
    return await prisma.order.create({ data })
  }

  async createOrderItems(
    order_id: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void> {
    if (items.length === 0) return

    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id: order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    })
  }

  async save(order: Order): Promise<Order> {
    return await prisma.order.upsert({
      where: { id: order.id },
      update: order,
      create: order,
    })
  }

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await prisma.cashback.findMany({
      where: { user_id: userId, order: { validated_at: { not: null } } },
      select: { amount: true },
    })

    return validatedCashbacks.reduce(
      (acc, cashback) => acc + new Prisma.Decimal(cashback.amount).toNumber(),
      0,
    )
  }

  async findPendingCartByUserId(userId: string) {
    const order = await prisma.order.findFirst({
      where: { user_id: userId, status: 'PENDING' },
      include: {
        store: { select: { id: true, name: true } },
        orderItems: { include: { product: true } },
      },
    })

    if (!order) return null

    return {
      id: order.id,
      store: order.store,
      totalAmount: new Prisma.Decimal(order.totalAmount).toNumber(),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        subtotal: new Prisma.Decimal(item.subtotal).toNumber(),
        product: { ...item.product },
      })),
    }
  }
}
