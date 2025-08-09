import { Reel, Prisma } from "@prisma/client";
export interface ReelsRepository {
  findById(id: string): Promise<Reel | null>;
  findByIdReel(id: string): Promise<Reel | null>;
  create(data: Prisma.ReelCreateInput): Promise<Reel>;
  listMany(): Promise<Reel[]>; //listar todas
  searchMany(search: string, page: number): Promise<Reel[]>; //buscar por nome
  update(
    id: string,
    data: {
      title?: string;
      image_url?: string;
      link?: string;
    }
  ): Promise<Reel>;
  delete(id: string): Promise<void>;
}
