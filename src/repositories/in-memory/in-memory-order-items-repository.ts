import { prisma } from '@/lib/prisma'
import { Prisma, OrderItem } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'

export interface OrderItemsRepository {
  create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>
  findByOrderId(order_id: string): Promise<OrderItem[]>
}

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  async create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Verifica se o pedido já existe antes de adicionar os itens
      const orderExists = await tx.order.findUnique({
        where: { id: order_id },
      })

      if (!orderExists) {
        throw new Error(`Pedido com ID ${order_id} não encontrado.`)
      }

      // Cria os itens do pedido
      await tx.orderItem.createMany({
        data: items.map((item) => ({
          order_id: order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      })
    })
  }

  public items: OrderItem[] = []

  async createMany(
    orderItems: {
      order_id: string
      product_id: string
      quantity: Decimal
      subtotal: Decimal
    }[],
  ) {
    // Verifica se o pedido existe antes de criar os itens
    const orderIds = [...new Set(orderItems.map((item) => item.order_id))]

    for (const order_id of orderIds) {
      const orderExists = await prisma.order.findUnique({
        where: { id: order_id },
      })

      if (!orderExists) {
        throw new Error(`Pedido com ID ${order_id} não encontrado.`)
      }
    }

    const newItems = orderItems.map((item) => ({
      id: randomUUID(),
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      subtotal: item.subtotal,
      created_at: new Date(),
    }))

    this.items.push(...newItems)

    return newItems
  }

  async findByOrderId(order_id: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: { order_id: order_id },
    })
  }
}
