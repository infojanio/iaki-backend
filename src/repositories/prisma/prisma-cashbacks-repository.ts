import { prisma } from '@/lib/prisma'
import { CashbacksRepository } from './Iprisma/cashbacks-repository'
import { Cashback, Prisma } from '@prisma/client'

export class PrismaCashbacksRepository implements CashbacksRepository {
  // Retorna o total de cashback recebido pelo usuário
  async totalCashbackByUserId(user_id: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { user_id, amount: { gt: 0 } }, // Considera apenas valores positivos
    })

    return (result._sum.amount ?? new Prisma.Decimal(0)).toNumber()
  }

  // Retorna o total de cashback utilizado pelo usuário
  async totalUsedCashbackByUserId(user_id: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { user_id, amount: { lt: 0 } }, // Considera apenas valores negativos
    })

    return Math.abs((result._sum.amount ?? new Prisma.Decimal(0)).toNumber())
  }

  // Retorna uma lista de cashbacks do usuário
  async findByUserId(user_id: string): Promise<Cashback[]> {
    return await prisma.cashback.findMany({
      where: { user_id },
      orderBy: { credited_at: 'desc' },
    })
  }

  async findById(cashbackId: string): Promise<Cashback | null> {
    const cashback = await prisma.cashback.findUnique({
      where: {
        id: cashbackId,
      },
    })

    if (!cashback) {
      return null
    }

    return {
      id: cashback.id,
      order_id: cashback.order_id,
      user_id: cashback.user_id,
      amount: cashback.amount,
      validated: cashback.validated,
      credited_at: cashback.credited_at,
    }
  }

  async validateCashback(id: string) {
    await prisma.cashback.update({
      where: { id },
      data: { validated: true },
    })
  }

  async createCashback({
    userId,
    orderId,
    amount,
  }: {
    userId: string
    orderId: string
    amount: number
  }): Promise<Cashback> {
    console.log(
      `[Repository] Criando cashback - User: ${userId}, Order: ${orderId}, Amount: ${amount}`,
    )

    try {
      const decimalAmount = new Prisma.Decimal(amount)
      console.log(
        `[Repository] Valor convertido para Decimal: ${decimalAmount}`,
      )

      const cashback = await prisma.cashback.create({
        data: {
          user_id: userId,
          order_id: orderId,
          amount: decimalAmount,
          validated: true,
          credited_at: new Date(),
        },
      })

      console.log(`[Repository] Cashback criado com ID: ${cashback.id}`)
      return cashback
    } catch (error) {
      console.error('[Repository] Erro ao criar cashback:', error)
      throw error
    }
  }

  async createTransaction({
    user_id,
    amount,
    type,
  }: {
    user_id: string
    amount: number
    type: 'RECEIVE' | 'USE'
  }) {
    return await prisma.cashbackTransaction.create({
      data: {
        user_id,
        amount,
        type,
      },
    })
  }

  async getBalance(user_id: string): Promise<number> {
    const total = await this.totalCashbackByUserId(user_id)
    const used = await this.totalUsedCashbackByUserId(user_id)
    return total - used
  }

  async redeemCashback({
    user_id,
    order_id,
    amount,
  }: {
    user_id: string
    order_id: string
    amount: number
  }) {
    return await prisma.cashback.create({
      data: {
        user_id,
        order_id,
        amount,
        validated: true,
        credited_at: new Date(),
      },
    })
  }

  // ✅ Aplica cashback ao pedido
  async applyCashback(
    order_id: string,
    user_id: string,
    amount: number,
  ): Promise<void> {
    await prisma.cashback.create({
      data: {
        order_id,
        user_id, // ✅ Corrigido
        amount,
        credited_at: new Date(), // ✅ Definindo data de crédito
      },
    })
  }
}
