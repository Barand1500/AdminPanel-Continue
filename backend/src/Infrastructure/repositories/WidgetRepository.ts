import type { Prisma, Widget, WidgetTipi } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class WidgetRepository {
  async findBySiteId(siteId: number) {
    return prisma.widget.findMany({
      where: { siteId, aktif: true },
      orderBy: { sira: 'asc' },
    });
  }

  async findBySiteAndTip(siteId: number, tip: WidgetTipi) {
    return prisma.widget.findMany({
      where: { siteId, tip, aktif: true },
      orderBy: { sira: 'asc' },
    });
  }

  async findAdminBySiteId(siteId: number, tip?: WidgetTipi) {
    return prisma.widget.findMany({
      where: { siteId, ...(tip ? { tip } : {}) },
      orderBy: [{ sira: 'asc' }, { olusturma: 'desc' }],
    });
  }

  async findByIdAndSiteId(id: number, siteId: number) {
    return prisma.widget.findFirst({
      where: { id, siteId },
    });
  }

  async createForSite(siteId: number, data: Prisma.WidgetCreateWithoutSiteInput): Promise<Widget> {
    return prisma.widget.create({
      data: {
        site: { connect: { id: siteId } },
        ...data,
      },
    });
  }

  async updateForSite(id: number, data: Prisma.WidgetUpdateInput): Promise<Widget> {
    return prisma.widget.update({
      where: { id },
      data,
    });
  }

  async deleteForSite(id: number, siteId: number) {
    return prisma.widget.deleteMany({ where: { id, siteId } });
  }
}
