import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';
import { sayisalId } from '../utils/sayisalId.js';

export class KisayolRepository {
  async findBySiteId(siteId: number) {
    return prisma.kisayolAyari.findMany({
      where: { siteId },
      orderBy: [{ sira: 'asc' }, { olusturma: 'asc' }],
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.kisayolAyari.findFirst({
      where: { id, siteId },
    });
  }

  async findByKod(siteId: number, kod: string) {
    return prisma.kisayolAyari.findUnique({
      where: { siteId_kod: { siteId, kod } },
    });
  }

  async createForSite(siteId: number, data: Omit<Prisma.KisayolAyariUncheckedCreateInput, 'siteId'>) {
    return prisma.kisayolAyari.create({
      data: { ...data, siteId },
    });
  }

  async updateForSite(id: number, data: Prisma.KisayolAyariUpdateInput) {
    return prisma.kisayolAyari.update({
      where: { id },
      data,
    });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.kisayolAyari.deleteMany({
      where: { id, siteId },
    });
  }
}
