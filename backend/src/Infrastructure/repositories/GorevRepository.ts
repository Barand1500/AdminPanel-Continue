import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class GorevRepository {
  async findByOwner(kullaniciId: number, siteId: number) {
    return prisma.adminGorev.findMany({
      where: { kullaniciId, siteId },
      orderBy: [
        { tamamlandi: 'asc' },
        { onemli: 'desc' },
        { bitisTarihi: 'asc' },
        { olusturma: 'desc' },
      ],
    });
  }

  async findByIdAndOwner(id: number, kullaniciId: number, siteId: number) {
    return prisma.adminGorev.findFirst({
      where: { id, kullaniciId, siteId },
    });
  }

  async createForOwner(
    kullaniciId: number,
    siteId: number,
    data: Omit<Prisma.AdminGorevUncheckedCreateInput, 'kullaniciId' | 'siteId'>,
  ) {
    return prisma.adminGorev.create({
      data: { ...data, kullaniciId, siteId },
    });
  }

  async updateForOwner(
    id: number,
    kullaniciId: number,
    siteId: number,
    data: Prisma.AdminGorevUpdateManyMutationInput,
  ) {
    const sonuc = await prisma.adminGorev.updateMany({
      where: { id, kullaniciId, siteId },
      data,
    });
    if (sonuc.count === 0) return null;
    return this.findByIdAndOwner(id, kullaniciId, siteId);
  }

  async deleteForOwner(id: number, kullaniciId: number, siteId: number) {
    const sonuc = await prisma.adminGorev.deleteMany({
      where: { id, kullaniciId, siteId },
    });
    return sonuc.count > 0;
  }
}
