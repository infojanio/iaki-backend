import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { UserLocationRepository } from '@/repositories/prisma/Iprisma/user-locations-repository'
import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'

interface CreateOrderUseCaseRequest {
  user_id: string
  store_id: string
  latitude?: number
  longitude?: number
  items: {
    product_id: string
    quantity: number
    subtotal: number
  }[]
  cashback_discount?: number // Novo parâmetro opcional
}

export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userLocationRepository: UserLocationRepository,
    private productsRepository: ProductsRepository,
    private cashbacksRepository: CashbacksRepository, // Novo repositório
  ) {}

  async execute({
    user_id,
    store_id,
    latitude,
    longitude,
    items,
    cashback_discount = 0, // Valor padrão 0
  }: CreateOrderUseCaseRequest) {
    // Calcula o total bruto
    const totalAmount = items.reduce((total, item) => total + item.subtotal, 0)

    // Validação do cashback
    if (cashback_discount > 0) {
      // 1. Verifica saldo disponível
      const balance = await this.cashbacksRepository.getBalance(user_id)
      if (balance < cashback_discount) {
        throw new Error('Saldo de cashback insuficiente')
      }

      // 2. Verifica se não excede o total do pedido
      if (cashback_discount > totalAmount) {
        throw new Error('O desconto não pode exceder o total do pedido')
      }
    }

    // Cria o pedido com desconto aplicado
    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: totalAmount - cashback_discount, // Total já com desconto
      discountApplied: cashback_discount, // Registra o valor do desconto
      status: 'PENDING',
    })

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
        throw new Error(`Estoque insuficiente para o produto ${product.name}.`)
      }

      await this.productsRepository.updateQuantity(product.id, {
        quantity: newQuantity,
        status: newQuantity > 0,
      })
    }

    // Registra uso do cashback (se aplicável)
    if (cashback_discount > 0) {
      await this.cashbacksRepository.redeemCashback({
        user_id,
        order_id: order.id,
        amount: -cashback_discount, // Valor negativo para débito
      })

      await this.cashbacksRepository.createTransaction({
        user_id,
        amount: cashback_discount,
        type: 'USE',
      })
    }

    return {
      id: order.id,
      qrCodeUrl: order.qrCodeUrl,
      totalAmount: order.totalAmount,
      discountApplied: cashback_discount, // Novo campo na resposta
      status: order.status,
    }
  }
}
