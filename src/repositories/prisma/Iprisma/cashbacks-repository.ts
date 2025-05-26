import { Cashback, Prisma } from '@prisma/client'

export interface CashbacksRepository {
  totalCashbackByUserId(user_id: string): Promise<number>
  totalUsedCashbackByUserId(user_id: string): Promise<number>
  findByUserId(user_id: string): Promise<Cashback[]>
  findById(cashbackId: string): Promise<Cashback | null>
  getBalance(user_id: string): Promise<number>
  validateCashback(cashbackId: string): Promise<void>
  applyCashback(
    order_id: string | null,
    user_id: string,
    amount: number,
  ): Promise<void> // ✅ Corrigido
}
