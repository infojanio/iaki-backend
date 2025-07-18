import { PrismaDashboardMetricsRepository } from "@/repositories/prisma/prisma-dashboard-repository";
import { GetWeekOrdersAmountUseCase } from "@/use-cases/dashboard/get-week-orders-amount";

export function makeGetWeekOrdersAmountUseCase() {
  const dashboardRepository = new PrismaDashboardMetricsRepository();
  return new GetWeekOrdersAmountUseCase(dashboardRepository);
}
