// src/factories/make-order-use-case.ts
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { OrderUseCase } from "../orders/create-order";
import { PrismaUserLocationsRepository } from "@/repositories/prisma/prisma-user-locations-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";

export function makeOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository();
  const userLocationsRepository = new PrismaUserLocationsRepository();
  const productsRepository = new PrismaProductsRepository();
  const cashbacksRepository = new PrismaCashbacksRepository();

  const useCase = new OrderUseCase(
    ordersRepository,
    userLocationsRepository,
    productsRepository,
    cashbacksRepository // 👈 agora está sendo injetado
  );

  return useCase;
}
