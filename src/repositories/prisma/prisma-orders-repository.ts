import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { Order, OrderStatus, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'
import QRCode from 'qrcode'

export class PrismaOrdersRepository implements OrdersRepository {
  prisma: any
  async findById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                image: true,
                cashbackPercentage: true,
              },
            },
          },
        },
      },
    })
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

  async findManyByUserIdWithItems(
    userId: string,
    page: number,
    status?: OrderStatus,
  ) {
    const orders = await prisma.order.findMany({
      where: {
        user_id: userId,
        status: status ? status : undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true, // Inclui os detalhes do produto
          },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        created_at: 'desc',
      },
    })

    // Normalizando os dados retornados
    return orders.map((order) => ({
      id: order.id,
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined, // Convertendo null para undefined
      status: order.status as string,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashbackPercentage: item.product.cashbackPercentage,
        },
        quantity: new Decimal(item.quantity).toNumber(), // Convertendo para number
      })),
    }))
  }

  async findManyByOrderIdWithItems(
    orderId: string,
    page: number,
    status?: OrderStatus,
  ) {
    const orders = await prisma.order.findMany({
      where: {
        id: orderId,
        status: status ? status : undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true, // Inclui os detalhes do produto
          },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        created_at: 'desc',
      },
    })

    // Normalizando os dados retornados
    return orders.map((order) => ({
      id: order.id,
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined, // Convertendo null para undefined
      status: order.status as string,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashbackPercentage: item.product.cashbackPercentage,
        },
        quantity: new Decimal(item.quantity).toNumber(), // Convertendo para number
      })),
    }))
  }

  async create(data: Prisma.OrderUncheckedCreateInput) {
    const order = await prisma.order.create({ data })

    const qrCodeUrl = await QRCode.toDataURL(order.id)

    await prisma.order.update({
      where: { id: order.id },
      data: { qrCodeUrl },
    })

    return { ...order, qrCodeUrl }
  }

  async createOrderItems(
    order_id: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ) {
    if (items.length === 0) return

    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id,
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
}
