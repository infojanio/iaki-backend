import { Prisma, Cart, CartItem } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { CartsRepository } from '@/repositories/prisma/Iprisma/carts-repository'

export class PrismaCartsRepository implements CartsRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    return await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                store: true,
              },
            },
          },
        },
      },
    })
  }

  async create(userId: string): Promise<Cart> {
    return await prisma.cart.create({
      data: { userId },
    })
  }

  // src/repositories/prisma/prisma-carts-repository.ts

  async addItem(cartId: string, productId: string, quantity: number) {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    })

    if (existingItem) {
      // Atualiza a quantidade (substitui)
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      })
    } else {
      // Cria novo item
      return prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      })
    }
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    const item = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    })

    if (!item) {
      throw new Error('Item do carrinho não encontrado.')
    }

    return prisma.cartItem.update({
      where: {
        id: item.id,
      },
      data: {
        quantity,
      },
    })
  }

  async removeItemByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<void> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    })

    if (!cart) return

    const item = cart.items.find((i) => i.productId === productId)
    if (!item) return

    await prisma.cartItem.delete({
      where: { id: item.id },
    })
  }

  async clearCartByUserId(userId: string): Promise<void> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }
  }

  async getItemsByUserId(userId: string): Promise<CartItem[]> {
    return await prisma.cartItem.findMany({
      where: {
        cart: {
          userId,
        },
      },
      include: {
        product: {
          include: {
            store: true,
          },
        },
      },
    })
  }
}
