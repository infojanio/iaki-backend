import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";
import { ValidateOrderAndCreditCashbackUseCase } from "@/use-cases/cashbacks/validate-order-and-credit-cashback";

export function makeValidateOrderAndCreditCashback() {
  const orderRepository = new PrismaOrdersRepository();
  const cashbackRepository = new PrismaCashbacksRepository();

  const useCase = new ValidateOrderAndCreditCashbackUseCase(
    orderRepository,
    cashbackRepository
  );

  return useCase;
}
