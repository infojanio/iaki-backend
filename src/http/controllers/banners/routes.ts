import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "../banners/create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listBanners } from "./listBanners";
import { getBanner } from "./get-banner";
import { updateBanner } from "./update-banner";
import { deleteBanner } from "./delete-banner";

export async function bannersRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/banners", listBanners);
  app.get("/banners/:bannerId", getBanner);
  app.patch(
    "/banners/:bannerId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    updateBanner
  );
  app.delete(
    "/banners/:bannerId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    deleteBanner
  );

  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    "/banners",
    { onRequest: [verifyUserRole("ADMIN")] },
    create
  );

  //app.post('/stores/:storeId/orders', { onRequest: [verifyJWT] }, create)
}
