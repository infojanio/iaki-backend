import { validateCashback } from '@/http/controllers/cashbacks/validate-cashback'
import { Cashback, CashbackTransaction, Prisma } from '@prisma/client'
import { string, number } from 'zod'

export interface CashbacksRepository {
  totalCashbackByUserId(user_id: string): Promise<number>
  totalUsedCashbackByUserId(user_id: string): Promise<number>
  findByUserId(user_id: string): Promise<Cashback[]>
  findById(cashbackId: string): Promise<Cashback | null>
  getBalance(user_id: string): Promise<number>

  createCashback(data: {
    userId: string
    orderId: string
    amount: number
  }): Promise<Cashback>

  createTransaction(data: {
    userId: string
    amount: number
    type: 'RECEIVE' | 'USE'
  }): Promise<CashbackTransaction>

  validateCashback(cashbackId: string): Promise<void>
  applyCashback(
    order_id: string | null,
    user_id: string,
    amount: number,
  ): Promise<void> // ✅ Corrigido
}
