import { makeGetUserProfileUseCase } from "@/use-cases/_factories/make-get-user-profile-use.case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function profileEdit(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({
    userId: (request as any).user?.sub, // Retorna já sem passwordHash e com address achatado
  });

  return reply.status(200).send({
    user: {
      ...user,
      passwordHash: undefined,
    },
  });
}
