import { Address, Prisma } from '@prisma/client'

<<<<<<< HEAD

=======
>>>>>>> master
export interface AddressesRepository {
  findById(addressId: string): Promise<Address | null>
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>
  update(
    addressId: string,
<<<<<<< HEAD
    data: Partial<Prisma.AddressUncheckedUpdateInput>
  ): Promise<Address>

=======
    data: Prisma.AddressUncheckedUpdateInput,
  ): Promise<Address>
>>>>>>> master
}
