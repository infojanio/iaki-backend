import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetProductUseCase } from "@/use-cases/_factories/make-get-productId-use-case";

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    productId: z.string().uuid(),
  });

  const { productId } = paramsSchema.parse(request.params);

  const getProductUseCase = makeGetProductUseCase();

  const product = await getProductUseCase.execute({ productId });

  return reply.status(200).send(product);
}
