import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product, Prisma } from '@prisma/client'
interface FetchProductCashbackUseCaseRequest {
  cashback_percentage: number
}
interface FetchProductCashbackUseCaseResponse {
  products: Product[]
}
export class FetchProductsByCashbackUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    cashback_percentage,
  }: FetchProductCashbackUseCaseRequest): Promise<
    FetchProductCashbackUseCaseResponse
  > {
    const products = await this.productsRepository.findByCashback(
      cashback_percentage,
    )
    return {
      products,
    }
  }
}
