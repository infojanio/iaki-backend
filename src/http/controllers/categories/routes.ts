import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "../categories/create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listCategories } from "./listCategories";
import { getCategory } from "./get-category";
import { updateCategory } from "./update-category";

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/categories", listCategories);
  app.get("/categories/:categoryId", getCategory);
  app.patch(
    "/categories/:categoryId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    updateCategory
  );

  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    "/categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    create
  );

  //app.post('/stores/:storeId/orders', { onRequest: [verifyJWT] }, create)
}
