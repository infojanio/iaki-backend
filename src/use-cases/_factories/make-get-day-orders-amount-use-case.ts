import { PrismaDashboardMetricsRepository } from "@/repositories/prisma/prisma-dashboard-repository";
import { GetDayOrdersAmountUseCase } from "@/use-cases/dashboard/get-day-orders-amount";

export function makeGetDayOrdersAmountUseCase() {
  const dashboardRepository = new PrismaDashboardMetricsRepository();
  return new GetDayOrdersAmountUseCase(dashboardRepository);
}
