import type { Prisma } from '@prisma/client';
import { EKLENTI_KATALOGU, katalogKaydiBul, varsayilanEklentiAyarlar } from '../data/eklentiKatalogu.js';
import { EklentiRepository } from '../Infrastructure/repositories/EklentiRepository.js';

const repo = new EklentiRepository();

function kurulumdanKart(
  kayit: Awaited<ReturnType<EklentiRepository['findBySiteId']>>[number]
) {
  const manifest =
    kayit.manifestJson && typeof kayit.manifestJson === 'object'
      ? (kayit.manifestJson as Record<string, unknown>)
      : {};
  const katalog = katalogKaydiBul(kayit.kod);
  return {
    kod: kayit.kod,
    ad: kayit.ad,
    aciklama:
      (typeof manifest.aciklama === 'string' ? manifest.aciklama : undefined) ??
      katalog?.aciklama ??
      '',
    gelistirici:
      (typeof manifest.gelistirici === 'string' ? manifest.gelistirici : undefined) ??
      katalog?.gelistirici ??
      'Bilinmiyor',
    ikon: katalog?.ikon ?? '🧩',
    kategori: katalog?.kategori ?? 'onerilen',
    surum: kayit.surum,
    puan: katalog?.puan ?? 4.5,
    etkinKurulum: katalog?.etkinKurulum ?? 0,
    sonGuncelleme: katalog?.sonGuncelleme ?? kayit.guncelleme.toISOString().slice(0, 10),
    publicHook: katalog?.publicHook,
    kurulu: true,
    durum: kayit.durum as 'kurulu' | 'aktif' | 'pasif',
    kaynak: kayit.kaynak as 'katalog' | 'yukleme',
    ayarlarJson: kayit.ayarlarJson ?? {},
  };
}

export class EklentiService {
  async listele(siteId: number) {
    const kurulumlar = await repo.findBySiteId(siteId);
    const kuruluMap = new Map(kurulumlar.map((k) => [k.kod, k]));

    const katalogKartlari = EKLENTI_KATALOGU.map((k) => {
      const kurulum = kuruluMap.get(k.kod);
      if (kurulum) return kurulumdanKart(kurulum);
      return {
        ...k,
        kurulu: false,
        durum: undefined,
        kaynak: undefined,
        ayarlarJson: {},
      };
    });

    const yuklenenEkstra = kurulumlar
      .filter((k) => k.kaynak === 'yukleme' && !katalogKaydiBul(k.kod))
      .map((k) => kurulumdanKart(k));

    return [...katalogKartlari, ...yuklenenEkstra];
  }

  async kur(siteId: number, kod: string) {
    const katalog = katalogKaydiBul(kod);
    if (!katalog) throw new Error('Eklenti katalogda bulunamadi');

    const mevcut = await repo.findByKod(siteId, kod);
    if (mevcut) throw new Error('Eklenti zaten kurulu');

    return repo.create(siteId, {
      kod: katalog.kod,
      ad: katalog.ad,
      surum: katalog.surum,
      durum: 'kurulu',
      kaynak: 'katalog',
      manifestJson: {
        aciklama: katalog.aciklama,
        gelistirici: katalog.gelistirici,
        publicHook: katalog.publicHook,
      } as Prisma.InputJsonValue,
      ayarlarJson: varsayilanEklentiAyarlar(katalog.kod) as Prisma.InputJsonValue,
    });
  }

  async aktif(siteId: number, kod: string) {
    const kayit = await repo.findByKod(siteId, kod);
    if (!kayit) throw new Error('Eklenti kurulu degil');
    return repo.update(kayit.id, { durum: 'aktif' });
  }

  async pasif(siteId: number, kod: string) {
    const kayit = await repo.findByKod(siteId, kod);
    if (!kayit) throw new Error('Eklenti kurulu degil');
    return repo.update(kayit.id, { durum: 'pasif' });
  }

  async kaldir(siteId: number, kod: string) {
    const kayit = await repo.findByKod(siteId, kod);
    if (!kayit) throw new Error('Eklenti kurulu degil');
    await repo.deleteByKod(siteId, kod);
    return kayit;
  }

  async aktifEklentilerPublic(siteId: number) {
    const aktifler = await repo.findAktifBySiteId(siteId);
    return aktifler.map((k) => ({
      kod: k.kod,
      ayarlarJson: k.ayarlarJson ?? {},
      manifestJson: k.manifestJson ?? {},
      kaynak: k.kaynak,
    }));
  }
}
