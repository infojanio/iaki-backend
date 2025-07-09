import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetUserAddressUseCase } from "@/use-cases/_factories/make-get-user-address-use-case";

export async function getUserAddress(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    userId: z.string().uuid(),
  });

  const { userId } = paramsSchema.parse(request.params);

  try {
    const getUserAddressUseCase = makeGetUserAddressUseCase();
    const { address } = await getUserAddressUseCase.execute({ userId });

    return reply.status(200).send({ address });
  } catch (err) {
    return reply.status(404).send({
      message: "Endereço não encontrado",
    });
  }
}
