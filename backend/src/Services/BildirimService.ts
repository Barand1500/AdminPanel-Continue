import type { Prisma } from '@prisma/client';
import { FormRepository } from '../Infrastructure/repositories/FormRepository.js';
import { KullaniciRepository } from '../Infrastructure/repositories/KullaniciRepository.js';
import { prisma } from '../Infrastructure/database/prismaClient.js';

const formRepo = new FormRepository();
const kullaniciRepo = new KullaniciRepository();

function sonBildirimOkumaOku(ham: unknown): Date | null {
  if (!ham || typeof ham !== 'object') return null;
  const kayit = ham as Record<string, unknown>;
  const v = kayit.sonBildirimOkuma;
  if (typeof v !== 'string') return null;
  const tarih = new Date(v);
  return Number.isNaN(tarih.getTime()) ? null : tarih;
}

export class BildirimService {
  async listele(siteId: number, kullaniciId: number) {
    const kullanici = await kullaniciRepo.findById(kullaniciId);
    const sonOkuma = sonBildirimOkumaOku(kullanici?.tercihlerJson);
    const logZamanFiltresi = sonOkuma
      ? { gt: sonOkuma }
      : { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };

    const [gonderimler, sonLoglar] = await Promise.all([
      formRepo.sonGonderimler(siteId, 30),
      prisma.adminLog.findMany({
        where: {
          siteId,
          olusturma: logZamanFiltresi,
        },
        orderBy: { olusturma: 'desc' },
        take: 10,
        select: {
          id: true,
          islem: true,
          modulId: true,
          kullaniciAd: true,
          olusturma: true,
        },
      }),
    ]);

    const formBildirimleri = gonderimler
      .filter((g) => !g.okundu)
      .map((g) => ({
        id: `form_${g.id}`,
        tip: 'form_gonderim' as const,
        baslik: 'Yeni form gönderimi',
        mesaj: `${g.form.ad} formundan yeni mesaj`,
        okundu: false,
        olusturma: g.olusturma.toISOString(),
        formId: String(g.form.id),
        gonderimId: String(g.id),
        link: '/gt-admin/formlar',
      }));

    const logBildirimleri = sonLoglar.map((l) => ({
      id: `log_${l.id}`,
      tip: 'sistem' as const,
      baslik: 'İçerik güncellendi',
      mesaj: `${l.kullaniciAd}: ${l.islem}`,
      okundu: false,
      olusturma: l.olusturma.toISOString(),
      link: '/gt-admin/loglar',
    }));

    const bildirimler = [...formBildirimleri, ...logBildirimleri].sort(
      (a, b) => new Date(b.olusturma).getTime() - new Date(a.olusturma).getTime()
    );

    return { bildirimler, okunmamisSayi: bildirimler.length };
  }

  async tumunuOkundu(siteId: number, kullaniciId: number) {
    await formRepo.tumGonderimleriOkundu(siteId);

    const kullanici = await kullaniciRepo.findById(kullaniciId);
    const onceki =
      kullanici?.tercihlerJson && typeof kullanici.tercihlerJson === 'object'
        ? (kullanici.tercihlerJson as Record<string, unknown>)
        : {};

    await kullaniciRepo.guncelle(kullaniciId, {
      tercihlerJson: {
        ...onceki,
        sonBildirimOkuma: new Date().toISOString(),
      } as Prisma.InputJsonValue,
    });
  }
}
