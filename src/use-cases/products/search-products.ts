// src/use-cases/products/search-products.ts
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

interface SearchProductsUseCaseRequest {
  query: string
}

export class SearchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ query }: SearchProductsUseCaseRequest) {
    const products = await this.productsRepository.searchByName(query)
    return products
  }
}
