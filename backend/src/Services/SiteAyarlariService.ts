import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';
import type { SiteAyarlariGuncelleDto } from '../Application/DTOs/SiteAyarlariDto.js';
import type { HeaderAyarlariDto } from '../Application/DTOs/HeaderAyarlariDto.js';
import { SiteAyarlariRepository } from '../Infrastructure/repositories/SiteAyarlariRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import { TcmbKurService } from './TcmbKurService.js';
import type { JwtPayload } from './AuthService.js';

const siteRepo = new SiteRepository();
const ayarlarRepo = new SiteAyarlariRepository();
const tcmbService = new TcmbKurService();

async function headerKurlariCoz(header: HeaderAyarlariDto): Promise<HeaderAyarlariDto> {
  if (!header.kurlar?.length) return header;

  const tcmbKayitlar = header.kurlar.filter((k) => k.kaynak === 'tcmb' && k.kod !== 'TRY');
  let tcmbMap = new Map<string, number>();

  if (tcmbKayitlar.length > 0) {
    try {
      tcmbMap = await tcmbService.topluGuncelle(
        tcmbKayitlar.map((k) => ({ kod: k.kod, kurTipi: k.kurTipi ?? 'doviz_satis' }))
      );
    } catch {
      /* TCMB erisilemezse mevcut guncelKur korunur */
    }
  }

  const kurlar = header.kurlar.map((k) => {
    if (k.kod === 'TRY') return { ...k, guncelKur: 1 };
    if (k.kaynak === 'manuel') return { ...k, guncelKur: k.manuelKur };
    const guncel = tcmbMap.get(k.kod.toUpperCase());
    return guncel != null ? { ...k, guncelKur: guncel } : k;
  });

  return {
    ...header,
    kurlar,
    sonKurGuncelleme: new Date().toISOString(),
  };
}

export class SiteAyarlariService {
  async getir(kullanici: JwtPayload, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    const site = await siteRepo.findById(siteId);
    if (!site) throw new Error('Site bulunamadi');

    return {
      site: { id: site.id, ad: site.ad, slug: site.slug },
      ayarlar: site.siteAyarlari,
    };
  }

  async guncelle(kullanici: JwtPayload, dto: SiteAyarlariGuncelleDto, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    const site = await siteRepo.findById(siteId);
    if (!site) throw new Error('Site bulunamadi');

    const { siteAd, ...ayarlarVerisi } = dto;

    if (siteAd) {
      await siteRepo.updateAd(siteId, siteAd);
    }

    const temizVeri = Object.fromEntries(
      Object.entries(ayarlarVerisi)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, v === '' ? null : v])
    );

    if (temizVeri.headerAyarlariJson && typeof temizVeri.headerAyarlariJson === 'object') {
      temizVeri.headerAyarlariJson = await headerKurlariCoz(
        temizVeri.headerAyarlariJson as HeaderAyarlariDto
      );
    }

    if (Object.keys(temizVeri).length > 0) {
      await ayarlarRepo.upsert(siteId, temizVeri);
    }

    return this.getir(kullanici, siteId);
  }
}
