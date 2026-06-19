import { Prisma } from '@prisma/client';
import type {
  SistemAyarlariGuncelleDto,
  SistemAyarlariJson,
} from '../Application/DTOs/SistemAyarlariDto.js';
import { SistemAyariRepository } from '../Infrastructure/repositories/SistemAyariRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import type { JwtPayload } from './AuthService.js';
import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';
import { opsiyonelSayisalId } from '../Infrastructure/utils/sayisalId.js';
import {
  sistemAyariSatirdanJson,
  sistemAyarlariJsonCozKayit,
  varsayilanSistemAyarlari,
} from '../Infrastructure/utils/sistemAyariMapper.js';

const siteRepo = new SiteRepository();
const ayarlarRepo = new SistemAyariRepository();

const varsayilan404 = varsayilanSistemAyarlari.sayfa404!;

function satirYoksaEskidenCoz(site: Awaited<ReturnType<SiteRepository['findById']>>) {
  if (site?.siteAyarlari?.sistemAyarlariJson && typeof site.siteAyarlari.sistemAyarlariJson === 'object') {
    return sistemAyarlariJsonCozKayit(site.siteAyarlari.sistemAyarlariJson as Record<string, unknown>);
  }
  return { ...varsayilanSistemAyarlari };
}

export class SistemAyarlariService {
  async getir(kullanici: JwtPayload, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    const site = await siteRepo.findById(siteId);
    if (!site) throw new Error('Site bulunamadi');
    let ayar = await ayarlarRepo.findBySiteId(siteId);

    if (!ayar) {
      const eski = satirYoksaEskidenCoz(site);
      ayar = await ayarlarRepo.upsert(siteId, {
        bakimModu: eski.bakimModu,
        bakimBaslik: eski.bakimBaslik,
        bakimMesaji: eski.bakimMesaji,
        bakimGorselUrl: eski.bakimGorselUrl || null,
        bakimTahminiSure: eski.bakimTahminiSure || null,
        bakimIpBeyazListeJson: eski.bakimIpBeyazListe ?? [],
        logSaklamaGun: eski.logSaklamaGun ?? 90,
        panelDili: eski.panelDili ?? 'tr',
        panelCevirilerJson: eski.panelCeviriler ?? {},
        sayfa404Baslik: eski.sayfa404?.baslik ?? varsayilan404.baslik,
        sayfa404Mesaj: eski.sayfa404?.mesaj ?? varsayilan404.mesaj,
        sayfa404GorselUrl: eski.sayfa404?.gorselUrl || null,
        sayfa404MenuTipi: eski.sayfa404?.menuTipi ?? 'ust',
        sayfa404OneriSayfaId: opsiyonelSayisalId(eski.sayfa404?.oneriSayfaId ?? null),
        sayfa404AnaSayfaButonu: eski.sayfa404?.anaSayfaButonu ?? true,
        otomatikYedekleme: eski.otomatikYedekleme ?? false,
        otomatikYedeklemeGun: eski.otomatikYedeklemeGun ?? 7,
        guvenlikBasliklari: eski.guvenlikBasliklari ?? true,
        robotsEngelle: eski.robotsEngelle ?? false,
      });
    }

    return {
      site: {
        id: site.id,
        ad: site.ad,
        slug: site.slug,
        domain: site.domain,
        aktif: site.aktif,
      },
      sistem: sistemAyariSatirdanJson(ayar as Record<string, unknown>),
      surum: '0.4.0',
    };
  }

  async guncelle(
    kullanici: JwtPayload,
    dto: SistemAyarlariGuncelleDto,
    explicitSiteId?: string | number | null
  ) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    const site = await siteRepo.findById(siteId);
    if (!site) throw new Error('Site bulunamadi');

    const mevcutSatir = await ayarlarRepo.findBySiteId(siteId);
    const mevcutEk =
      mevcutSatir?.ekAyarlarJson && typeof mevcutSatir.ekAyarlarJson === 'object'
        ? ({ ...(mevcutSatir.ekAyarlarJson as Record<string, unknown>) } as Record<string, unknown>)
        : {};

    const mevcut = await this.getir(kullanici, explicitSiteId).then((x) => x.sistem);
    const guncel: SistemAyarlariJson = {
      bakimModu: dto.bakimModu ?? mevcut.bakimModu,
      bakimMesaji: dto.bakimMesaji ?? mevcut.bakimMesaji,
      bakimBaslik: dto.bakimBaslik ?? mevcut.bakimBaslik,
      bakimGorselUrl: dto.bakimGorselUrl ?? mevcut.bakimGorselUrl,
      bakimTahminiSure: dto.bakimTahminiSure ?? mevcut.bakimTahminiSure,
      bakimIpBeyazListe: dto.bakimIpBeyazListe ?? mevcut.bakimIpBeyazListe,
      logSaklamaGun: dto.logSaklamaGun ?? mevcut.logSaklamaGun,
      panelDili: dto.panelDili ?? mevcut.panelDili,
      panelCeviriler: dto.panelCeviriler ?? mevcut.panelCeviriler,
      sayfa404: dto.sayfa404 ? { ...mevcut.sayfa404, ...dto.sayfa404 } : mevcut.sayfa404,
      otomatikYedekleme: dto.otomatikYedekleme ?? mevcut.otomatikYedekleme,
      otomatikYedeklemeGun: dto.otomatikYedeklemeGun ?? mevcut.otomatikYedeklemeGun,
      guvenlikBasliklari: dto.guvenlikBasliklari ?? mevcut.guvenlikBasliklari,
      robotsEngelle: dto.robotsEngelle ?? mevcut.robotsEngelle,
      sagTikPaneli: dto.sagTikPaneli ?? mevcut.sagTikPaneli,
    };

    if (dto.sagTikPaneli !== undefined) {
      mevcutEk.sagTikPaneli = dto.sagTikPaneli;
    }

    if (dto.siteAktif !== undefined || dto.domain !== undefined) {
      await siteRepo.guncelle(siteId, {
        ...(dto.siteAktif !== undefined ? { aktif: dto.siteAktif } : {}),
        ...(dto.domain !== undefined ? { domain: dto.domain || null } : {}),
      });
    }

    await ayarlarRepo.upsert(siteId, {
      bakimModu: guncel.bakimModu ?? false,
      bakimBaslik: guncel.bakimBaslik ?? varsayilanSistemAyarlari.bakimBaslik,
      bakimMesaji: guncel.bakimMesaji ?? varsayilanSistemAyarlari.bakimMesaji,
      bakimGorselUrl: guncel.bakimGorselUrl || null,
      bakimTahminiSure: guncel.bakimTahminiSure || null,
      bakimIpBeyazListeJson: guncel.bakimIpBeyazListe ?? [],
      logSaklamaGun: guncel.logSaklamaGun ?? 90,
      panelDili: guncel.panelDili ?? 'tr',
      panelCevirilerJson: guncel.panelCeviriler ?? {},
      sayfa404Baslik: guncel.sayfa404?.baslik ?? varsayilan404.baslik,
      sayfa404Mesaj: guncel.sayfa404?.mesaj ?? varsayilan404.mesaj,
      sayfa404GorselUrl: guncel.sayfa404?.gorselUrl || null,
      sayfa404MenuTipi: guncel.sayfa404?.menuTipi ?? 'ust',
      sayfa404OneriSayfaId: opsiyonelSayisalId(guncel.sayfa404?.oneriSayfaId ?? null),
      sayfa404AnaSayfaButonu: guncel.sayfa404?.anaSayfaButonu ?? true,
      otomatikYedekleme: guncel.otomatikYedekleme ?? false,
      otomatikYedeklemeGun: guncel.otomatikYedeklemeGun ?? 7,
      guvenlikBasliklari: guncel.guvenlikBasliklari ?? true,
      robotsEngelle: guncel.robotsEngelle ?? false,
      ekAyarlarJson: mevcutEk as Prisma.InputJsonValue,
    });

    return this.getir(kullanici, explicitSiteId);
  }
}
