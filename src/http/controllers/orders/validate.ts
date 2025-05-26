import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateOrderUseCase } from '@/use-cases/_factories/make-validate-order-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateOrderParamsSchema = z.object({
    orderId: z.string().uuid(),
    cashbackAmount: z.number().positive(),
  })

  const { orderId, cashbackAmount } = validateOrderParamsSchema.parse(
    request.params,
  )
  const adminUserId = request.user.sub // ID do usuário autenticado (ADMIN)

  const validateOrderUseCase = makeValidateOrderUseCase()

  try {
    const result = await validateOrderUseCase.execute({
      order_id: orderId,
      admin_user_id: adminUserId,
    })

    return reply
      .status(200)
      .send({ message: 'Pedido validado com sucesso.', result })
  } catch (error) {
    console.error('Erro ao validar pedido:', error)
    return reply.status(400).send({ message: error })
  }
}
