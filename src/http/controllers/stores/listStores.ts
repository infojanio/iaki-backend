import { FastifyReply, FastifyRequest } from "fastify";
import { makeListStoresUseCase } from "@/use-cases/_factories/make-list-stores-use-case";

export async function listStores(request: FastifyRequest, reply: FastifyReply) {
  const listStoresUseCase = makeListStoresUseCase();

  const stores = await listStoresUseCase.execute();

  return reply.status(200).send(stores);
}
