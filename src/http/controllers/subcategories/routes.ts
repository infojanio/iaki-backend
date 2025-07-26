import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "../subcategories/create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { fetchSubCategoriesByCategory } from "./fetch-subcategories-by-category";
import { listSubCategories } from "./listSubCategories";
import { updateSubcategory } from "./update-subcategory";
import { getSubcategory } from "./get-subcategory";

export async function subcategoriesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);
  app.get("/subcategories", listSubCategories);
  app.get("/subcategories/:subcategoryId", getSubcategory);
  app.patch(
    "/subcategories/:subcategoryId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    updateSubcategory
  );
  app.get("/subcategories/category", fetchSubCategoriesByCategory);
  app.post("/subcategories", { onRequest: [verifyUserRole("ADMIN")] }, create);
}
