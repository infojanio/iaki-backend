import { PrismaDashboardMetricsRepository } from "@/repositories/prisma/prisma-dashboard-repository";
import { GetDashboardMetricsUseCase } from "../dashboard/get-dashboard-metrics";

export function makeGetDashboardMetricsUseCase() {
  const dashboardRepository = new PrismaDashboardMetricsRepository();
  const useCase = new GetDashboardMetricsUseCase(dashboardRepository);

  return useCase;
}
