import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { create } from "./create";
import { listProducts } from "./listProducts";
import { fetchProductsBySubCategory } from "./fetch-products-by-subcategory";
import { fetchProductsByCashback } from "./fetch-products-by-cashback";
import { fetchProductsByQuantity } from "./fetch-products-by-quantity";
import { updateProduct } from "./update-product";
import { getStock, updateStock } from "./get-stock";
import { getProduct } from "./get-product";
import { searchProducts } from "./search-products";
import { listProductsActive } from "./listProductsActive";

export async function productsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // Rotas de consulta
  app.get("/products/quantity", fetchProductsByQuantity);
  app.get("/products/cashback", fetchProductsByCashback);
  app.get("/products/active", listProductsActive);
  app.get("/products/subcategory", fetchProductsBySubCategory);
  app.get("/products", listProducts);

  // Rota para detalhes do produto

  app.get("/products/:productId", getProduct);

  // Rotas de estoque (separadas logicamente)
  app.patch(
    "/products/:productId",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    updateProduct
  );

  app.get("/products/:productId/stock", getStock);
  app.get("/products/search", searchProducts);
  app.patch(
    "/products/:productId/stock",
    { onRequest: [verifyUserRole("ADMIN")] },
    updateStock
  );
  // Rota de criação
  app.post(
    "/products",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    create
  );
}
