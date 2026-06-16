import { prisma } from '../database/prismaClient.js';
import type { Prisma } from '@prisma/client';

export class KullaniciRepository {
  async findByEmail(email: string) {
    return prisma.kullanici.findUnique({
      where: { email },
      include: { site: true },
    });
  }

  async findById(id: number) {
    return prisma.kullanici.findUnique({
      where: { id },
      include: { site: true },
    });
  }

  async listele(siteId?: number | null) {
    return prisma.kullanici.findMany({
      where: siteId ? { siteId } : undefined,
      include: { site: { select: { id: true, ad: true, slug: true } } },
      orderBy: { olusturma: 'desc' },
    });
  }

  async olustur(data: {
    email: string;
    ad: string;
    sifreHash: string;
    rol: string;
    siteId?: number | null;
    aktif?: boolean;
  }) {
    return prisma.kullanici.create({
      data: {
        email: data.email,
        ad: data.ad,
        sifreHash: data.sifreHash,
        rol: data.rol,
        siteId: data.siteId ?? null,
        aktif: data.aktif ?? true,
      },
      include: { site: { select: { id: true, ad: true, slug: true } } },
    });
  }

  async guncelle(
    id: number,
    data: Partial<{
      email: string;
      ad: string;
      sifreHash: string;
      rol: string;
      siteId: number | null;
      aktif: boolean;
      tercihlerJson: Prisma.InputJsonValue;
    }>
  ) {
    return prisma.kullanici.update({
      where: { id },
      data,
      include: { site: { select: { id: true, ad: true, slug: true } } },
    });
  }

  async sil(id: number) {
    return prisma.kullanici.delete({ where: { id } });
  }

  async sayRol(rol: string) {
    return prisma.kullanici.count({ where: { rol } });
  }
}
