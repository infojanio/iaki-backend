import { prisma } from '@/lib/prisma'
import { Address, Prisma } from '@prisma/client'
<<<<<<< HEAD
import {AddressesRepository } from '../addresses-repository'
export class PrismaAddressesRepository implements AddressesRepository {
 
=======
import { AddressesRepository } from '../addresses-repository'
export class PrismaAddressesRepository implements AddressesRepository {
>>>>>>> master
  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    return prisma.address.create({ data })
  }

  async findById(addressId: string): Promise<Address | null> {
    return prisma.address.findUnique({ where: { id: addressId } })
  }

  async update(
    addressId: string,
<<<<<<< HEAD
    data: Partial<Prisma.AddressUncheckedUpdateInput>
=======
    data: Partial<Prisma.AddressUncheckedUpdateInput>,
>>>>>>> master
  ): Promise<Address> {
    return prisma.address.update({
      where: { id: addressId },
      data,
    })
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> master
