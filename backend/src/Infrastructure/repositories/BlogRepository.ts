import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class BlogRepository {
  async findAdminBySiteId(siteId: number) {
    return prisma.blogYazisi.findMany({
      where: { siteId },
      orderBy: [{ olusturma: 'desc' }],
    });
  }

  async findPublicBySiteId(siteId: number) {
    return prisma.blogYazisi.findMany({
      where: { siteId, yayinda: true },
      orderBy: [{ oneCikan: 'desc' }, { olusturma: 'desc' }],
      select: {
        id: true,
        baslik: true,
        slug: true,
        ozet: true,
        kapakGorsel: true,
        yazar: true,
        kategori: true,
        oneCikan: true,
        olusturma: true,
      },
    });
  }

  async findPublicBySlug(siteId: number, slug: string) {
    return prisma.blogYazisi.findFirst({
      where: { siteId, slug, yayinda: true },
      select: {
        id: true,
        baslik: true,
        slug: true,
        ozet: true,
        icerik: true,
        kapakGorsel: true,
        yazar: true,
        kategori: true,
        oneCikan: true,
        olusturma: true,
        guncelleme: true,
      },
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.blogYazisi.findFirst({ where: { id, siteId } });
  }

  async createForSite(siteId: number, data: Omit<Prisma.BlogYazisiUncheckedCreateInput, 'siteId'>) {
    return prisma.blogYazisi.create({ data: { ...data, siteId } });
  }

  async updateForSite(id: number, data: Prisma.BlogYazisiUpdateInput) {
    return prisma.blogYazisi.update({ where: { id }, data });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.blogYazisi.deleteMany({ where: { id, siteId } });
  }

  async countBySiteId(siteId: number) {
    return prisma.blogYazisi.count({ where: { siteId } });
  }
}
