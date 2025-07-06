// src/http/controllers/users/location/create-user-location.ts

import { makeCreateUserLocationUseCase } from "@/use-cases/_factories/make-create-user-location-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createUserLocation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const locationBodySchema = z.object({
      userId: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    });

    const { userId, latitude, longitude } = locationBodySchema.parse(
      request.body
    );

    const useCase = makeCreateUserLocationUseCase();

    await useCase.execute({
      userId,
      latitude,
      longitude,
    });

    return reply
      .status(201)
      .send({ message: "Localização salva com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar localização:", error);

    return reply
      .status(500)
      .send({ message: "Erro interno ao salvar localização." });
  }
}
