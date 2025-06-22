import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchOrderOrdersHistoryUseCase } from "@/use-cases/_factories/make-fetch-order-orders-history-use-case";
import { OrderStatus } from "@prisma/client";

export async function getOrderByOrderId(
  request: FastifyRequest<{ Params: { orderId: string } }>,
  reply: FastifyReply
) {
  const orderHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.string().optional(),
  });

  const { page, status } = orderHistoryQuerySchema.parse(request.query);
  const orderId = request.params.orderId;
  console.log("Recebendo o id pedido", orderId);

  const validStatus =
    status && Object.values(OrderStatus).includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;

  const fetchOrderOrdersHistoryUseCase = makeFetchOrderOrdersHistoryUseCase();

  try {
    const { orders } = await fetchOrderOrdersHistoryUseCase.execute({
      orderId,
      page,
      status: validStatus,
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
        name: item.product?.name,
        image: item.product?.image ?? null, // Garantindo que `image` seja string | null
        price: item.product?.price,
        quantity: item.quantity,
        cashback_percentage: item.product?.cashback_percentage,
      })),
    }));

    return reply.status(200).send({ orders: formattedOrders });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return reply.status(500).send({ error: "Erro ao buscar pedidos" });
  }
}
