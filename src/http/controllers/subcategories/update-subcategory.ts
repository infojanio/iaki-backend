import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateSubcategoryUseCase } from "@/use-cases/_factories/make-update-subcategory-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

const updateSubcategoryParamsSchema = z.object({
  subcategoryId: z.string().uuid(),
});

const updateSubcategoryBodySchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  category_id: z.string().uuid().optional(),
});

export async function updateSubcategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { subcategoryId } = updateSubcategoryParamsSchema.parse(
      request.params
    );
    const updateData = updateSubcategoryBodySchema.parse(request.body);

    const updateSubcategoryUseCase = makeUpdateSubcategoryUseCase();

    const updatedSubcategory = await updateSubcategoryUseCase.execute({
      subcategoryId,
      ...updateData,
    });

    return reply.status(200).send({
      success: true,
      data: updatedSubcategory,
    });
  } catch (error) {
    console.error("Subcategory update error:", error);

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(400).send({
      success: false,
      message:
        error instanceof Error ? error.message : "Invalid Subcategory data",
    });
  }
}
