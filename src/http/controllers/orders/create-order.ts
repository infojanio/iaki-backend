// src/controllers/orders/create-order.ts
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/use-cases/_factories/make-create-order-use-case'

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('📩 Dados recebidos:', request.body)

  const createOrderBodySchema = z.object({
    user_id: z.string().uuid({ message: 'ID do usuário inválido' }),
    store_id: z.string().uuid({ message: 'ID da loja inválido' }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    items: z
      .array(
        z.object({
          product_id: z.string().min(1, { message: 'ID do produto inválido' }),
          quantity: z
            .number()
            .positive({ message: 'Quantidade deve ser positiva' }),
          subtotal: z
            .number()
            .positive({ message: 'Subtotal deve ser maior que zero' }),
        }),
      )
      .min(1, { message: 'O pedido deve ter pelo menos um item' }),
  })

  try {
    const validatedData = createOrderBodySchema.parse(request.body)
    const orderUseCase = makeOrderUseCase()

    const order = await orderUseCase.execute({
      user_id: validatedData.user_id,
      store_id: validatedData.store_id,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      items: validatedData.items,
    })
    console.log('pedido', order)
    return reply.status(201).send(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('Pedido não confirmado', error)
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
