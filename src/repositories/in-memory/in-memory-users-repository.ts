import { address } from '@/http/controllers/address'
import { UsersRepository } from '@/repositories/users-repository'
import { User, Prisma, Address } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  public addresses: Address[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)
    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }
  async create(data: User) {
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      phone: data.phone,
      role: data.role,
      avatar: data.avatar,
      created_at: new Date(),

    }
    this.items.push(user)
    return user
  }

  async createAddress(data: Omit<Address, 'id'>) {
    const address = {
      id: randomUUID(),
      ...data,
    }

    this.addresses.push(address)
    return address
  }

}
