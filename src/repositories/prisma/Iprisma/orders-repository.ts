import { Order, OrderItem, OrderStatus, Prisma, Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type OrderWithItemsAndProducts = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
};

export interface OrdersRepository {
  create(
    data: Prisma.OrderUncheckedCreateInput
  ): Promise<{
    id: string;
    user_id: string;
    store_id: string;
    totalAmount: Decimal;
    discountApplied: Decimal;
    validated_at: Date | null;
    qrCodeUrl: string | null;
    status: OrderStatus;
    created_at: Date;
    orderItems: Array<{
      id: string;
      product_id: string;
      quantity: Decimal; // Alterado para Decimal
      subtotal: Decimal; // Alterado para Decimal
      order_id?: string; // Adicionado para compatibilidade
    }>;
  }>;

  createOrderItems(
    orderId: string,
    items: { product_id: string; quantity: number; subtotal: number }[]
  ): Promise<void>;

  findById(orderId: string): Promise<OrderWithItemsAndProducts | null>;
  existsPendingOrder(user_id: string): Promise<boolean>;
  validateOrder(orderId: string): Promise<void>;
  cancelOrder(orderId: string): Promise<void>;
  markAsValidated(order_id: string): Promise<void>;
  findByUserIdLastHour(
    userId: string,
    date: Date
  ): Promise<Order | boolean | null>;

  findManyWithItems(
    page: number,
    status?: OrderStatus,
    storeId?: string
  ): Promise<
    Array<{
      id: string;
      store_id: string;
      user_id: string;
      user_name: string;
      totalAmount: number;
      qrCodeUrl?: string | null; // Permitir null
      status: string;
      discountApplied: number | null;
      validated_at: Date | null;
      created_at: Date;
      items: Array<{
        product: {
          id: string;
          name: string;
          image: string | null;
          price: number;
          cashback_percentage: number;
        };
        quantity: number;
      }>;
    }>
  >;

  findManyByOrderIdWithItems(
    orderId: string,
    page: number,
    status?: string
  ): Promise<
    Array<{
      id: string;
      store_id: string;
      totalAmount: number;
      qrCodeUrl?: string | null; // Permitir null
      status: string;
      discountApplied: number | null;
      validated_at: Date | null;
      created_at: Date;
      items: Array<{
        product: {
          id: string;
          name: string;
          image: string | null;
          price: number;
          cashback_percentage: number;
        };
        quantity: number;
      }>;
    }>
  >;

  findManyByUserIdWithItems(
    userId: string,
    page: number,
    status?: string
  ): Promise<
    Array<{
      id: string;
      store_id: string;
      totalAmount: number;
      qrCodeUrl?: string | null; // Permitir null
      status: string;
      discountApplied: number | null;
      validated_at: Date | null;
      created_at: Date;
      items: Array<{
        product: {
          id: string;
          name: string;
          image: string | null;
          price: number;
          cashback_percentage: number;
        };
        quantity: number;
      }>;
    }>
  >;

  save(order: Order): Promise<Order>;

  updateStatus(orderId: string, status: OrderStatus): Promise<Order | null>;

  getItemsByOrderId(orderId: string): Promise<OrderItem[]>;
}
