import { DashboardRepository } from "@/repositories/prisma/Iprisma/dashboard-repository";

export class GetDashboardMetricsUseCase {
  constructor(private dashboardRepo: DashboardRepository) {}

  async execute() {
    const [
      totalOrders,
      totalUsers,
      totalStores,
      activeProducts,
      totalCashbackGenerated,
      totalCashbackUsed,
      cashbackByMonth,
      latestValidatedOrders,
      topUsers,
      topProducts,
    ] = await Promise.all([
      this.dashboardRepo.getTotalOrders(),
      this.dashboardRepo.getTotalUsers(),
      this.dashboardRepo.getTotalStores(),
      this.dashboardRepo.getActiveProducts(),
      this.dashboardRepo.getTotalCashbackGenerated(),
      this.dashboardRepo.getTotalCashbackUsed(),
      this.dashboardRepo.getCashbackByMonth(),
      this.dashboardRepo.getLatestValidatedOrders(),
      this.dashboardRepo.getTopUsers(),
      this.dashboardRepo.getTopProducts(),
    ]);

    return {
      totalOrders,
      totalUsers,
      totalStores,
      activeProducts,
      totalCashbackGenerated,
      totalCashbackUsed,
      cashbackByMonth,
      latestValidatedOrders,
      topUsers,
      topProducts,
    };
  }
}
