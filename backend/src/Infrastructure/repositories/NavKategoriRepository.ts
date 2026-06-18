import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class NavKategoriRepository {
  async findAdminBySiteId(siteId: number) {
    return prisma.navKategori.findMany({
      where: { siteId },
      orderBy: [{ sira: 'asc' }, { baslik: 'asc' }],
    });
  }

  async findPublicBySiteId(siteId: number) {
    return prisma.navKategori.findMany({
      where: { siteId, aktif: true },
      orderBy: [{ sira: 'asc' }, { baslik: 'asc' }],
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.navKategori.findFirst({ where: { id, siteId } });
  }

  async findBySlug(siteId: number, slug: string) {
    return prisma.navKategori.findFirst({ where: { siteId, slug } });
  }

  async countChildren(siteId: number, ustKategoriId: number) {
    return prisma.navKategori.count({ where: { siteId, ustKategoriId } });
  }

  async createForSite(siteId: number, data: Omit<Prisma.NavKategoriUncheckedCreateInput, 'siteId'>) {
    return prisma.navKategori.create({ data: { ...data, siteId } });
  }

  async updateForSite(id: number, data: Prisma.NavKategoriUpdateInput) {
    return prisma.navKategori.update({ where: { id }, data });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.navKategori.deleteMany({ where: { id, siteId } });
  }
}
