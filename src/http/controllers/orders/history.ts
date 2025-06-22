import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserOrdersHistoryUseCase } from "@/use-cases/_factories/make-fetch-user-orders-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  // Validação da query para a página
  const orderHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  // Extraindo a página da query string
  const { page } = orderHistoryQuerySchema.parse(request.query);

  // Criando a instância do caso de uso
  const fetchUserOrdersHistoryUseCase = makeFetchUserOrdersHistoryUseCase();

  // Executando o caso de uso para pegar o histórico de pedidos
  const { orders } = await fetchUserOrdersHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  // Formatando os pedidos para garantir a consistência dos tipos e estrutura
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    totalAmount: order.totalAmount,
    discountApplied: order.discountApplied,
    status: order.status,
    qrCodeUrl: order.qrCodeUrl ?? undefined, // Garantindo que `qrCodeUrl` seja string | undefined
    storeId: order.store_id,
    createdAt: order.created_at,
    items: order.items.map((item) => ({
      productId: item.product, // Asegurando que estamos acessando o ID do produto
      name: item.product.name,
      image: item.product.image ?? null, // Garantindo que `image` seja string | null
      price: item.product.price,
      quantity: item.quantity,
      cashback_percentage: item.product.cashback_percentage,
    })),
  }));

  // Retornando a resposta com o histórico formatado
  return reply.status(200).send({
    orders: formattedOrders,
  });
}
