import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class SekmeRepository {
  async findBySiteId(siteId: number) {
    return prisma.sekmeAyari.findMany({
      where: { siteId },
      include: {
        kisayol: { select: { id: true, ad: true, kod: true, tusKombinasyonu: true, aktif: true } },
      },
      orderBy: [{ sira: 'asc' }, { olusturma: 'asc' }],
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.sekmeAyari.findFirst({
      where: { id, siteId },
    });
  }

  async findByKod(siteId: number, kod: string) {
    return prisma.sekmeAyari.findUnique({
      where: { siteId_kod: { siteId, kod } },
    });
  }

  async createForSite(siteId: number, data: Omit<Prisma.SekmeAyariUncheckedCreateInput, 'siteId'>) {
    return prisma.sekmeAyari.create({
      data: { ...data, siteId },
    });
  }

  async updateForSite(id: number, data: Prisma.SekmeAyariUpdateInput) {
    return prisma.sekmeAyari.update({
      where: { id },
      data,
    });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.sekmeAyari.deleteMany({
      where: { id, siteId },
    });
  }
}
