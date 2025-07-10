import { prisma } from "@/lib/prisma";

import dayjs from "dayjs";
import { DashboardRepository } from "./Iprisma/dashboard-repository";

export class PrismaDashboardMetricsRepository implements DashboardRepository {
  async getTotalOrders() {
    return prisma.order.count();
  }

  async getTotalUsers() {
    return prisma.user.count();
  }

  async getTotalStores() {
    return prisma.store.count();
  }

  async getActiveProducts() {
    return prisma.product.count({ where: { status: true } });
  }

  async getTotalCashbackGenerated() {
    const result = await prisma.cashbackTransaction.aggregate({
      where: { type: "RECEIVE" },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  async getTotalCashbackUsed() {
    const result = await prisma.cashbackTransaction.aggregate({
      where: { type: "USE" },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  async getCashbackByMonth() {
    const sixMonthsAgo = dayjs().subtract(5, "month").startOf("month").toDate();

    const raw = await prisma.cashbackTransaction.groupBy({
      by: ["created_at"],
      where: {
        type: "RECEIVE",
        created_at: { gte: sixMonthsAgo },
      },
      _sum: { amount: true },
    });

    return Array.from({ length: 6 }).map((_, index) => {
      const date = dayjs().subtract(5 - index, "month");
      const entry = raw.find((item) =>
        dayjs(item.created_at).isSame(date, "month")
      );

      return {
        month: date.format("MMM/YYYY"),
        total: Number(entry?._sum.amount ?? 0),
      };
    });
  }

  async getLatestValidatedOrders() {
    const orders = await prisma.order.findMany({
      where: { validated_at: { not: null } },
      orderBy: { validated_at: "desc" },
      take: 5,
      include: {
        user: true,
        store: true,
        CashbackTransaction: {
          where: { type: "RECEIVE" },
          select: { amount: true },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      total: Number(order.totalAmount),
      cashback: order.CashbackTransaction.reduce(
        (acc, cur) => acc + Number(cur.amount),
        0
      ),
      userName: order.user.name,
      storeName: order.store.name,
      validatedAt: order.validated_at!,
    }));
  }

  async getTopUsers() {
    const raw = await prisma.cashbackTransaction.groupBy({
      by: ["user_id"],
      where: { type: "RECEIVE" },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    });

    const users = await prisma.user.findMany({
      where: { id: { in: raw.map((r) => r.user_id) } },
    });

    return raw.map((entry) => ({
      name: users.find((u) => u.id === entry.user_id)?.name ?? "Usuário",
      total: Number(entry._sum.amount),
    }));
  }

  async getTopProducts() {
    const raw = await prisma.orderItem.groupBy({
      by: ["product_id"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const products = await prisma.product.findMany({
      where: { id: { in: raw.map((r) => r.product_id) } },
    });

    return raw.map((entry) => ({
      name: products.find((p) => p.id === entry.product_id)?.name ?? "Produto",
      totalSold: Number(entry._sum.quantity),
    }));
  }
}
