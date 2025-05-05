import { CartsRepository } from '@/repositories/prisma/Iprisma/carts-repository'

interface RemoveItemFromCartUseCaseRequest {
  userId: string
  productId: string
}

export class RemoveItemFromCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
    productId,
  }: RemoveItemFromCartUseCaseRequest): Promise<void> {
    await this.cartsRepository.removeItemByUserAndProduct(userId, productId)
  }
}
