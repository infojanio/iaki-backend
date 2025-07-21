import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchProductsUseCase } from "@/use-cases/_factories/make-search-products-use-case";
import { makeListProductsActiveUseCase } from "@/use-cases/_factories/make-list-products-active-use-case";

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchQuerySchema = z.object({
    query: z.string().optional().default(""),
    page: z.coerce.number().int().positive().optional().default(1),
  });

  const { query, page } = searchQuerySchema.parse(request.query);

  const searchProductsUseCase = makeSearchProductsUseCase();

  if (query.trim() === "") {
    const fetchActiveProductsUseCase = makeListProductsActiveUseCase();
    const products = await fetchActiveProductsUseCase.execute();
    return reply.send({ products, total: products.length });
  }

  const { products, total } = await searchProductsUseCase.execute({
    query,
    page,
  });

  return reply.send({ products, total });
}
