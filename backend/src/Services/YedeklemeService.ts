import { YedeklemeRepository } from '../Infrastructure/repositories/YedeklemeRepository.js';
import { YedekKaydiRepository } from '../Infrastructure/repositories/YedekKaydiRepository.js';
import { KullaniciRepository } from '../Infrastructure/repositories/KullaniciRepository.js';
import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';
import { prisma } from '../Infrastructure/database/prismaClient.js';
import type { Prisma } from '@prisma/client';
import type { JwtPayload } from './AuthService.js';

const yedekRepo = new YedeklemeRepository();
const yedekKaydiRepo = new YedekKaydiRepository();
const kullaniciRepo = new KullaniciRepository();

const YEDEK_SURUM = '1.0';

type SiteVerisi = NonNullable<Awaited<ReturnType<YedeklemeRepository['siteVerisiGetir']>>>;

interface YedekPayload {
  meta: {
    surum: string;
    site: { ad: string; slug: string };
    olusturma: string;
    kullanici: string;
  };
  site: SiteVerisi;
  loglar: Awaited<ReturnType<YedeklemeRepository['loglariGetir']>>;
  yedekKayitlari: Awaited<ReturnType<YedekKaydiRepository['listele']>>;
}

export function dosyaAdiOlustur(siteAd: string, siteSlug: string): string {
  const ad = siteAd
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || siteSlug;
  const tarih = new Date().toISOString().slice(0, 10);
  return `${ad}-admin-${tarih}.json`;
}

function dosyaAdiDogrula(ad: string): string {
  const temiz = ad.trim().replace(/[^a-zA-Z0-9._-]/g, '-');
  return temiz.endsWith('.json') ? temiz : `${temiz}.json`;
}

async function kullaniciBilgi(kullanici: JwtPayload) {
  const dbKullanici = await kullaniciRepo.findById(kullanici.kullaniciId);
  return {
    kullaniciId: kullanici.kullaniciId,
    kullaniciAd: dbKullanici?.ad ?? kullanici.email.split('@')[0],
    kullaniciEmail: kullanici.email,
  };
}

async function siteVeriYukle(payload: YedekPayload) {
  const {
    siteAyarlari,
    kullanicilar,
    sayfalar,
    widgetlar,
    medyalar,
    blogYazilari,
    formTanimlari,
    ...site
  } = payload.site;

  await prisma.site.create({
    data: {
      id: site.id,
      ad: site.ad,
      slug: site.slug,
      domain: site.domain,
      aktif: site.aktif,
      olusturma: site.olusturma,
      guncelleme: site.guncelleme,
      siteAyarlari: siteAyarlari
        ? {
            create: {
              id: siteAyarlari.id,
              logoUrl: siteAyarlari.logoUrl,
              faviconUrl: siteAyarlari.faviconUrl,
              anaRenk: siteAyarlari.anaRenk,
              ikincilRenk: siteAyarlari.ikincilRenk,
              slogan: siteAyarlari.slogan,
              font: siteAyarlari.font,
              telefon: siteAyarlari.telefon,
              email: siteAyarlari.email,
              adres: siteAyarlari.adres,
              whatsapp: siteAyarlari.whatsapp,
              telifYazisi: siteAyarlari.telifYazisi,
              sosyalMedyaJson: siteAyarlari.sosyalMedyaJson ?? undefined,
              seoBaslik: siteAyarlari.seoBaslik,
              seoAciklama: siteAyarlari.seoAciklama,
              seoAnahtar: siteAyarlari.seoAnahtar,
              ogGorselUrl: siteAyarlari.ogGorselUrl,
              sistemAyarlariJson: siteAyarlari.sistemAyarlariJson ?? undefined,
            },
          }
        : undefined,
      kullanicilar: {
        create: kullanicilar.map((k) => ({
          id: k.id,
          email: k.email,
          sifreHash: k.sifreHash,
          ad: k.ad,
          rol: k.rol,
          aktif: k.aktif,
          olusturma: k.olusturma,
          guncelleme: k.guncelleme,
          tercihlerJson: (k.tercihlerJson ?? undefined) as Prisma.InputJsonValue | undefined,
        })),
      },
      sayfalar: {
        create: sayfalar.map((s) => ({
          id: s.id,
          baslik: s.baslik,
          slug: s.slug,
          icerik: s.icerik,
          kapakGorsel: s.kapakGorsel,
          seoTitle: s.seoTitle,
          seoDesc: s.seoDesc,
          yayinda: s.yayinda,
          menudeGoster: s.menudeGoster,
          sira: s.sira,
          olusturma: s.olusturma,
          guncelleme: s.guncelleme,
        })),
      },
      widgetlar: {
        create: widgetlar.map((w) => ({
          id: w.id,
          ad: w.ad,
          tip: w.tip,
          sira: w.sira,
          aktif: w.aktif,
          baslik: w.baslik,
          altBaslik: w.altBaslik,
          aciklama: w.aciklama,
          gorselUrl: w.gorselUrl,
          butonMetni: w.butonMetni,
          butonLink: w.butonLink,
          arkaPlanRenk: w.arkaPlanRenk,
          yaziRenk: w.yaziRenk,
          mobilGoster: w.mobilGoster,
          masaustuGoster: w.masaustuGoster,
          configJson: (w.configJson ?? undefined) as Prisma.InputJsonValue | undefined,
          sayfaId: w.sayfaId,
          olusturma: w.olusturma,
          guncelleme: w.guncelleme,
        })),
      },
      medyalar: {
        create: medyalar.map((m) => ({
          id: m.id,
          ad: m.ad,
          url: m.url,
          tip: m.tip,
          boyut: m.boyut,
          olusturma: m.olusturma,
        })),
      },
      blogYazilari: {
        create: blogYazilari.map((b) => ({
          id: b.id,
          baslik: b.baslik,
          slug: b.slug,
          ozet: b.ozet,
          icerik: b.icerik,
          kapakGorsel: b.kapakGorsel,
          yazar: b.yazar,
          kategori: b.kategori,
          yayinda: b.yayinda,
          oneCikan: b.oneCikan,
          seoTitle: b.seoTitle,
          seoDesc: b.seoDesc,
          olusturma: b.olusturma,
          guncelleme: b.guncelleme,
        })),
      },
      formTanimlari: {
        create: formTanimlari.map((f) => ({
          id: f.id,
          ad: f.ad,
          slug: f.slug,
          aciklama: f.aciklama,
          aktif: f.aktif,
          bildirimEmail: f.bildirimEmail,
          olusturma: f.olusturma,
          guncelleme: f.guncelleme,
          alanlarJson: (f.alanlarJson ?? []) as Prisma.InputJsonValue,
          ayarlarJson: (f.ayarlarJson ?? undefined) as Prisma.InputJsonValue | undefined,
          gonderimler: {
            create: f.gonderimler.map((g) => ({
              id: g.id,
              okundu: g.okundu,
              olusturma: g.olusturma,
              veriJson: g.veriJson as Prisma.InputJsonValue,
            })),
          },
        })),
      },
    },
  });

  for (const log of payload.loglar) {
    await prisma.adminLog.create({ data: log });
  }

  for (const kayit of payload.yedekKayitlari) {
    await prisma.yedekKaydi.create({ data: kayit });
  }
}

export class YedeklemeService {
  async varsayilanDosyaAdi(kullanici: JwtPayload) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici);
    const site = await yedekRepo.siteVerisiGetir(siteId);
    if (!site) throw new Error('Site bulunamadi');
    return { dosyaAdi: dosyaAdiOlustur(site.ad, site.slug) };
  }

  async jsonYedekOlustur(kullanici: JwtPayload, ozelDosyaAdi?: string) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici);
    const site = await yedekRepo.siteVerisiGetir(siteId);
    if (!site) throw new Error('Site bulunamadi');

    const loglar = await yedekRepo.loglariGetir(siteId);
    const yedekKayitlari = await yedekKaydiRepo.listele(siteId, 200);

    const payload: YedekPayload = {
      meta: {
        surum: YEDEK_SURUM,
        site: { ad: site.ad, slug: site.slug },
        olusturma: new Date().toISOString(),
        kullanici: kullanici.email,
      },
      site,
      loglar,
      yedekKayitlari,
    };

    const dosyaAdi = ozelDosyaAdi
      ? dosyaAdiDogrula(ozelDosyaAdi)
      : dosyaAdiOlustur(site.ad, site.slug);

    return {
      dosyaAdi,
      icerik: JSON.stringify(payload, null, 2),
      siteId,
    };
  }

  async indirVeKaydet(kullanici: JwtPayload, ozelDosyaAdi?: string) {
    const { dosyaAdi, icerik, siteId } = await this.jsonYedekOlustur(kullanici, ozelDosyaAdi);
    const kb = await kullaniciBilgi(kullanici);

    await yedekKaydiRepo.kaydet({
      siteId,
      kullaniciId: kb.kullaniciId,
      kullaniciAd: kb.kullaniciAd,
      kullaniciEmail: kb.kullaniciEmail,
      dosyaAdi,
      tip: 'indir',
    });

    return { dosyaAdi, icerik };
  }

  async gecmisListele(kullanici: JwtPayload) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici);
    const kayitlar = await yedekKaydiRepo.listele(siteId);
    const sonKayit = await yedekKaydiRepo.sonKayit(siteId);
    return { kayitlar, sonKayit };
  }

  async jsonGeriYukle(kullanici: JwtPayload, jsonIcerik: string, dosyaAdi: string) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici);

    let payload: YedekPayload;
    try {
      payload = JSON.parse(jsonIcerik) as YedekPayload;
    } catch {
      throw new Error('Gecersiz JSON dosyasi');
    }

    if (!payload?.site?.id || !payload?.site?.slug) {
      throw new Error('Yedek dosyasinda site verisi bulunamadi');
    }

    if (payload.site.id !== siteId) {
      throw new Error('Yedek dosyasi bu siteye ait degil');
    }

    await yedekRepo.siteVeriTemizle(siteId);
    await siteVeriYukle(payload);

    const temizAd = dosyaAdiDogrula(dosyaAdi || 'geri-yukleme.json');
    const kb = await kullaniciBilgi(kullanici);

    await yedekKaydiRepo.kaydet({
      siteId,
      kullaniciId: kb.kullaniciId,
      kullaniciAd: kb.kullaniciAd,
      kullaniciEmail: kb.kullaniciEmail,
      dosyaAdi: temizAd,
      tip: 'geri_yukle',
    });

    return { basarili: true, dosyaAdi: temizAd };
  }
}
