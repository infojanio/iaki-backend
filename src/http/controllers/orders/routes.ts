// http/routes/orders.ts
import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { createOrder } from "./create-order";
import { history } from "./history";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { getCart } from "../carts/get-cart";
import { getOrderByUser } from "./order-by-user";
import { getOrderByOrderId } from "./order-by-orderId";
import { getOrder } from "./get-order";
import { validateOrderAndCreditCashback } from "../cashbacks/validate-order-and-credit-cashback";
import { allOrdersHistory } from "./all-orders-history";
import { cancel } from "./cancel";

export async function ordersRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // Buscar carrinho do usuário autenticado

  app.get("/orders/history", history); // historico de pedidos por usuário
  app.get("/orders/cart", getCart);
  app.get("/order", getOrder);
  app.post("/orders", createOrder);
  app.get("/orders/history/:userId", getOrderByUser);
  app.get("/orders/:orderId", getOrderByOrderId);

  app.patch(
    "/orders/:orderId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validateOrderAndCreditCashback
  );

  app.patch(
    "/orders/:orderId/cancel",
    { onRequest: [verifyUserRole("ADMIN")] },
    cancel
  );

  // historico de todos os pedidos
  app.get(
    "/orders",
    { onRequest: [verifyUserRole("ADMIN")] },
    allOrdersHistory
  );
}
