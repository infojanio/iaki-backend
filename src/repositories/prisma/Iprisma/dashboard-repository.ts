export interface DashboardRepository {
  getTotalOrders(): Promise<number>;
  getTotalUsers(): Promise<number>;
  getTotalStores(): Promise<number>;
  getActiveProducts(): Promise<number>;
  getTotalCashbackGenerated(): Promise<number>;
  getTotalCashbackUsed(): Promise<number>;
  getCashbackByMonth(): Promise<{ month: string; total: number }[]>;
  getLatestValidatedOrders(): Promise<
    {
      id: string;
      total: number;
      cashback: number;
      userName: string;
      storeName: string;
      validatedAt: Date;
    }[]
  >;
  getTopUsers(): Promise<
    { id: string; name: string; email: string; total: number }[]
  >;
  getTopProducts(): Promise<{ id: string; name: string; totalSold: number }[]>;
  getDayOrdersAmount(params: {
    storeId?: string;
    userId?: string;
  }): Promise<{ amount: number; diffFromYesterday: number }>;

  getWeekOrdersAmount(params: {
    storeId?: string;
    userId?: string;
  }): Promise<{ amount: number; diffFromLastWeek: number }>;
}
