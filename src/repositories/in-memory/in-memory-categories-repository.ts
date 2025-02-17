<<<<<<< HEAD
import {
  CategoriesRepository,
} from '@/repositories/categories-repository'

import { Prisma, Category } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaCategoriesRepository } from '../prisma/prisma-categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {

=======
import { CategoriesRepository } from '@/repositories/categories-repository'
import { Prisma, Category } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaCategoriesRepository } from '../prisma/prisma-categories-repository'
export class InMemoryCategoriesRepository implements CategoriesRepository {
>>>>>>> master
  public items: Category[] = []
  async findById(id: string) {
    const category = this.items.find((item) => item.id === id)
    if (!category) {
      return null
    }
    return category
  }
<<<<<<< HEAD

=======
>>>>>>> master
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
<<<<<<< HEAD

=======
>>>>>>> master
  async create(data: Prisma.CategoryCreateInput) {
    const category = {
      id: data.id ?? randomUUID(),
      name: data.name,
      image: data.image || null,
      subcategory: data.SubCategory,
      created_at: new Date(),
    }
    this.items.push(category)
<<<<<<< HEAD

=======
>>>>>>> master
    return category
  }
}
