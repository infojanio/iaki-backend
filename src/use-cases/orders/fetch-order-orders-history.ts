import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderStatus } from "@prisma/client";

interface FetchOrderOrdersHistoryUseCaseRequest {
  orderId: string;
  page: number;
  status?: OrderStatus;
}

interface FetchOrderOrdersHistoryUseCaseResponse {
  orders: Array<{
    id: string;
    store_id: string;
    totalAmount: number;
    discountApplied: number;
    qrCodeUrl?: string;
    status: string;
    validated_at: Date | null;
    created_at: Date;
    items: Array<{
      product: {
        id: string;
        name: string;
        image?: string | null;
        price: number;
        cashback_percentage: number;
      } | null;
      quantity: number;
    }>;
  }>;
}

export class FetchOrderOrdersHistoryUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    page,
    status,
  }: FetchOrderOrdersHistoryUseCaseRequest): Promise<
    FetchOrderOrdersHistoryUseCaseResponse
  > {
    const orders = await this.ordersRepository.findManyByOrderIdWithItems(
      orderId,
      page,
      status
    );

    return {
      orders: orders.map((order) => ({
        id: order.id,
        store_id: order.store_id,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied || 0,
        qrCodeUrl: order.qrCodeUrl ?? undefined,
        status: order.status,
        validated_at: order.validated_at,
        created_at: order.created_at,
        items: order.items.map((item) => ({
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                image: item.product.image ?? null,
                price: item.product.price,
                cashback_percentage: item.product.cashback_percentage,
              }
            : null,
          quantity: item.quantity,
        })),
      })),
    };
  }
}
