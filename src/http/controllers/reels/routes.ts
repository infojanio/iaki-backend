import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "../banners/create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listReels } from "./listReels";
import { getReel } from "./get-reel";
import { updateReel } from "./update-reel";
import { deleteReel } from "./delete-reel";

export async function reelsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/reels", listReels);
  app.get("/reels/:reelId", getReel);
  app.patch(
    "/reels/:reelId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    updateReel
  );
  app.delete(
    "/reels/:reelId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    deleteReel
  );

  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    "/reels",
    { onRequest: [verifyUserRole("ADMIN")] },
    create
  );

  //app.post('/stores/:storeId/orders', { onRequest: [verifyJWT] }, create)
}
