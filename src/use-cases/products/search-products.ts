// src/use-cases/products/search-products.ts
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

interface SearchProductsUseCaseRequest {
  query: string
  page: number
}

export class SearchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ query, page }: SearchProductsUseCaseRequest) {
    const products = await this.productsRepository.searchByName(query, page)
    return products
  }
}
