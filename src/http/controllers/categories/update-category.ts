import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateCategoryUseCase } from "@/use-cases/_factories/make-update-category-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

const updateCategoryParamsSchema = z.object({
  categoryId: z.string().uuid(),
});

const updateCategoryBodySchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  category_id: z.string().uuid().optional(),
});

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { categoryId } = updateCategoryParamsSchema.parse(request.params);
    const updateData = updateCategoryBodySchema.parse(request.body);

    const updateCategoryUseCase = makeUpdateCategoryUseCase();

    const updatedCategory = await updateCategoryUseCase.execute({
      categoryId,
      ...updateData,
    });

    return reply.status(200).send({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Category update error:", error);

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Invalid Category data",
    });
  }
}
