import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "./Iprisma/users-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { userInfo } from "os";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaUsersRepository implements UsersRepository {
  /**
   * Cria um usuário com seus dados pessoais e endereço.
   *
   * @param data - Dados do usuário e do endereço.
   * @returns O usuário criado com os dados do endereço.
   */
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        ...data, // Inclui os dados pessoais

        address: {
          create: data.address?.create, // Relaciona o endereço
        },
      },
      include: {
        address: true, // Retorna os endereços associados ao usuário
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        created_at: true,
        passwordHash: true,
        // NÃO selecionar passwordHash
        address: {
          select: {
            street: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
      },
    });

    return user;
  }

  //verifica se o email já existe
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await prisma.cashback.findMany({
      where: { user_id: userId, order: { validated_at: { not: null } } },
      select: { amount: true },
    });

    return validatedCashbacks
      .reduce((acc, cashback) => acc.plus(cashback.amount), new Decimal(0))
      .toNumber();
  }

  async update(
    userId: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch (error) {
      throw new ResourceNotFoundError();
    }
  }
}
