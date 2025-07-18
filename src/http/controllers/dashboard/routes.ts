import { FastifyInstance } from "fastify";
import { getDashboardMetrics } from "./get-dashboard-metrics";
import { getDayOrdersAmount } from "./get-day-orders-amount";
import { getWeekOrdersAmount } from "./get-week-orders-amount";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard/metrics", getDashboardMetrics);
  app.get("/dashboard/day-orders-amount", getDayOrdersAmount);
  app.get("/dashboard/week-orders-amount", getWeekOrdersAmount);
}
