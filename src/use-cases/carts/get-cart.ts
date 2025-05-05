import { CartsRepository } from '@/repositories/prisma/Iprisma/carts-repository'
import { CartItem } from '@prisma/client'

interface GetCartUseCaseRequest {
  userId: string
}

interface GetCartUseCaseResponse {
  cartItems: CartItem[]
}

export class GetCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
  }: GetCartUseCaseRequest): Promise<GetCartUseCaseResponse> {
    const cartItems = await this.cartsRepository.getItemsByUserId(userId)
    return { cartItems }
  }
}
