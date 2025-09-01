import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";

import { CancelOrderUseCase } from "../orders/cancel-order";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeCancelOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CancelOrderUseCase(ordersRepository, usersRepository); // ✅ Passando ambos os repositórios
  return useCase;
}
