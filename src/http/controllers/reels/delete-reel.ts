import { makeDeleteReelUseCase } from "@/use-cases/_factories/make-delete-reel-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deleteReel(request: FastifyRequest, reply: FastifyReply) {
  const { reelId } = request.params as { reelId: string };

  const deleteReelUseCase = makeDeleteReelUseCase();

  await deleteReelUseCase.execute(reelId);

  return reply.status(204).send();
}
