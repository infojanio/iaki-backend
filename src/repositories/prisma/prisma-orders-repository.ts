import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { Order, OrderItem, OrderStatus, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'
import QRCode from 'qrcode'

export class PrismaOrdersRepository implements OrdersRepository {
  prisma: any

  async findById(orderId: string) {
    console.log(`[Repository] Buscando pedido com ID: ${orderId}`)

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  cashback_percentage: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!order) {
        console.log(`[Repository] Pedido não encontrado: ${orderId}`)
        return null
      }

      console.log(`[Repository] Pedido encontrado:`, {
        id: order.id,
        status: order.status,
        itemsCount: order.orderItems.length,
      })

      return order
    } catch (error) {
      console.error(`[Repository] Erro ao buscar pedido ${orderId}:`, error)
      throw error
    }
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
        status: status || undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true, // Inclui os detalhes do produto
          },
        },
      },
      skip: (page - 1) * 10,
      take: 20,
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
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashback_percentage: item.product.cashback_percentage,
        },
        quantity: new Decimal(item.quantity).toNumber(), // Convertendo para number
      })),
    }))
  }

  async findManyWithItems(page: number, status: OrderStatus, storeId?: string) {
    const orders = await prisma.order.findMany({
      where: {
        status: status || undefined,
        store_id: storeId || undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      skip: (page - 1) * 10,
      take: 50,
      orderBy: {
        created_at: 'desc',
      },
    })

    return orders.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined,
      status: order.status as string,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashback_percentage: item.product.cashback_percentage,
        },
        quantity: new Decimal(item.quantity).toNumber(),
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
        id: { contains: orderId }, // Busca por parte do ID
        status: status || undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      take: 1, // Retorna apenas o primeiro resultado
      orderBy: { created_at: 'desc' },
    })

    return orders.map((order) => ({
      id: order.id,
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined,
      status: order.status as string,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashback_percentage: item.product.cashback_percentage,
        },
        quantity: new Decimal(item.quantity).toNumber(),
      })),
    }))
  }

  async create(data: Prisma.OrderUncheckedCreateInput) {
    const order = await prisma.order.create({
      data: {
        ...data,
        // Garante que discountApplied seja salvo
        discountApplied: data.discountApplied ?? 0,
      },
    })

    const qrCodeUrl = await QRCode.toDataURL(order.id)

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { qrCodeUrl },
      include: {
        orderItems: true,
      },
    })

    return {
      ...updatedOrder,
      // Garante que o valor seja retornado mesmo se for zero
      discountApplied: updatedOrder.discountApplied ?? 0,
    }
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

  async markAsValidated(order_id: string): Promise<void> {
    await prisma.order.update({
      where: { id: order_id },
      data: { validated_at: new Date() },
    })
  }

  async validateOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new Error('Order not found.')

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'VALIDATED',
        validated_at: new Date(),
      },
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

  async getItemsByOrderId(
    orderId: string,
  ): Promise<
    (OrderItem & {
      product: {
        id: string
        name: string
        price: number | Decimal
        cashback_percentage: number
        image: string | null
        store: {
          id: string
          name: string
        }
      }
    })[]
  > {
    return await prisma.orderItem.findMany({
      where: {
        order_id: orderId,
      },
      include: {
        product: {
          include: {
            store: true,
          },
        },
      },
    })
  }
}
