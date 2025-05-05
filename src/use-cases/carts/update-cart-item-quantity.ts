import { CartsRepository } from '@/repositories/prisma/Iprisma/carts-repository'

interface UpdateItemQuantityUseCaseRequest {
  userId: string
  productId: string
  quantity: number
}

export class UpdateItemQuantityUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
    productId,
    quantity,
  }: UpdateItemQuantityUseCaseRequest) {
    const cart = await this.cartsRepository.findByUserId(userId)

    if (!cart) {
      throw new Error('Carrinho não encontrado.')
    }

    return this.cartsRepository.updateItemQuantity(cart.id, productId, quantity)
  }
}
