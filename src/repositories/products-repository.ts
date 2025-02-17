import { Prisma, Product } from '@prisma/client'

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
  searchMany(search: string, page: number): Promise<Product[]> //buscar por nome
<<<<<<< HEAD
  update(productId: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product>;
=======
  update(
    productId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product>
>>>>>>> master
  delete(where: Prisma.ProductWhereUniqueInput): Promise<Product>
}
