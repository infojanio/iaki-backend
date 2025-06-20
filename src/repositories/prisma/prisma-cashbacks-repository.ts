import { prisma } from "@/lib/prisma";
import { CashbacksRepository } from "./Iprisma/cashbacks-repository";
import { Cashback, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaCashbacksRepository implements CashbacksRepository {
  async totalCashbackByUserId(user_id: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { user_id, amount: { gt: 0 } },
    });
    return (result._sum.amount ?? new Decimal(0)).toNumber();
  }

  async totalUsedCashbackByUserId(user_id: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { user_id, amount: { lt: 0 } },
    });
    return Math.abs((result._sum.amount ?? new Decimal(0)).toNumber());
  }

  async findByUserId(user_id: string): Promise<Cashback[]> {
    return prisma.cashback.findMany({
      where: { user_id },
      orderBy: { credited_at: "desc" },
    });
  }

  async findById(cashbackId: string): Promise<Cashback | null> {
    return prisma.cashback.findUnique({
      where: { id: cashbackId },
    });
  }

  async validateCashback(id: string) {
    await prisma.cashback.update({
      where: { id },
      data: { validated: true },
    });
  }

  async createCashback({
    userId,
    orderId,
    amount,
  }: {
    userId: string;
    orderId: string;
    amount: number;
  }): Promise<Cashback> {
    try {
      const decimalAmount = new Decimal(amount);

      const cashback = await prisma.cashback.create({
        data: {
          user_id: userId,
          order_id: orderId,
          amount: decimalAmount,
          validated: true,
          credited_at: new Date(),
        },
      });

      return cashback;
    } catch (error) {
      console.error("[Repository] Erro ao criar cashback:", error);
      throw error;
    }
  }

  async createTransaction({
    user_id,
    amount,
    type,
  }: {
    user_id: string;
    amount: number | Decimal;
    type: "RECEIVE" | "USE";
  }) {
    const value = new Decimal(amount);

    const adjustedAmount = type === "USE" ? value.negated().abs() : value.abs(); // Sempre negativo se USE

    return prisma.cashbackTransaction.create({
      data: {
        user_id,
        amount: adjustedAmount,
        type,
      },
    });
  }

  async getBalance(user_id: string): Promise<number> {
    const transactions = await prisma.cashbackTransaction.findMany({
      where: { user_id },
      select: { amount: true },
    });

    return transactions.reduce((acc, tx) => acc + tx.amount.toNumber(), 0);
  }

  async redeemCashback({
    user_id,
    order_id,
    amount,
  }: {
    user_id: string;
    order_id: string;
    amount: number;
  }) {
    const usedAmount = -Math.abs(amount);

    const cashback = await prisma.cashback.create({
      data: {
        user_id,
        order_id,
        amount: usedAmount,
        validated: true,
        credited_at: new Date(),
      },
    });

    return cashback;
  }

  async applyCashback(
    order_id: string,
    user_id: string,
    amount: number
  ): Promise<void> {
    const decimalAmount = new Decimal(amount);

    await prisma.cashback.create({
      data: {
        order_id,
        user_id,
        amount: decimalAmount,
        credited_at: new Date(),
        validated: true,
      },
    });

    await prisma.cashbackTransaction.create({
      data: {
        user_id,
        amount: decimalAmount,
        type: "RECEIVE",
      },
    });
  }
}
