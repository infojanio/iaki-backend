import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

interface RedeemCashbackUseCaseRequest {
  user_id: string
  product_id: string
  amount: number
}

export class RedeemCashbackUseCase {
  constructor(
    private cashbacksRepository: CashbacksRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({ user_id, product_id, amount }: RedeemCashbackUseCaseRequest) {
    const balance = await this.cashbacksRepository.getBalance(user_id)

    if (balance < amount) {
      throw new Error('Insufficient cashback balance.')
    }

    const product = await this.productsRepository.findProductById(product_id)

    if (!product) {
      throw new Error('Product not found.')
    }

    await this.cashbacksRepository.applyCashback(
      null, // Não é vinculado a um pedido específico
      user_id,
      -amount,
    )
  }
}
