import { Prisma, Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// src/repositories/prisma/Iprisma/products-repository.ts

export interface ProductWithNames {
  id: string;
  name: string;
  description: string | null;
  price: Prisma.Decimal;
  quantity: Prisma.Decimal;
  image: string | null;
  status: boolean;
  cashback_percentage: number;
  subcategoryName: string | null;
  categoryName: string | null;
}

export interface ProductsRepository {
  findByIdProduct(id: string): Promise<Product | null>;
  findProductById(id: string): Promise<Product | null>;
  findById(
    id: string,
    options?: { select?: Prisma.ProductSelect } // Adicione esta opção
  ): Promise<Product | Partial<Product> | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  getProductStock(productId: string): Promise<number | Decimal>;
  getProductStockDetails(
    productId: string
  ): Promise<{ quantity: number; name: string } | null>;
  updateQuantity(
    id: string,
    data: { quantity: number; status: boolean }
  ): Promise<Product>;
  updateStock(id: string, quantity: number): Promise<Product>;
  findByStoreId(store_id: string): Promise<Product[] | null>;
  findBySubcategoryId(subcategory_id: string): Promise<Product[] | null>;
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;

  listMany(): Promise<Product[]>; // listar todos
  listManyProductActive(): Promise<Product[]>;

  searchByName(
    query: string,
    page: number,
    pageSize?: number
  ): Promise<[Product[], number]>;

  findByQuantity(quantity: number): Promise<Product[]>; // buscar  por quantidade
  findByCashback(cashback_percentage: number): Promise<Product[]>; // buscar  % cashback
  findBySubCategory(subcategory_id: string): Promise<Product[]>; // buscar por subcategoria
  searchMany(search: string, page: number): Promise<Product[]>; // buscar por nome
  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      quantity?:
        | number
        | { increment: number }
        | { decrement: number }
        | { set: number };
      image?: string;
      status?: boolean;
      cashback_percentage?: number;
      store_id?: string;
      subcategory_id?: string;
    }
  ): Promise<Product>;
  delete(where: Prisma.ProductWhereUniqueInput): Promise<Product>;
}
