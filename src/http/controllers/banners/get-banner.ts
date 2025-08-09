import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetBannerUseCase } from "@/use-cases/_factories/make-get-bannerId-use-case";

export async function getBanner(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    bannerId: z.string().uuid(),
  });

  const { bannerId } = paramsSchema.parse(request.params);

  const getBannerUseCase = makeGetBannerUseCase();

  const banner = await getBannerUseCase.execute({ bannerId });

  return reply.status(200).send(banner);
}
