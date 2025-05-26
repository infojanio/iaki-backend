import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import { ZodError } from 'zod'
import { env } from '@/env'

import { usersRoutes } from '@/http/controllers/users/routes'
import { storesRoutes } from '@/http/controllers/stores/routes'
import { ordersRoutes } from '@/http/controllers/orders/routes'
import { cartsRoutes } from '@/http/controllers/carts/routes'
import { productsRoutes } from '@/http/controllers/products/routes'
import { subcategoriesRoutes } from '@/http/controllers/subcategories/routes'
import { categoriesRoutes } from './http/controllers/categories/routes'
import { cashbacksRoutes } from './http/controllers/cashbacks/routes'

export const app = fastify({
  //logger: true,
})
// Habilita JSON no body
app.register(fastifyFormBody)
app.register(fastifyJwt, { secret: process.env.JWT_SECRET! })
app.register(fastifyCors, {
  origin: [
    'https://iaki.com.br', // ✅ frontend hospedado
    //'http://localhost:5173', // opcional para dev local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

app.register(usersRoutes)
app.register(cartsRoutes)
app.register(storesRoutes)
app.register(categoriesRoutes)
app.register(cashbacksRoutes)
app.register(subcategoriesRoutes)
app.register(productsRoutes)
app.register(ordersRoutes)

app.addHook('preHandler', async (request, reply) => {
  //console.log('REQUEST BODY:', request.body)
})

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // AQUI deveremos fazer um log para uma ferramenta externa, como DataDog, NewRelic, Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
