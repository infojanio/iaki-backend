// src/http/controllers/orders/admin/history.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchAllOrdersHistoryUseCase } from "@/use-cases/_factories/make-fetch-all-orders-history-use-case";

export async function allOrdersHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const orderHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.enum(["PENDING", "VALIDATED", "EXPIRED"]).optional(),
    storeId: z.string().optional(),
  });

  const { page, status, storeId } = orderHistoryQuerySchema.parse(
    request.query
  );

  const fetchAllOrdersHistoryUseCase = makeFetchAllOrdersHistoryUseCase();

  const { orders } = await fetchAllOrdersHistoryUseCase.execute({
    page,
    status,
    storeId,
  });

  return reply.status(200).send({
    orders: orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      user_name: order.user_name,
      storeId: order.store_id,
      totalAmount: order.totalAmount,
      discountApplied: order.discountApplied,
      status: order.status,
      qrCodeUrl: order.qrCodeUrl,
      validatedAt: order.validated_at,
      createdAt: order.created_at,
      items: order.items.map((item) => ({
        product: item.product
          ? {
              id: item.product.id,
              name: item.product.name,
              image: item.product.image,
              price: item.product.price,
              cashback_percentage: item.product.cashback_percentage,
            }
          : null,
        quantity: item.quantity,
      })),
    })),
  });
}
