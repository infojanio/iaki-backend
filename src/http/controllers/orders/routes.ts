// http/routes/orders.ts
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createOrder } from './create-order'
import { validate } from './validate'
import { history } from './history'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { getCart } from '../carts/get-cart'
import { getOrderByUser } from './order-by-user'
import { getOrderByOrderId } from './order-by-orderId'

export async function ordersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/orders/history', history)
  app.get('/orders/cart', getCart)
  app.post('/orders', createOrder)
  app.get('/orders/history/:userId', getOrderByUser)
  app.get('/orders/:orderId', getOrderByOrderId)

  app.patch(
    '/orders/:orderId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
