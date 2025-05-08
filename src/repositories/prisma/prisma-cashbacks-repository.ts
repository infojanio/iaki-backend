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
