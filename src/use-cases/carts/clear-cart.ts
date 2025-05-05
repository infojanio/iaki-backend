import { CartsRepository } from '@/repositories/prisma/Iprisma/carts-repository'

interface ClearCartUseCaseRequest {
  userId: string
}

export class ClearCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({ userId }: ClearCartUseCaseRequest) {
    await this.cartsRepository.clearCartByUserId(userId)
  }
}
