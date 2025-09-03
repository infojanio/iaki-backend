import {
  UsersRepository,
  AddressDTO,
  UserProfileDB,
} from "@/repositories/prisma/Iprisma/users-repository";

export type UserProfileResponse = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar: string | null;
  created_at: Date;
  // Aqui já vem no formato que o front espera (objeto, não array)
  address: AddressDTO | null;
};

type Request = { userId: string };
type Response = { user: UserProfileResponse | null };

export class GetUserProfileEdit {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ userId }: Request): Promise<Response> {
    const dbUser = await this.usersRepo.findProfileById(userId);
    if (!dbUser) return { user: null };

    // address[] -> address | null
    const flattenedAddress: AddressDTO | null =
      Array.isArray(dbUser.address) && dbUser.address.length > 0
        ? dbUser.address[0]
        : null;

    const user: UserProfileResponse = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      role: String(dbUser.role),
      avatar: dbUser.avatar,
      created_at: dbUser.created_at,
      address: flattenedAddress,
    };

    return { user };
  }
}
