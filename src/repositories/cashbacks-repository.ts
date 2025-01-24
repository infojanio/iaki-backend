import { Cashback } from '@prisma/client'

export interface CashbacksRepository {

  totalCashbackByUserId(userId: string): Promise<number>;
  totalUsedCashbackByUserId(userId: string): Promise<number>;
}


