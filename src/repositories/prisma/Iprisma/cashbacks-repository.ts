import { Cashback, Prisma } from '@prisma/client'

export interface CashbacksRepository {
  totalCashbackByUserId(user_id: string): Promise<number>
  totalUsedCashbackByUserId(user_id: string): Promise<number>
  findByUserId(user_id: string): Promise<Cashback[]>
  applyCashback(
    order_id: string,
    user_id: string,
    amount: number,
  ): Promise<void> // ✅ Corrigido
}
