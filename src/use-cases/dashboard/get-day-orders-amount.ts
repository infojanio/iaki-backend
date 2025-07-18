import { DashboardRepository } from "@/repositories/prisma/Iprisma/dashboard-repository";

interface GetDayOrdersAmountUseCaseRequest {
  storeId?: string;
  userId?: string;
}

export class GetDayOrdersAmountUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute({ storeId, userId }: GetDayOrdersAmountUseCaseRequest) {
    const result = await this.dashboardRepository.getDayOrdersAmount({
      storeId,
      userId,
    });

    return result;
  }
}
