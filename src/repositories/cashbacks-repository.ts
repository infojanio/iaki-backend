import { Cashback } from '@prisma/client'

export interface CashbacksRepository {
<<<<<<< HEAD

  totalCashbackByUserId(userId: string): Promise<number>;
  totalUsedCashbackByUserId(userId: string): Promise<number>;
=======
  // findByUserId(userId: string): Promise<Cashback[]>
  // balanceByUserId(userId: string): Promise<number>
  totalCashbackByUserId(userId: string): Promise<number>
  totalUsedCashbackByUserId(userId: string): Promise<number>
>>>>>>> master
}


