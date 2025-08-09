import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateReelUseCase } from "@/use-cases/_factories/make-update-reel-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

const updateReelParamsSchema = z.object({
  reelId: z.string().uuid(),
});

const updateReelBodySchema = z.object({
  title: z.string().optional(),
  image_url: z.string().optional(),
  link: z.string().optional(),
  reel_id: z.string().uuid().optional(),
});

export async function updateReel(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { reelId } = updateReelParamsSchema.parse(request.params);
    const updateData = updateReelBodySchema.parse(request.body);

    const updateReelUseCase = makeUpdateReelUseCase();

    const updatedReel = await updateReelUseCase.execute({
      reelId,
      ...updateData,
    });

    return reply.status(200).send({
      success: true,
      data: updatedReel,
    });
  } catch (error) {
    console.error("Reel update error:", error);

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Invalid Reel data",
    });
  }
}
