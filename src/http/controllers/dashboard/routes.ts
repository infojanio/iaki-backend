import { FastifyInstance } from "fastify";
import { getDashboardMetrics } from "./get-dashboard-metrics";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard/metrics", getDashboardMetrics);
}
