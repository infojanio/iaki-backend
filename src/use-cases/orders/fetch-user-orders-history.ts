// src/use-cases/fetch-user-orders-history.ts
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderStatus } from "@prisma/client";

interface FetchUserOrdersHistoryUseCaseRequest {
  userId: string;
  page: number;
  status?: OrderStatus;
}

interface FetchUserOrdersHistoryUseCaseResponse {
  orders: Array<{
    id: string;
    store_id: string;
    totalAmount: number;
    discountApplied: number;
    qrCodeUrl?: string; // Agora é string | undefined
    status: string;
    validated_at: Date | null;
    created_at: Date;
    items: Array<{
      product: {
        //  id: string
        name: string;
        image: string | null;
        price: number;
        cashback_percentage: number;
      };
      quantity: number;
    }>;
  }>;
}

export class FetchUserOrdersHistoryUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    page,
    status,
  }: FetchUserOrdersHistoryUseCaseRequest): Promise<
    FetchUserOrdersHistoryUseCaseResponse
  > {
    const orders = await this.ordersRepository.findManyByUserIdWithItems(
      userId,
      page,
      status
    );

    return {
      orders: orders.map((order) => ({
        ...order,
        qrCodeUrl: order.qrCodeUrl ?? undefined, // Garantindo que qrCodeUrl seja string | undefined
        discountApplied: order.discountApplied ?? 0,
        items: order.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: item.product.image ?? "",
          },
        })),
      })),
    };
  }
}
