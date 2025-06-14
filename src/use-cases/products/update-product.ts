import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product } from '@prisma/client'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'

interface UpdateProductUseCaseRequest {
  productId: string
  name?: string
  description?: string
  price?: number
  quantity?: number | { increment: number } | { decrement: number }
  image?: string
  status?: boolean
  cashback_percentage?: number
  store_id?: string
  subcategory_id?: string
}

interface UpdateProductUseCaseResponse {
  updatedProduct: Product
}

export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    ...data
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    // Verifica se o produto existe
    const existingProduct = await this.productsRepository.findById(productId)

    if (!existingProduct) {
      throw new ResourceNotFoundError()
    }

    // Formata os dados de quantidade para o Prisma
    const updateData = {
      ...data,
      ...(typeof data.quantity === 'object'
        ? { quantity: data.quantity } // Mantém increment/decrement
        : data.quantity !== undefined
        ? { quantity: { set: data.quantity } } // Atualização direta
        : {}),
    }

    // Remove quantity se for undefined para não sobrescrever
    if (data.quantity === undefined) {
      delete updateData.quantity
    }

    // Atualiza o produto
    const updatedProduct = await this.productsRepository.update(
      productId,
      updateData,
    )

    return { updatedProduct }
  }
}
