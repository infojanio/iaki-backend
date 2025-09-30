import { z } from "zod"; //responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from "fastify";
import { UserAlreadyExistsError } from "@/utils/messages/errors/user-already-exists-error";
import { makeCreateStoreUseCase } from "@/use-cases/_factories/make-create-store-use-case";
import { makeAddressUseCase } from "@/use-cases/_factories/make-create-address-use-case";
import { StoreAlreadyExistsError } from "@/utils/messages/errors/store-already-exists-error";

export async function store(request: FastifyRequest, reply: FastifyReply) {
  const createStoreBodySchema = z.object({
    // id: z.string(),
    name: z.string(),
    slug: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    phone: z.string(),
    avatar: z.string(),
    cnpj: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  });

  const {
    // id,
    name,
    slug,
    latitude,
    longitude,
    phone,
    avatar,
    cnpj,
    street,
    city,
    state,
    postalCode,
  } = createStoreBodySchema.parse(request.body);

  try {
    const storeUseCase = makeCreateStoreUseCase();

    const { store } = await storeUseCase.execute({
      // id,
      name,
      slug,
      latitude,
      longitude,
      phone,
      avatar,
      cnpj,
      street,
      city,
      state,
      postalCode,
    });

    // Retorna status 201, mensagem de sucesso e os dados do usuário criado
    return reply.status(201).send({
      message: "Cadastro realizado com sucesso!",
      store,
    });
  } catch (error) {
    if (error instanceof StoreAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    console.log("está aqui: ", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
