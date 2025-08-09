import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateBannerUseCase } from "@/use-cases/_factories/make-create-banner-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBannerBodySchema = z.object({
    title: z.string(),
    image_url: z.string(),
    link: z.string(),
    created_at: z.date().optional(),
  });
  const { title, image_url, link, created_at } = createBannerBodySchema.parse(
    request.body
  );
  const createBannerUseCase = makeCreateBannerUseCase();
  await createBannerUseCase.execute({
    title,
    image_url,
    link,
    created_at: new Date(),
  });

  return reply.status(201).send();
}
