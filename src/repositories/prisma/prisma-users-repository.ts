import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
<<<<<<< HEAD
  
   /**
=======
  /**
>>>>>>> master
   * Cria um usuário com seus dados pessoais e endereço.
   *
   * @param data - Dados do usuário e do endereço.
   * @returns O usuário criado com os dados do endereço.
   */
<<<<<<< HEAD
   async create(data: Prisma.UserCreateInput) {
=======
  async create(data: Prisma.UserCreateInput) {
>>>>>>> master
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
    })

    return user
  }
<<<<<<< HEAD
  
=======

>>>>>>> master
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }

  //verifica se o email já existe
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
<<<<<<< HEAD
  }}
=======
  }
}
>>>>>>> master
