import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createOrder } from './create-order'
import { validate } from './validate'
import { history } from './history'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { getCart } from '../carts/get-cart'

export async function ordersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // Histórico de pedidos do usuário autenticado
  app.get('/orders/history', history)

  // Criação de pedido a partir do carrinho
  app.get('/orders/cart', getCart)

  // Criação de novo pedido
  app.post('/orders', createOrder)

  // Validação do pedido (apenas ADMIN)
  app.patch(
    '/orders/:orderId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
