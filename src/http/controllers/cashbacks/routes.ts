import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { balance } from "./balance";
import { history } from "./history";
import { redeemCashback } from "./redeem-cashback";
import { getUserCashbackTransactions } from "./get-user-transactions";

export async function cashbacksRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/cashbacks/balance", balance);
  app.get("/cashbacks/history", history);
  app.get("/cashbacks/transactions", getUserCashbackTransactions);

  app.post("/cashbacks/redeem", redeemCashback); // resgate de cashback
}
