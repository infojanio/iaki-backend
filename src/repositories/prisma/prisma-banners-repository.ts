import { prisma } from "@/lib/prisma";
import { Banner, Prisma } from "@prisma/client";
import { BannersRepository } from "./Iprisma/banners-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
export class PrismaBannersRepository implements BannersRepository {
  async findById(id: string) {
    const banner = await prisma.banner.findUnique({
      where: {
        id,
      },
    });
    return banner;
  }

  async listMany(): Promise<Banner[]> {
    const categories = await prisma.banner.findMany();
    return categories;
  }

  async findByIdBanner(id: string): Promise<Banner | null> {
    const banner = await prisma.banner.findUnique({
      where: {
        id,
      },
    });
    return banner;
  }

  async update(
    id: string,
    data: {
      title?: string;
      image_url?: string;
      link?: string;
    }
  ): Promise<Banner> {
    return prisma.banner.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async searchMany(query?: string, page: number = 1): Promise<Banner[]> {
    // Se o query for vazio ou não fornecido, retorna todas as categorias paginadas
    if (!query) {
      return await prisma.banner.findMany({
        skip: (page - 1) * 20,
        take: 20,
      });
    }

    // Busca as categorias com base no query
    return await prisma.banner.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive", // Busca case-insensitive (maíuscula ou minúscula)
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    });
  }

  async create(data: Prisma.BannerUncheckedCreateInput) {
    const banner = await prisma.banner.create({
      data,
    });
    return banner;
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.banner.delete({ where: { id } });
    } catch (err) {
      // Se quiser mapear para um erro da sua camada de domínio:
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new ResourceNotFoundError();
        // ex: throw err; // ou faça o mapeamento acima
      }
      throw err;
    }
  }
}
