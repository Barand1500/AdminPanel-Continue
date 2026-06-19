import type { SeoGenelGuncelleDto, SeoMetaGuncelleDto, SeoTopluKaydetDto } from '../Application/DTOs/SeoDto.js';
import { SayfaRepository } from '../Infrastructure/repositories/SayfaRepository.js';
import { SeoYonlendirmeRepository } from '../Infrastructure/repositories/SeoYonlendirmeRepository.js';
import { SiteAyarlariRepository } from '../Infrastructure/repositories/SiteAyarlariRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';

const siteRepo = new SiteRepository();
const ayarlarRepo = new SiteAyarlariRepository();
const sayfaRepo = new SayfaRepository();
const yonlendirmeRepo = new SeoYonlendirmeRepository();

function urlNormalize(url: string): string {
  const temiz = url.trim();
  if (!temiz) return '/';
  return temiz.startsWith('/') ? temiz : `/${temiz}`;
}

function sayisalId(id: string | number): number {
  const n = typeof id === 'number' ? id : Number.parseInt(String(id), 10);
  if (Number.isNaN(n)) throw new Error('Gecersiz kayit id');
  return n;
}

function yeniKayitId(id?: string | number): boolean {
  if (id == null) return true;
  const s = String(id);
  return s.startsWith('yeni-') || Number.isNaN(Number.parseInt(s, 10));
}

export class SeoService {
  async ozet(siteId: number) {
    const site = await siteRepo.findById(siteId);
    if (!site) throw new Error('Site bulunamadi');

    const sayfalar = await sayfaRepo.findAdminBySiteId(siteId);
    const yonlendirmeler = await yonlendirmeRepo.findBySiteId(siteId);

    return {
      genel: {
        seoBaslik: site.siteAyarlari?.seoBaslik ?? null,
        seoAciklama: site.siteAyarlari?.seoAciklama ?? null,
        seoAnahtar: site.siteAyarlari?.seoAnahtar ?? null,
        ogGorselUrl: site.siteAyarlari?.ogGorselUrl ?? null,
      },
      kategoriler: [],
      markalar: [],
      firsatlar: [],
      sayfalar: sayfalar.map((s) => ({
        id: s.id,
        baslik: s.baslik,
        slug: s.slug,
        seoTitle: s.seoTitle,
        seoDesc: s.seoDesc,
      })),
      urunler: [],
      yonlendirmeler: yonlendirmeler.map((y) => ({
        id: y.id,
        hedefTip: y.hedefTip,
        hedefId: y.hedefId,
        kaynakUrl: y.kaynakUrl,
        seoTitle: y.seoTitle,
        seoDesc: y.seoDesc,
        kod: y.kod,
      })),
    };
  }

  async genelGuncelle(siteId: number, dto: SeoGenelGuncelleDto) {
    return ayarlarRepo.upsert(siteId, {
      seoBaslik: dto.seoBaslik,
      seoAciklama: dto.seoAciklama,
      seoAnahtar: dto.seoAnahtar,
      ogGorselUrl: dto.ogGorselUrl,
    });
  }

  async sayfaGuncelle(siteId: number, sayfaId: number, dto: SeoMetaGuncelleDto) {
    const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!mevcut) throw new Error('Sayfa bulunamadi');
    return sayfaRepo.updateForSite(sayfaId, {
      seoTitle: dto.seoTitle,
      seoDesc: dto.seoDesc,
    });
  }

  async topluKaydet(siteId: number, dto: SeoTopluKaydetDto) {
    for (const kayit of dto.kayitlar) {
      const id = sayisalId(kayit.id);
      if (kayit.tip === 'sayfa') {
        await this.sayfaGuncelle(siteId, id, {
          seoTitle: kayit.seoTitle ?? null,
          seoDesc: kayit.seoDesc ?? null,
        });
      }
    }

    for (const y of dto.yonlendirmeler) {
      const kaynakUrl = urlNormalize(y.kaynakUrl);

      if (y.sil) {
        if (!yeniKayitId(y.id)) {
          await yonlendirmeRepo.delete(sayisalId(y.id!), siteId);
        }
        continue;
      }

      const hedefId = sayisalId(y.hedefId);
      const kod = y.kod ?? 301;

      if (yeniKayitId(y.id)) {
        const cakisan = await yonlendirmeRepo.kaynakUrlVarMi(siteId, kaynakUrl);
        if (cakisan) throw new Error(`Bu URL zaten kullaniliyor: ${kaynakUrl}`);
        await yonlendirmeRepo.create(siteId, {
          hedefTip: y.hedefTip,
          hedefId,
          kaynakUrl,
          seoTitle: y.seoTitle ?? null,
          seoDesc: y.seoDesc ?? null,
          kod,
        });
      } else {
        const id = sayisalId(y.id!);
        const cakisan = await yonlendirmeRepo.kaynakUrlVarMi(siteId, kaynakUrl, id);
        if (cakisan) throw new Error(`Bu URL zaten kullaniliyor: ${kaynakUrl}`);
        await yonlendirmeRepo.update(id, siteId, {
          kaynakUrl,
          seoTitle: y.seoTitle ?? null,
          seoDesc: y.seoDesc ?? null,
          kod,
          hedefTip: y.hedefTip,
          hedefId,
        });
      }
    }

    return this.ozet(siteId);
  }

  async publicYonlendirmeler(siteId: number) {
    return yonlendirmeRepo.findPublicBySiteId(siteId);
  }
}
