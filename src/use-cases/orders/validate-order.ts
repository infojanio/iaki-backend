import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { UsersRepository } from '@/repositories/prisma/Iprisma/users-repository'
import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'

interface ValidateOrderUseCaseRequest {
  order_id: string
  admin_user_id: string // Usuário que está validando o pedido (ADMIN)
}

export class ValidateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
    private cashbacksRepository: CashbacksRepository,
  ) {}

  async execute({ order_id, admin_user_id }: ValidateOrderUseCaseRequest) {
    const adminUser = await this.usersRepository.findById(admin_user_id)

    if (!adminUser || adminUser.role !== 'ADMIN') {
      throw new Error('Apenas usuários ADMIN podem validar pedidos.')
    }

    const order = await this.ordersRepository.findById(order_id)

    if (!order) {
      throw new Error('Pedido não encontrado.')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Apenas pedidos com status PENDING podem ser validados.')
    }

    // Aplicar cashback ao saldo do usuário
    await this.cashbacksRepository.applyCashback(
      order.user_id,
      order.id,
      order.totalAmount.toNumber(),
    )

    // Atualizar status do pedido para VALIDATED
    await this.ordersRepository.updateStatus(order_id, 'VALIDATED')

    return { order_id, status: 'VALIDATED' }
  }
}
