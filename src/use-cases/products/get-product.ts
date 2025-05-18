import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

interface GetProductUseCaseRequest {
  productId: string
}

export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId }: GetProductUseCaseRequest) {
    const product = await this.productsRepository.findByIdProduct(productId)

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    return product
  }
}
