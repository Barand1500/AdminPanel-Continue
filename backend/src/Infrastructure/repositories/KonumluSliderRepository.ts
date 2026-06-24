import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class KonumluSliderRepository {
  async findAdminBySiteId(siteId: number) {
    return prisma.konumluSlider.findMany({
      where: { siteId },
      orderBy: [{ sira: 'asc' }, { olusturma: 'desc' }],
    });
  }

  async findPublicBySiteId(siteId: number) {
    return prisma.konumluSlider.findMany({
      where: { siteId, aktif: true },
      orderBy: [{ sira: 'asc' }, { olusturma: 'desc' }],
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.konumluSlider.findFirst({ where: { id, siteId } });
  }

  async createForSite(siteId: number, data: Omit<Prisma.KonumluSliderUncheckedCreateInput, 'siteId'>) {
    return prisma.konumluSlider.create({ data: { ...data, siteId } });
  }

  async updateForSite(id: number, data: Prisma.KonumluSliderUpdateInput) {
    return prisma.konumluSlider.update({ where: { id }, data });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.konumluSlider.deleteMany({ where: { id, siteId } });
  }
}
