import {
  ProductsRepository,
  ProductWithCategory,
} from "@/repositories/prisma/Iprisma/products-repository";

interface SearchProductsUseCaseRequest {
  query: string;
  page: number;
  pageSize: number;
}

interface SearchProductsUseCaseResponse {
  products: ProductWithCategory[];
  total: number;
}

export class SearchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    query,
    page,
    pageSize = 5,
  }: SearchProductsUseCaseRequest): Promise<SearchProductsUseCaseResponse> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return { products: [], total: 0 };
    }

    const [products, total] = await this.productsRepository.searchByName(
      trimmedQuery,
      page,
      pageSize
    );

    return { products, total };
  }
}
