import { Prisma, Role, User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type AddressDTO = {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
};

export type UserProfileDB = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatar: string | null;
  created_at: Date;
  // No DB vem como array (Address[])
  address: AddressDTO[];
};

export interface UsersRepository {
  findProfileById(userId: string): Promise<UserProfileDB | null>;
  findById(id: string): Promise<User | null>;
  update(userId: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  balanceByUserId(userId: string): Promise<number | Decimal>;
}
