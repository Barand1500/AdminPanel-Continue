import { prisma } from '../database/prismaClient.js';
import type { Prisma } from '@prisma/client';

export class EklentiRepository {
  async findBySiteId(siteId: number) {
    return prisma.siteEklenti.findMany({
      where: { siteId },
      orderBy: [{ kurulumTarihi: 'desc' }],
    });
  }

  async findByKod(siteId: number, kod: string) {
    return prisma.siteEklenti.findUnique({
      where: { siteId_kod: { siteId, kod } },
    });
  }

  async findAktifBySiteId(siteId: number) {
    return prisma.siteEklenti.findMany({
      where: { siteId, durum: 'aktif' },
      orderBy: [{ kurulumTarihi: 'asc' }],
    });
  }

  async create(
    siteId: number,
    data: Omit<Prisma.SiteEklentiUncheckedCreateInput, 'siteId'>
  ) {
    return prisma.siteEklenti.create({
      data: { ...data, siteId },
    });
  }

  async update(id: number, data: Prisma.SiteEklentiUpdateInput) {
    return prisma.siteEklenti.update({ where: { id }, data });
  }

  async deleteByKod(siteId: number, kod: string) {
    return prisma.siteEklenti.deleteMany({ where: { siteId, kod } });
  }
}
