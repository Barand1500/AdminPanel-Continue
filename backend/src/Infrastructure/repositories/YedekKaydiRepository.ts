import { prisma } from '../database/prismaClient.js';

export class YedekKaydiRepository {
  async kaydet(data: {
    siteId: number;
    kullaniciId?: number | null;
    kullaniciAd: string;
    kullaniciEmail: string;
    dosyaAdi: string;
    tip: string;
  }) {
    return prisma.yedekKaydi.create({ data });
  }

  async listele(siteId: number, limit = 50) {
    return prisma.yedekKaydi.findMany({
      where: { siteId },
      orderBy: { olusturma: 'desc' },
      take: limit,
    });
  }

  async sonKayit(siteId: number) {
    return prisma.yedekKaydi.findFirst({
      where: { siteId },
      orderBy: { olusturma: 'desc' },
    });
  }
}
