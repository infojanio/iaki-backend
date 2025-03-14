import { FastifyInstance } from 'fastify'
import { register } from '../utils/register'
import { authenticate } from './controllers/users/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', authenticate)
}
