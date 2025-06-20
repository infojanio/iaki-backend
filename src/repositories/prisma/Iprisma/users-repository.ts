import { Prisma, User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  update(userId: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  balanceByUserId(userId: string): Promise<number | Decimal>;
}
