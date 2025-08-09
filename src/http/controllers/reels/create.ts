import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateReelUseCase } from "@/use-cases/_factories/make-create-reel-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createReelBodySchema = z.object({
    title: z.string(),
    image_url: z.string(),
    link: z.string(),
    created_at: z.date().optional(),
  });
  const { title, image_url, link, created_at } = createReelBodySchema.parse(
    request.body
  );
  const createReelUseCase = makeCreateReelUseCase();
  await createReelUseCase.execute({
    title,
    image_url,
    link,
    created_at: new Date(),
  });

  return reply.status(201).send();
}
