import { prisma } from "@/lib/prisma";

import dayjs from "dayjs";
import { DashboardRepository } from "./Iprisma/dashboard-repository";

export class PrismaDashboardMetricsRepository implements DashboardRepository {
  async getCashbackByMonth() {
    const sixMonthsAgo = dayjs().subtract(5, "month").startOf("month").toDate();

    // Busca todas transações do tipo 'RECEIVE' nos últimos 6 meses
    const transactions = await prisma.cashbackTransaction.findMany({
      where: {
        type: "RECEIVE",
        created_at: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        created_at: true,
      },
    });

    // Agrupa em memória por mês/ano
    const grouped: Record<string, number> = {};

    transactions.forEach(({ amount, created_at }) => {
      const key = dayjs(created_at).format("MM/YYYY");
      grouped[key] = (grouped[key] || 0) + Number(amount);
    });

    // Gera array com os 6 últimos meses, preenchendo com zero onde não houver transações
    const result = Array.from({ length: 6 }).map((_, i) => {
      const date = dayjs().subtract(5 - i, "month");
      const key = date.format("MM/YYYY");

      return {
        month: date.format("MMM/YYYY"),
        total: grouped[key] ?? 0,
      };
    });

    return result;
  }

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

  async getLatestPendingOrders() {
    const orders = await prisma.order.findMany({
      where: { status: { equals: "PENDING" } },
      orderBy: { created_at: "desc" },
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
      totalAmount: Number(order.totalAmount),
      discountApplied: Number(order.discountApplied ?? 0),
      status: order.status,
      user_name: order.user.name,
      store_name: order.store.name,
      createdAt: order.created_at,
      validatedAt: order.validated_at ?? null,
      cashback: order.CashbackTransaction.reduce(
        (acc, cur) => acc + Number(cur.amount),
        0
      ),
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
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return raw.map((entry) => {
      const user = users.find((u) => u.id === entry.user_id);
      return {
        id: user?.id ?? entry.user_id,
        name: user?.name ?? "Usuário",
        email: user?.email ?? "",
        total: Number(entry._sum.amount),
      };
    });
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
      select: {
        id: true,
        name: true,
      },
    });

    return raw.map((entry) => {
      const product = products.find((p) => p.id === entry.product_id);
      return {
        id: product?.id ?? entry.product_id,
        name: product?.name ?? "Produto",
        totalSold: Number(entry._sum.quantity),
      };
    });
  }

  async getDayOrdersAmount({
    storeId,
    userId,
  }: {
    storeId?: string;
    userId?: string;
  }): Promise<{ amount: number; diffFromYesterday: number }> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const todayConditions: any = { validated_at: { gte: startOfToday } };
    const yesterdayConditions: any = {
      validated_at: { gte: startOfYesterday, lt: startOfToday },
    };

    if (storeId) {
      todayConditions.store_id = storeId;
      yesterdayConditions.store_id = storeId;
    }

    if (userId) {
      todayConditions.user_id = userId;
      yesterdayConditions.user_id = userId;
    }

    const todayOrdersCount = await prisma.order.count({
      where: todayConditions,
    });

    const yesterdayOrdersCount = await prisma.order.count({
      where: yesterdayConditions,
    });

    const diffFromYesterday = yesterdayOrdersCount
      ? ((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100
      : 100;

    return {
      amount: todayOrdersCount,
      diffFromYesterday: Math.round(diffFromYesterday),
    };
  }
  async getWeekOrdersAmount({
    storeId,
    userId,
  }: {
    storeId?: string;
    userId?: string;
  }): Promise<{ amount: number; diffFromLastWeek: number }> {
    const today = dayjs().startOf("day");
    const startOfWeek = today.startOf("week"); // domingo
    const lastWeekStart = startOfWeek.subtract(7, "day");
    const lastWeekEnd = startOfWeek.subtract(1, "day").endOf("day");

    const whereCurrent: any = {
      validated_at: {
        gte: startOfWeek.toDate(),
        lte: today.toDate(),
      },
    };

    const whereLast: any = {
      validated_at: {
        gte: lastWeekStart.toDate(),
        lte: lastWeekEnd.toDate(),
      },
    };

    if (storeId) {
      whereCurrent.store_id = storeId;
      whereLast.store_id = storeId;
    }

    if (userId) {
      whereCurrent.user_id = userId;
      whereLast.user_id = userId;
    }

    const [current, previous] = await Promise.all([
      prisma.order.count({ where: whereCurrent }),
      prisma.order.count({ where: whereLast }),
    ]);

    const diffFromLastWeek =
      previous === 0
        ? 100
        : Math.round(((current - previous) / previous) * 100);

    return {
      amount: current,
      diffFromLastWeek,
    };
  }
}
