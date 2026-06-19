import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class SeoYonlendirmeRepository {
  async findBySiteId(siteId: number) {
    return prisma.seoYonlendirme.findMany({
      where: { siteId },
      orderBy: [{ hedefTip: 'asc' }, { hedefId: 'asc' }, { kaynakUrl: 'asc' }],
    });
  }

  async findPublicBySiteId(siteId: number) {
    return prisma.seoYonlendirme.findMany({
      where: { siteId, kod: 301 },
      select: { kaynakUrl: true, hedefTip: true, hedefId: true, kod: true },
    });
  }

  async create(siteId: number, data: Omit<Prisma.SeoYonlendirmeUncheckedCreateInput, 'siteId'>) {
    return prisma.seoYonlendirme.create({ data: { ...data, siteId } });
  }

  async update(id: number, siteId: number, data: Prisma.SeoYonlendirmeUpdateInput) {
    return prisma.seoYonlendirme.updateMany({
      where: { id, siteId },
      data,
    });
  }

  async delete(id: number, siteId: number) {
    return prisma.seoYonlendirme.deleteMany({ where: { id, siteId } });
  }

  async kaynakUrlVarMi(siteId: number, kaynakUrl: string, haricId?: number) {
    const mevcut = await prisma.seoYonlendirme.findFirst({
      where: {
        siteId,
        kaynakUrl,
        ...(haricId != null ? { id: { not: haricId } } : {}),
      },
    });
    return !!mevcut;
  }
}
