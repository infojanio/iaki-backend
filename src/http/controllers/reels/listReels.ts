import { FastifyReply, FastifyRequest } from "fastify";
import { makeListReelsUseCase } from "@/use-cases/_factories/make-list-reels-use-case";

export async function listReels(request: FastifyRequest, reply: FastifyReply) {
  const listReelsUseCase = makeListReelsUseCase();

  const reels = await listReelsUseCase.execute();

  return reply.status(200).send(reels);
}
