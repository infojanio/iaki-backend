import { Cart, CartItem } from '@prisma/client'

export interface CartsRepository {
  findByUserId(userId: string): Promise<Cart | null>
  create(userId: string): Promise<Cart>
  addItem(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem>

  updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem>

  removeItemByUserAndProduct(userId: string, productId: string): Promise<void>
  clearCartByUserId(userId: string): Promise<void>
  getItemsByUserId(userId: string): Promise<CartItem[]>
}
