import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface CancelOrderUseCaseRequest {
  order_id: string;
  admin_user_id: string; // Usuário que está validando o pedido (ADMIN)
}

export class CancelOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ order_id, admin_user_id }: CancelOrderUseCaseRequest) {
    const adminUser = await this.usersRepository.findById(admin_user_id);

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Apenas usuários ADMIN podem cancelar pedidos.");
    }

    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    if (order.status !== "PENDING") {
      throw new Error(
        "Apenas pedidos com status PENDING podem ser cancelados."
      );
    }

    // Atualizar status do pedido para EXPIRED
    await this.ordersRepository.updateStatus(order_id, "EXPIRED");

    return { order_id, status: "EXPIRED" };
  }
}
