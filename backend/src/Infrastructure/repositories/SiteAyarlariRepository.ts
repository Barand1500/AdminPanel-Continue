import type { Prisma } from '@prisma/client';
import { prisma } from '../database/prismaClient.js';

export class SiteAyarlariRepository {
  async findBySiteId(siteId: number) {
    return prisma.siteAyarlari.findUnique({ where: { siteId } });
  }

  async upsert(siteId: number, data: Prisma.SiteAyarlariUpdateInput) {
    const mevcut = await this.findBySiteId(siteId);
    if (mevcut) {
      return prisma.siteAyarlari.update({ where: { siteId }, data });
    }

    const createData: Prisma.SiteAyarlariUncheckedCreateInput = {
      siteId,
      anaRenk: '#7c3aed',
      ikincilRenk: '#a78bfa',
      font: 'Inter',
    };

    const alanlar: (keyof Prisma.SiteAyarlariUncheckedCreateInput)[] = [
      'logoUrl', 'faviconUrl', 'anaRenk', 'ikincilRenk', 'slogan', 'font',
      'telefon', 'email', 'adres', 'whatsapp', 'telifYazisi',
      'seoBaslik', 'seoAciklama', 'seoAnahtar', 'ogGorselUrl',
    ];

    for (const alan of alanlar) {
      const deger = data[alan as keyof typeof data];
      if (typeof deger === 'string' || deger === null) {
        (createData as Record<string, unknown>)[alan] = deger;
      }
    }

    const jsonAlanlar = [
      'sosyalMedyaJson', 'sistemAyarlariJson', 'headerAyarlariJson',
      'heroJson', 'footerAyarlariJson', 'blogAyarlariJson', 'rolTanimlariJson',
    ] as const;

    for (const alan of jsonAlanlar) {
      if (data[alan] !== undefined) {
        (createData as Record<string, unknown>)[alan] = data[alan] as Prisma.InputJsonValue;
      }
    }

    return prisma.siteAyarlari.create({ data: createData });
  }
}
