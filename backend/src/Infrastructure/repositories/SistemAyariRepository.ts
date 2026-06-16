import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class SistemAyariRepository {
  async findBySiteId(siteId: number) {
    return prisma.sistemAyari.findUnique({
      where: { siteId },
    });
  }

  async upsert(siteId: number, data: Prisma.SistemAyariUncheckedUpdateInput) {
    const mevcut = await this.findBySiteId(siteId);
    if (mevcut) {
      return prisma.sistemAyari.update({
        where: { siteId },
        data,
      });
    }

    return prisma.sistemAyari.create({
      data: { ...(data as Prisma.SistemAyariUncheckedCreateInput), siteId },
    });
  }
}
