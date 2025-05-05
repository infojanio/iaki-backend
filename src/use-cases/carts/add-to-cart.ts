import { CartsRepository } from '@/repositories/prisma/Iprisma/carts-repository'

interface AddToCartUseCaseRequest {
  userId: string
  productId: string
  quantity: number
}

export class AddToCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({ userId, productId, quantity }: AddToCartUseCaseRequest) {
    // Verifica se o carrinho já existe
    let cart = await this.cartsRepository.findByUserId(userId)

    // Se não existir, cria um novo carrinho
    if (!cart) {
      cart = await this.cartsRepository.create(userId)
    }

    // Adiciona o item ao carrinho usando o ID correto
    return this.cartsRepository.addItem(cart.id, productId, quantity)
  }
}
