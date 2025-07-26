import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetSubcategoryUseCase } from "@/use-cases/_factories/make-get-subcategoryId-use-case";

export async function getSubcategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    subcategoryId: z.string().uuid(),
  });

  const { subcategoryId } = paramsSchema.parse(request.params);

  const getSubcategoryUseCase = makeGetSubcategoryUseCase();

  const subcategory = await getSubcategoryUseCase.execute({ subcategoryId });

  return reply.status(200).send(subcategory);
}
