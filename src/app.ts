import dotenv from 'dotenv';

import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { usersRoutes } from '@/http/controllers/users/routes'
import { storesRoutes } from '@/http/controllers/stores/routes'
import { ordersRoutes } from './http/controllers/orders/routes'
import { ZodError } from 'zod'
import { env } from './env';


dotenv.config();

export const app = fastify()

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(storesRoutes)
app.register(ordersRoutes)

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