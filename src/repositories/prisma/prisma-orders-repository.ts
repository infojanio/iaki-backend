import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/orders-repository'
import { Order, Prisma, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
export class PrismaOrdersRepository implements OrdersRepository {
  private items: Order[] = [] // Garante que é sempre um array
  private prisma = new PrismaClient()
  //retorna 1 pedido por id
  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    })
    return order
  }

  /*
  //encontra pedido feito em 1 dia
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    const order = await prisma.order.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
    return order
  }

  //encontra pedido feito em 1 hora
  async findByUserIdOnHour(userId: string, date: Date) {
    const startOfTheHour = dayjs(date).startOf('hour')
    const endOfTheHour = dayjs(date).endOf('hour')
    const order = await prisma.order.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheHour.toDate(), //o pedido foi feito após o início desse horário
          lte: endOfTheHour.toDate(), //o pedido foi feito antes do início desse horário
        },
      },
    })

    return order
  }
*/
  //encontra pedido feito em 1 hora
  async findByUserIdLastHour(userId: string): Promise<Order | null> {
    if (!this.items || !Array.isArray(this.items)) {
      return null
    }

    const oneHourAgo = dayjs().subtract(1, 'hour')

    const orderInLastHour = this.items.find((order) => {
      return (
        order.user_id === userId && dayjs(order.created_at).isAfter(oneHourAgo) // Deve estar dentro da última hora
      )
    })

    return orderInLastHour || null
  }
  //retorna vários pedidos por id cliente
  async findManyByUserId(userId: string, page: number) {
    const orders = await prisma.order.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })
    return orders
  }

  //conta n. pedidos por userId
  async countByUserId(userId: string) {
    const count = await prisma.order.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }
  async create(data: Prisma.OrderUncheckedCreateInput) {
    const order = await prisma.order.create({
      data,
    })
    return order
  }
  async save(data: Order) {
    try {
      const order = await prisma.order.upsert({
        where: { id: data.id },
        update: data,
        create: data, // Se o pedido não existir, ele será criado
      })
      return order
    } catch (error) {
      console.error('Erro ao salvar pedido:', error)
      throw new Error('Erro ao salvar pedido.')
    }
  }

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await this.prisma.cashback.findMany({
      where: {
        user_id: userId,
        order: {
          validated_at: {
            not: null, // Considera apenas pedidos validados
          },
        },
      },
      select: {
        amount: true,
      },
    })

    const balance = validatedCashbacks.reduce(
      (acc, cashback) => acc + cashback.amount.toNumber(),
      0,
    )

    return balance
  }
}
