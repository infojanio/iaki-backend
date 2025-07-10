import { PrismaDashboardMetricsRepository } from "@/repositories/prisma/prisma-dashboard-reposiory";
import { GetDashboardMetricsUseCase } from "../dashboard/get-dashboard-metrics";

export function makeGetDashboardMetricsUseCase() {
  const dashboardRepository = new PrismaDashboardMetricsRepository();
  const useCase = new GetDashboardMetricsUseCase(dashboardRepository);

  return useCase;
}
