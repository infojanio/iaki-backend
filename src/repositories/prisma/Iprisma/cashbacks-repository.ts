import { Cashback, CashbackTransaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CashbacksRepository {
  totalCashbackByUserId(user_id: string): Promise<number>;
  totalUsedCashbackByUserId(user_id: string): Promise<number>;
  findByUserId(user_id: string): Promise<Cashback[]>;
  findById(cashbackId: string): Promise<Cashback | null>;
  getBalance(user_id: string): Promise<number>;
  getTransactionsByUserId(userId: string): Promise<CashbackTransaction[]>;

  createCashback(data: {
    userId: string;
    orderId: string;
    amount: number;
  }): Promise<Cashback>;

  redeemCashback(data: {
    user_id: string;
    order_id: string;
    amount: number;
  }): Promise<Cashback>;

  createTransaction(data: {
    user_id: string;
    amount: number | Decimal;
    type: "RECEIVE" | "USE";
  }): Promise<CashbackTransaction>;

  validateCashback(cashbackId: string): Promise<void>;

  applyCashback(
    order_id: string,
    user_id: string,
    valorTotal: number,
    percentualCashback: number
  ): Promise<void>;
}
