import { makeDeleteBannerUseCase } from "@/use-cases/_factories/make-delete-banner-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deleteBanner(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { bannerId } = request.params as { bannerId: string };

  const deleteBannerUseCase = makeDeleteBannerUseCase();

  await deleteBannerUseCase.execute(bannerId);

  return reply.status(204).send();
}
