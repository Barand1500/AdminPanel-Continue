import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class SayfaRepository {
  async findBySiteId(siteId: number) {
    return prisma.sayfa.findMany({
      where: { siteId, yayinda: true },
      orderBy: { sira: 'asc' },
    });
  }

  async findAdminBySiteId(siteId: number) {
    return prisma.sayfa.findMany({
      where: { siteId },
      orderBy: { sira: 'asc' },
    });
  }

  async findBySlugKayit(siteId: number, slug: string) {
    const temiz = slug.replace(/^\/+|\/+$/g, '');
    return prisma.sayfa.findFirst({ where: { siteId, slug: temiz } });
  }

  async findBySlug(siteId: number, slug: string) {
    const temiz = slug.replace(/^\/+|\/+$/g, '');
    return prisma.sayfa.findFirst({
      where: { siteId, slug: temiz, yayinda: true },
      include: {
        widgetlar: {
          where: { aktif: true },
          orderBy: { sira: 'asc' },
        },
      },
    });
  }

  async countChildren(siteId: number, ustSayfaId: number) {
    return prisma.sayfa.count({ where: { siteId, ustSayfaId } });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.sayfa.findFirst({ where: { id, siteId } });
  }

  async altSayfaVarMi(id: number, siteId: number) {
    const sayi = await prisma.sayfa.count({
      where: { ustSayfaId: id, siteId } as Prisma.SayfaWhereInput,
    });
    return sayi > 0;
  }

  async createForSite(siteId: number, data: Omit<Prisma.SayfaUncheckedCreateInput, 'siteId'>) {
    return prisma.sayfa.create({ data: { ...data, siteId } });
  }

  async updateForSite(id: number, data: Prisma.SayfaUpdateInput) {
    return prisma.sayfa.update({ where: { id }, data });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.sayfa.deleteMany({ where: { id, siteId } });
  }
}
