import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateBannerUseCase } from "@/use-cases/_factories/make-update-banner-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

const updateBannerParamsSchema = z.object({
  bannerId: z.string().uuid(),
});

const updateBannerBodySchema = z.object({
  title: z.string().optional(),
  image_url: z.string().optional(),
  link: z.string().optional(),
  banner_id: z.string().uuid().optional(),
});

export async function updateBanner(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { bannerId } = updateBannerParamsSchema.parse(request.params);
    const updateData = updateBannerBodySchema.parse(request.body);

    const updateBannerUseCase = makeUpdateBannerUseCase();

    const updatedBanner = await updateBannerUseCase.execute({
      bannerId,
      ...updateData,
    });

    return reply.status(200).send({
      success: true,
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Banner update error:", error);

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Invalid Banner data",
    });
  }
}
