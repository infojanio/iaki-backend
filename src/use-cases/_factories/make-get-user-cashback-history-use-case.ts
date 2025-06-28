import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";
import { GetUserCashbackHistory } from "../cashbacks/get-user-cashback-history";

export function makeGetUserCashbackHistoryUseCase() {
  const cashbacksRepository = new PrismaCashbacksRepository();
  const useCase = new GetUserCashbackHistory(cashbacksRepository);
  return useCase;
}
