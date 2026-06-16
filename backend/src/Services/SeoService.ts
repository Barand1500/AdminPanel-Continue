import type { SeoGenelGuncelleDto, SeoMetaGuncelleDto } from '../Application/DTOs/SeoDto.js';
import { SayfaRepository } from '../Infrastructure/repositories/SayfaRepository.js';
import { SiteAyarlariRepository } from '../Infrastructure/repositories/SiteAyarlariRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';

const siteRepo = new SiteRepository();
const ayarlarRepo = new SiteAyarlariRepository();
const sayfaRepo = new SayfaRepository();

export class SeoService {
  async ozet(siteId: number) {
    const site = await siteRepo.findById(siteId);
    if (!site) throw new Error('Site bulunamadi');

    const sayfalar = await sayfaRepo.findAdminBySiteId(siteId);

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
}
