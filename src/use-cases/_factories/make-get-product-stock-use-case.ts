import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { GetProductUseCase } from '../products/get-stock'

export function makeGetProductStockUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new GetProductUseCase(productsRepository)
  return {
    execute: (params: { productId: string }) => useCase.executeForStock(params), // Assume que você adicionou esse método no use case
  }
}
