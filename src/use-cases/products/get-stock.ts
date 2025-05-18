// use-cases/products/get-product.ts
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'

interface GetProductUseCaseRequest {
  productId: string
}

interface StockInfo {
  quantity: number
  name: string // Garantimos que name sempre será string
}

export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async executeForStock({
    productId,
  }: GetProductUseCaseRequest): Promise<StockInfo> {
    const product = await this.productsRepository.findById(productId, {
      select: {
        quantity: true,
        name: true,
      },
    })

    // Validação rigorosa
    if (
      !product ||
      typeof product.name !== 'string' ||
      product.quantity === undefined
    ) {
      throw new ResourceNotFoundError()
    }

    return {
      quantity: Number(product.quantity),
      name: product.name, // Agora garantidamente string
    }
  }
}
