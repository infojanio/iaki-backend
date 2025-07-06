// src/use-cases/products/search-products.ts
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";

interface SearchProductsUseCaseRequest {
  query: string;
  page: number;
}

export class SearchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ query, page }: SearchProductsUseCaseRequest) {
    const trimmedQuery = query.trim();

    if (trimmedQuery === "") {
      // Evita buscar por string vazia diretamente nesse use-case
      return [];
    }

    const products = await this.productsRepository.searchByName(
      trimmedQuery,
      page
    );
    return products;
  }
}
