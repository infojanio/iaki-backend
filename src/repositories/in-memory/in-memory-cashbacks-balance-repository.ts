import { Cashback } from '@prisma/client'
<<<<<<< HEAD
import { Decimal } from '@prisma/client/runtime/library';
=======
import { Decimal } from '@prisma/client/runtime/library'
>>>>>>> master

export interface CashbacksRepository {
  findByUserId(userId: string): Promise<Cashback[]>
}

export class InMemoryCashbacksBalanceRepository implements CashbacksRepository {
  public items: Cashback[] = []

  async findByUserId(userId: string): Promise<Cashback[]> {
    return this.items.filter((cashback) => cashback.user_id === userId)
  }

  //total recebido pelo cliente
  async totalCashbackByUserId(userId: string): Promise<number> {
    const saldoReceive = this.items
<<<<<<< HEAD
    .filter((cashback) => cashback.user_id === userId)
    .reduce((total, cashback) => total + new Decimal(cashback.amount).toNumber(), 0); // Converte para número
    console.log("Saldo recebido",saldoReceive)
    return saldoReceive
    }
  
=======
      .filter(
        (cashback) =>
          cashback.user_id === userId &&
          new Decimal(cashback.amount).toNumber() > 0,
      ) // Filtra apenas valores positivos
      .reduce(
        (total, cashback) => total + new Decimal(cashback.amount).toNumber(),
        0,
      ) // Soma os valores positivos

    console.log('Saldo recebido', saldoReceive)
    return saldoReceive
  }
>>>>>>> master

  //total usado pelo cliente
  async totalUsedCashbackByUserId(userId: string): Promise<number> {
    const SaldoUsed = this.items
<<<<<<< HEAD
    .filter((cashback) => cashback.user_id === userId && new Decimal(cashback.amount).toNumber() < 0) // Negativos representam saldo usado
    .reduce((total, cashback) => total + Math.abs(new Decimal(cashback.amount).toNumber()), 0); // Usa Math.abs para somar valores absolutos
    console.log("Saldo usado",SaldoUsed)
    return  SaldoUsed }
=======
      .filter(
        (cashback) =>
          cashback.user_id === userId &&
          new Decimal(cashback.amount).toNumber() < 0,
      ) // Negativos representam saldo usado
      .reduce(
        (total, cashback) =>
          total + Math.abs(new Decimal(cashback.amount).toNumber()),
        0,
      ) // Usa Math.abs para somar valores absolutos
    console.log('Saldo usado', SaldoUsed)
    return SaldoUsed
  }
>>>>>>> master
}
