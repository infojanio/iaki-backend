// src/controllers/orders-controller.ts
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchOrderOrdersHistoryUseCase } from '@/use-cases/_factories/make-fetch-order-orders-history-use-case'
import { OrderStatus } from '@prisma/client'

export async function getOrderByOrderId(
  request: FastifyRequest<{ Params: { orderId: string } }>,
  reply: FastifyReply,
) {
  // Validação da query para a página e status
  const orderHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.string().optional(),
  })

  // Extraindo parâmetros da query e da rota
  const { page, status } = orderHistoryQuerySchema.parse(request.query)
  const orderId = request.params.orderId // Pegando o ID do usuário autenticado pelo JWT

  // Verificando se o status é um valor válido do enum OrderStatus
  const validStatus =
    status && Object.values(OrderStatus).includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined

  // Criando a instância do caso de uso
  const fetchOrderOrdersHistoryUseCase = makeFetchOrderOrdersHistoryUseCase()

  // Executando o caso de uso para pegar o histórico de pedidos
  const { orders } = await fetchOrderOrdersHistoryUseCase.execute({
    orderId,
    page,
    status: validStatus,
  })

  // Formatando os pedidos para garantir a consistência dos tipos e estrutura
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    totalAmount: order.totalAmount,
    status: order.status,
    qrCodeUrl: order.qrCodeUrl ?? undefined,
    storeId: order.store_id,
    createdAt: order.created_at,
    items: order.items.map((item) => ({
      productId: item.product,
      name: item.product.name,
      image: item.product.image ?? null,
      price: item.product.price,
      quantity: item.quantity,
      cashbackPercentage: item.product.cashbackPercentage,
    })),
  }))

  // Retornando a resposta com o histórico formatado
  return reply.status(200).send({
    orders: formattedOrders,
  })
}
