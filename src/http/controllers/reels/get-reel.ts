import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetReelUseCase } from "@/use-cases/_factories/make-get-reelId-use-case";

export async function getReel(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    reelId: z.string().uuid(),
  });

  const { reelId } = paramsSchema.parse(request.params);

  const getReelUseCase = makeGetReelUseCase();

  const reel = await getReelUseCase.execute({ reelId });

  return reply.status(200).send(reel);
}
