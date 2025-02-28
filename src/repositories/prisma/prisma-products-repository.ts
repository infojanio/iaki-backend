import { prisma } from '@/lib/prisma'
import { Product, Prisma } from '@prisma/client'
import { ProductsRepository } from '../products-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const product = await prisma.product.create({
      data,
    })
    return product
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })
    return product
  }

  async searchMany(search: string, page: number): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search, //verifica se contem a palavra
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return products
  }

  async update(
    productId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    try {
      return await prisma.product.update({
        where: { id: productId },
        data,
      })
    } catch (error) {
      throw new ResourceNotFoundError()
    }
  }

  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    const product = await prisma.product.findUnique({ where })

    if (!product) {
      throw new Error('Product not found')
    }

    return prisma.product.update({
      where,
      data: { status: true }, // Marca como "deletado"
    })
  }
}
