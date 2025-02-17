import { AddressesRepository } from '@/repositories/addresses-repository'
import { Address, Prisma } from '@prisma/client'
<<<<<<< HEAD
interface UpdateAddressUseCaseRequest {  
  addressId: string
  street: string
  city: string 
=======
interface UpdateAddressUseCaseRequest {
  addressId: string
  street: string
  city: string
>>>>>>> master
  state: string
  postalCode: string
  user_id: string | null
  store_id: string | null
  created_at: Date
<<<<<<< HEAD

=======
>>>>>>> master
}
interface UpdateAddressUseCaseResponse {
  address: Address
}
export class UpdateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}
  async execute({
    addressId,
    street,
    city,
    state,
    postalCode,
    user_id,
    store_id,
<<<<<<< HEAD
    created_at
 
=======
    created_at,
>>>>>>> master
  }: UpdateAddressUseCaseRequest): Promise<UpdateAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId)
    if (!address) {
      throw new Error('Endereço não encontrado.')
    }
<<<<<<< HEAD

=======
>>>>>>> master
    const updatedAddress = await this.addressesRepository.update(addressId, {
      street,
      city,
      state,
      postalCode,
      user_id,
      store_id,
<<<<<<< HEAD
      created_at
    })

    return { address: updatedAddress }
  }
}
=======
      created_at,
    })
    return { address: updatedAddress }
  }
}
>>>>>>> master
