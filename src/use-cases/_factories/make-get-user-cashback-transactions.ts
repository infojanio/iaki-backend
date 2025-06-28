import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";
import { GetUserCashbackTransactionsUseCase } from "@/use-cases/cashbacks/get-user-cashback-transactions";

export function makeGetUserCashbackTransactions() {
  const repository = new PrismaCashbacksRepository();
  return new GetUserCashbackTransactionsUseCase(repository);
}
