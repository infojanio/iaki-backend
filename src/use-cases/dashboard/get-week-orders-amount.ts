import { DashboardRepository } from "@/repositories/prisma/Iprisma/dashboard-repository";

interface GetWeekOrdersAmountUseCaseRequest {
  storeId?: string;
  userId?: string;
}

export class GetWeekOrdersAmountUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute({ storeId, userId }: GetWeekOrdersAmountUseCaseRequest) {
    const result = await this.dashboardRepository.getWeekOrdersAmount({
      storeId,
      userId,
    });

    return result;
  }
}
