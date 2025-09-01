import { prisma } from "@/lib/prisma";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { Order, OrderItem, OrderStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import QRCode from "qrcode";

type CreatedOrderWithItems = Order & {
  orderItems: {
    id: string;
    product_id: string;
    quantity: Decimal;
    subtotal: Decimal;
    order_id: string;
  }[];
};

export class PrismaOrdersRepository implements OrdersRepository {
  async findById(orderId: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: { product: true },
          },
          user: { select: { id: true } },
        },
      });
      return order ?? null;
    } catch (error) {
      console.error(`[Repository] Erro ao buscar pedido ${orderId}:`, error);
      throw error;
    }
  }

  async updateStatus(order_id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: order_id },
      data: { status },
    });
  }

  async findByUserIdLastHour(userId: string, date: Date) {
    const oneHourAgo = dayjs(date).subtract(1, "hour").toDate();
    return prisma.order.findFirst({
      where: { user_id: userId, created_at: { gte: oneHourAgo } },
    });
  }

  async findManyByUserIdWithItems(
    userId: string,
    page: number,
    status?: OrderStatus
  ) {
    const orders = await prisma.order.findMany({
      where: { user_id: userId, status: status || undefined },
      include: {
        orderItems: { include: { product: true } },
      },
      skip: (page - 1) * 10,
      take: 20,
      orderBy: { created_at: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      discountApplied: new Decimal(order.discountApplied).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined,
      status: order.status,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashback_percentage: item.product.cashback_percentage,
        },
        quantity: new Decimal(item.quantity).toNumber(),
        subtotal: new Decimal(item.subtotal).toNumber(),
      })),
    }));
  }

  async findManyWithItems(page: number, status: OrderStatus, storeId?: string) {
    const orders = await prisma.order.findMany({
      where: {
        status: status || undefined,
        store_id: storeId || undefined,
      },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { name: true } }, // <-- incluído aqui
      },
      skip: (page - 1) * 10,
      take: 50,
      orderBy: { created_at: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      user_name: order.user?.name ?? "Usuário", // <-- adicionado
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      discountApplied: new Decimal(order.discountApplied).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined,
      status: order.status,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashback_percentage: item.product.cashback_percentage,
        },
        quantity: new Decimal(item.quantity).toNumber(),
        subtotal: new Decimal(item.subtotal).toNumber(),
      })),
    }));
  }

  async findManyByOrderIdWithItems(
    orderId: string,
    page: number,
    status?: OrderStatus
  ) {
    const orders = await prisma.order.findMany({
      where: {
        id: { contains: orderId },
        status: status || undefined,
      },
      include: {
        orderItems: { include: { product: true } },
      },
      take: 1,
      orderBy: { created_at: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      store_id: order.store_id,
      totalAmount: new Decimal(order.totalAmount).toNumber(),
      qrCodeUrl: order.qrCodeUrl ?? undefined,
      discountApplied: new Decimal(order.discountApplied).toNumber(),
      status: order.status,
      validated_at: order.validated_at,
      created_at: order.created_at,
      items: order.orderItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image ?? null,
          price: new Decimal(item.product.price).toNumber(),
          cashback_percentage: item.product.cashback_percentage,
        },
        quantity: new Decimal(item.quantity).toNumber(),
        subtotal: new Decimal(item.subtotal).toNumber(),
      })),
    }));
  }

  async existsPendingOrder(user_id: string): Promise<boolean> {
    const count = await prisma.order.count({
      where: {
        user_id,
        status: "PENDING",
      },
    });

    return count > 0;
  }

  async create(
    data: Prisma.OrderUncheckedCreateInput
  ): Promise<CreatedOrderWithItems> {
    const order = await prisma.order.create({
      data: {
        ...data,
        discountApplied: data.discountApplied ?? new Decimal(0),
      },
      include: {
        orderItems: true,
      },
    });

    const qrCodeUrl = await QRCode.toDataURL(order.id);

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { qrCodeUrl },
      include: {
        orderItems: true,
      },
    });

    return {
      ...updatedOrder,
      orderItems: updatedOrder.orderItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
        order_id: item.order_id,
      })),
    };
  }

  async createOrderItems(
    order_id: string,
    items: { product_id: string; quantity: number; subtotal: number }[]
  ) {
    if (items.length === 0) {
      console.warn(
        `[Repository] Nenhum item enviado para criação em ${order_id}`
      );
      return;
    }

    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    });
  }

  async save(order: Order): Promise<Order> {
    return await prisma.order.upsert({
      where: { id: order.id },
      update: {
        user_id: order.user_id,
        store_id: order.store_id,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied,
        validated_at: order.validated_at,
        qrCodeUrl: order.qrCodeUrl,
        status: order.status,
        created_at: order.created_at,
      },
      create: {
        id: order.id,
        user_id: order.user_id,
        store_id: order.store_id,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied,
        validated_at: order.validated_at,
        qrCodeUrl: order.qrCodeUrl,
        status: order.status,
        created_at: order.created_at,
      },
    });
  }

  async markAsValidated(order_id: string): Promise<void> {
    await prisma.order.update({
      where: { id: order_id },
      data: { validated_at: new Date() },
    });
  }

  async validateOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found.");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "VALIDATED",
        validated_at: new Date(),
      },
    });
  }

  async cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found.");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "EXPIRED",
        validated_at: new Date(),
      },
    });
  }

  async getItemsByOrderId(orderId: string) {
    return prisma.orderItem.findMany({
      where: { order_id: orderId },
      include: {
        product: {
          include: { store: true },
        },
      },
    });
  }
}
