import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/factories/make-order-use-case'

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('📩 Dados recebidos:', request.body) // Debug para verificar os dados enviados

  const createOrderBodySchema = z.object({
    user_id: z.string().uuid({ message: 'ID do usuário inválido' }),
    store_id: z.string().uuid({ message: 'ID da loja inválido' }),

    latitude: z.preprocess((val) => Number(val), z.number().min(-90).max(90)),
    longitude: z.preprocess(
      (val) => Number(val),
      z.number().min(-180).max(180),
    ),

    items: z
      .array(
        z.object({
          product_id: z.string().min(1, { message: 'ID do produto inválido' }),
          quantity: z
            .number()
            .int()
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

    console.log('✅ Salvando pedido no banco:', validatedData)

    const { order } = await orderUseCase.execute({
      userLatitude: validatedData.latitude,
      userLongitude: validatedData.longitude,
      user_id: validatedData.user_id,
      store_id: validatedData.store_id,
      items: validatedData.items,
    })

    return reply.status(201).send(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação:', error.flatten().fieldErrors)
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    console.error('❌ Erro interno:', error)
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
