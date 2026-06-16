import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class MedyaRepository {
  async findBySiteId(siteId: number) {
    return prisma.medya.findMany({
      where: { siteId },
      orderBy: { olusturma: 'desc' },
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.medya.findFirst({ where: { id, siteId } });
  }

  async findManyByIdsAndSiteId(ids: number[], siteId: number) {
    return prisma.medya.findMany({
      where: {
        siteId,
        id: { in: ids },
      },
    });
  }

  async createForSite(siteId: number, data: Omit<Prisma.MedyaUncheckedCreateInput, 'siteId'>) {
    return prisma.medya.create({ data: { ...data, siteId } });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.medya.deleteMany({ where: { id, siteId } });
  }

  async deleteManyForSite(ids: number[], siteId: number) {
    return prisma.medya.deleteMany({
      where: {
        siteId,
        id: { in: ids },
      },
    });
  }
}
