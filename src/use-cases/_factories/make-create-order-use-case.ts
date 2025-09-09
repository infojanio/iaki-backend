import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { OrderUseCase } from "../orders/create-order";
import { PrismaUserLocationsRepository } from "@/repositories/prisma/prisma-user-locations-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";

export function makeOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository();

  const userLocationsRepository = new PrismaUserLocationsRepository();

  const productsRepository = new PrismaProductsRepository();

  const useCase = new OrderUseCase(
    ordersRepository,
    userLocationsRepository,
    productsRepository
  );

  return useCase;
}
