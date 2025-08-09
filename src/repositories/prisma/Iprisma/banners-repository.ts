import { Banner, Prisma } from "@prisma/client";
export interface BannersRepository {
  findById(id: string): Promise<Banner | null>;
  findByIdBanner(id: string): Promise<Banner | null>;
  create(data: Prisma.BannerCreateInput): Promise<Banner>;
  listMany(): Promise<Banner[]>; //listar todas
  searchMany(search: string, page: number): Promise<Banner[]>; //buscar por nome
  update(
    id: string,
    data: {
      title?: string;
      image_url?: string;
      link?: string;
    }
  ): Promise<Banner>;
  delete(id: string): Promise<void>;
}
