import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { balance } from './balance'
import { history } from './history'
import { redeemCashback } from './redeem-cashback'
import { validateCashback } from './validate-cashback'

export async function cashbacksRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/cashbacks/balance', balance)
  app.get('/cashbacks/history', history)

  app.post('/cashbacks/redeem', redeemCashback) //resgate

  app.patch(
    '/cashbacks/:orderId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateCashback,
  )
}
