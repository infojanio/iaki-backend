import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { UserLocationRepository } from '@/repositories/prisma/Iprisma/user-locations-repository'
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'
import { Decimal } from '@prisma/client/runtime/library'

interface CreateOrderUseCaseRequest {
  user_id: string
  store_id: string
  latitude?: number
  longitude?: number
  discountApplied?: number | Decimal
  totalAmount?: number | Decimal // Adicionado para validação
  useCashback?: boolean // Novo campo
  items: {
    product_id: string
    quantity: number
    subtotal: number
  }[]
}

interface CreateOrderUseCaseResponse {
  id: string
  qrCodeUrl: string | null
  totalAmount: Decimal | number
  discountApplied: number | Decimal
  status: string
}

export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userLocationRepository: UserLocationRepository,
    private productsRepository: ProductsRepository,
    private cashbacksRepository: CashbacksRepository,
  ) {}

  private validateDiscount(
    discount: number,
    subtotal: number,
    balance: number,
  ): void {
    if (discount < 0) {
      throw new Error('O desconto não pode ser negativo')
    }

    if (discount > subtotal) {
      throw new Error('O desconto não pode exceder o subtotal do pedido')
    }

    if (new Decimal(discount).greaterThan(balance)) {
      throw new Error('Saldo de cashback insuficiente')
    }
  }

  async execute({
    user_id,
    store_id,
    latitude,
    longitude,
    items,
    discountApplied = 0,
    totalAmount: expectedTotal,
    useCashback = false,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    // Validação básica dos itens
    if (!items || items.length === 0) {
      throw new Error('O pedido deve conter pelo menos um item')
    }

    // Calcula o subtotal e valida itens
    const subtotal = items.reduce((total, item) => {
      if (item.subtotal <= 0) {
        throw new Error(`Subtotal inválido para o produto ${item.product_id}`)
      }
      if (item.quantity <= 0) {
        throw new Error(`Quantidade inválida para o produto ${item.product_id}`)
      }
      return total + item.subtotal
    }, 0)

    // Calcula o desconto efetivo (não pode ser maior que o subtotal)
    const effectiveDiscount = Math.min(discountApplied, subtotal)
    const calculatedTotal = subtotal - effectiveDiscount

    // Valida se o total informado bate com o calculado
    if (
      expectedTotal !== undefined &&
      Math.abs(expectedTotal - calculatedTotal) > 0.01
    ) {
      throw new Error('O total informado não corresponde aos itens e desconto')
    }

    // Validação do cashback se estiver usando
    if (useCashback && effectiveDiscount > 0) {
      const balance = await this.cashbacksRepository.getBalance(user_id)
      this.validateDiscount(effectiveDiscount, subtotal, balance)
    }

    // Cria o pedido com os valores calculados
    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: new Decimal(calculatedTotal),
      discountApplied: effectiveDiscount,
      status: 'PENDING',
    })

    try {
      // Cria os itens do pedido
      await this.ordersRepository.createOrderItems(order.id, items)

      // Registra localização se fornecida
      if (latitude !== undefined && longitude !== undefined) {
        await this.userLocationRepository.create({
          user_id,
          latitude,
          longitude,
        })
      }

      // Atualiza estoque e status dos produtos
      for (const item of items) {
        const product = await this.productsRepository.findByIdProduct(
          item.product_id,
        )

        if (!product) {
          throw new Error(`Produto com ID ${item.product_id} não encontrado.`)
        }

        const newQuantity = product.quantity.toNumber() - item.quantity

        if (newQuantity < 0) {
          throw new Error(
            `Estoque insuficiente para o produto ${product.name}.`,
          )
        }

        await this.productsRepository.updateQuantity(product.id, {
          quantity: newQuantity,
          status: newQuantity > 0,
        })
      }

      // Registra uso do cashback (se aplicável)
      if (useCashback && effectiveDiscount > 0) {
        await this.cashbacksRepository.redeemCashback({
          user_id,
          order_id: order.id,
          amount: new Decimal(-effectiveDiscount),
        })

        await this.cashbacksRepository.createTransaction({
          user_id,
          amount: new Decimal(effectiveDiscount),
          type: 'USE',
          description: `Uso em pedido #${order.id}`,
        })
      }

      return {
        id: order.id,
        qrCodeUrl: order.qrCodeUrl,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied,
        status: order.status,
      }
    } catch (error) {
      // Em caso de erro, cancela o pedido criado
      await this.ordersRepository.updateStatus(order.id, 'EXPIRED')
      throw error
    }
  }
}
