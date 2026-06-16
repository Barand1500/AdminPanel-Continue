import { prisma } from '../database/prismaClient.js';

export class LogRepository {
  async findBySiteId(siteId: number, limit = 200) {
    return prisma.adminLog.findMany({
      where: { siteId },
      orderBy: { olusturma: 'desc' },
      take: limit,
    });
  }

  async create(data: {
    siteId: number;
    kullaniciId?: number | null;
    kullaniciAd: string;
    kullaniciEmail: string;
    islem: string;
    modulId?: string | null;
    aksiyonId?: string | null;
  }) {
    return prisma.adminLog.create({ data });
  }

  async temizle(siteId: number) {
    return prisma.adminLog.deleteMany({ where: { siteId } });
  }
}
