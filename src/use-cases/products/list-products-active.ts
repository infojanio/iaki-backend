import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

export class ListProductsActiveUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute() {
    const products = await this.productsRepository.listManyProductActive()
    return products
  }
}
