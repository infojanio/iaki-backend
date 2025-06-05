import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { balance } from './balance'
import { history } from './history'
import { redeemCashback } from './redeem-cashback'

export async function cashbacksRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/cashbacks/balance', balance)
  app.get('/cashbacks/history', history)

  app.post('/cashbacks/redeem', redeemCashback) // resgate de cashback
}
