import { prisma } from '../database/prismaClient.js';
import { sayisalId } from '../utils/sayisalId.js';

export class SiteRepository {
  async findBySlug(slug: string) {
    return prisma.site.findUnique({
      where: { slug },
      include: { siteAyarlari: true },
    });
  }

  async findById(id: number) {
    return prisma.site.findUnique({
      where: { id },
      include: { siteAyarlari: true },
    });
  }

  async listeleAktif() {
    return prisma.site.findMany({
      where: { aktif: true },
      select: { id: true, ad: true, slug: true },
      orderBy: { ad: 'asc' },
    });
  }

  async updateAd(id: number, ad: string) {
    return prisma.site.update({ where: { id }, data: { ad } });
  }

  async guncelle(id: number, data: { aktif?: boolean; domain?: string | null }) {
    return prisma.site.update({ where: { id }, data });
  }
}
