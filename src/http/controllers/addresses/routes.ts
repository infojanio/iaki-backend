import { FastifyInstance } from "fastify";
import { getUserAddress } from "./get-address";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users/:userId/address", getUserAddress);
}
