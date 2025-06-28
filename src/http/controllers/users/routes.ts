import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { register } from "./register";
import { refresh } from "./refresh";
import { balance } from "./balance";
import { update } from "./update";

export async function usersRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário não autenticado */
  app.post("/users", register);
  app.post("/sessions", authenticate);

  // app.put('/users/update', update)
  app.patch("/users/:userId", { onRequest: [verifyJWT] }, update);

  app.post("/token/refresh", refresh); // pega o token e atualiza
  app.get("/me", { onRequest: [verifyJWT] }, profile);

  // app.put('/users/:id', { onRequest: [verifyJWT] }, update) //atualiza o usuário

  app.get(
    "/users/balance",
    {
      onRequest: [verifyJWT],
    },
    balance
  );

  /* Rotas exclusivas para usuário autenticado */
}
