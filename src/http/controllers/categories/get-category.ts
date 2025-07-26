import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetCategoryUseCase } from "@/use-cases/_factories/make-get-categoryId-use-case";

export async function getCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    categoryId: z.string().uuid(),
  });

  const { categoryId } = paramsSchema.parse(request.params);

  const getCategoryUseCase = makeGetCategoryUseCase();

  const category = await getCategoryUseCase.execute({ categoryId });

  return reply.status(200).send(category);
}
