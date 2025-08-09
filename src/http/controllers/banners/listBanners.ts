import { FastifyReply, FastifyRequest } from "fastify";
import { makeListBannersUseCase } from "@/use-cases/_factories/make-list-banners-use-case";

export async function listBanners(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listBannersUseCase = makeListBannersUseCase();

  const banners = await listBannersUseCase.execute();

  return reply.status(200).send(banners);
}
