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
  getTopUsers(): Promise<{ name: string; total: number }[]>;
  getTopProducts(): Promise<{ name: string; totalSold: number }[]>;
}
