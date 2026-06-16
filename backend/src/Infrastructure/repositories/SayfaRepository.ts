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

  async findBySlug(siteId: number, slug: string) {
    return prisma.sayfa.findFirst({
      where: { siteId, slug, yayinda: true },
      include: {
        widgetlar: {
          where: { aktif: true },
          orderBy: { sira: 'asc' },
        },
      },
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.sayfa.findFirst({ where: { id, siteId } });
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
