import { makeGetUserLocation } from "@/use-cases/_factories/make-get-user-location-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getUserLocation(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const userId = request.params.userId;
  try {
    const getUserLocationUseCase = makeGetUserLocation();
    const result = await getUserLocationUseCase.execute({ userId });

    if (!result) {
      return reply.status(404).send({ message: "Adicione sua localização." });
    }

    return reply.status(200).send(result);
  } catch (err) {
    return reply.status(500).send({ message: "Erro ao buscar localização." });
  }
}
