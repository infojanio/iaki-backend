import { prisma } from '@/lib/prisma'
import { Category, Prisma } from '@prisma/client'
import { CategoriesRepository } from './Iprisma/categories-repository'
export class PrismaCategoriesRepository implements CategoriesRepository {
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    })
    return category
  }

  async listMany(): Promise<Category[]> {
    const categories = await prisma.category.findMany()
    return categories
  }

  async searchMany(query?: string, page: number = 1): Promise<Category[]> {
    // Se o query for vazio ou não fornecido, retorna todas as categorias paginadas
    if (!query) {
      return await prisma.category.findMany({
        skip: (page - 1) * 20,
        take: 20,
      })
    }

    // Busca as categorias com base no query
    return await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // Busca case-insensitive (maíuscula ou minúscula)
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = await prisma.category.create({
      data,
    })
    return category
  }
}
