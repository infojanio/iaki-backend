import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { getCart } from './get-cart'
import { addToCart } from './add-to-cart'
import { clearCart } from './clear-cart'
import { removeItemFromCart } from './remove-item'
import { updateItemQuantity } from './update-item-quantity'

export async function cartsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // Buscar carrinho do usuário autenticado
  app.get('/cart', getCart)

  // Adicionar item ao carrinho
  app.post('/cart/items', addToCart)

  // Remover item específico do carrinho
  app.delete('/cart/items/:productId', removeItemFromCart)

  app.patch('/cart/items/quantity', updateItemQuantity)

  // Limpar todos os itens do carrinho
  app.delete('/cart/clear', clearCart)
}
