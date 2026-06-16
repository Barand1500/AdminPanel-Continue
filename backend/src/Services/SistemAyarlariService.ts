import type {
  SistemAyarlariGuncelleDto,
  SistemAyarlariJson,
  Sayfa404Ayarlari,
} from '../Application/DTOs/SistemAyarlariDto.js';
import { SistemAyariRepository } from '../Infrastructure/repositories/SistemAyariRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import type { JwtPayload } from './AuthService.js';
import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';
import { opsiyonelSayisalId } from '../Infrastructure/utils/sayisalId.js';

const siteRepo = new SiteRepository();
const ayarlarRepo = new SistemAyariRepository();

const varsayilan404: Sayfa404Ayarlari = {
  baslik: 'Sayfa Bulunamadı',
  mesaj: 'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.',
  menuTipi: 'ust',
  anaSayfaButonu: true,
  gorselUrl: '',
  oneriSayfaId: null,
};

const varsayilanSistem: SistemAyarlariJson = {
  bakimModu: false,
  bakimMesaji: 'Site geçici olarak bakımda. Lütfen daha sonra tekrar deneyin.',
  bakimBaslik: 'Bakım Çalışması',
  bakimGorselUrl: '',
  bakimTahminiSure: '',
  bakimIpBeyazListe: [],
  logSaklamaGun: 90,
  panelDili: 'tr',
  panelCeviriler: {},
  sayfa404: { ...varsayilan404 },
  otomatikYedekleme: false,
  otomatikYedeklemeGun: 7,
  guvenlikBasliklari: true,
  robotsEngelle: false,
};

function sayfa404Coz(json: unknown): Sayfa404Ayarlari {
  if (!json || typeof json !== 'object') return { ...varsayilan404 };
  const k = json as Record<string, unknown>;
  const menuTipi = k.menuTipi;
  return {
    baslik: typeof k.baslik === 'string' ? k.baslik : varsayilan404.baslik,
    mesaj: typeof k.mesaj === 'string' ? k.mesaj : varsayilan404.mesaj,
    gorselUrl: typeof k.gorselUrl === 'string' ? k.gorselUrl : '',
    menuTipi:
      menuTipi === 'footer' || menuTipi === 'her-ikisi' || menuTipi === 'yok'
        ? menuTipi
        : 'ust',
    oneriSayfaId: typeof k.oneriSayfaId === 'string' ? k.oneriSayfaId : null,
    anaSayfaButonu: typeof k.anaSayfaButonu === 'boolean' ? k.anaSayfaButonu : true,
  };
}

function panelCevirilerCoz(json: unknown): Record<string, Record<string, string>> {
  if (!json || typeof json !== 'object') return {};
  const sonuc: Record<string, Record<string, string>> = {};
  for (const [dil, sozluk] of Object.entries(json as Record<string, unknown>)) {
    if (!sozluk || typeof sozluk !== 'object') continue;
    const kayit: Record<string, string> = {};
    for (const [anahtar, deger] of Object.entries(sozluk as Record<string, unknown>)) {
      if (typeof deger === 'string') kayit[anahtar] = deger;
    }
    if (Object.keys(kayit).length > 0) sonuc[dil] = kayit;
  }
  return sonuc;
}

function sistemAyarlariCozKayit(kayit: Record<string, unknown>): SistemAyarlariJson {
  return {
    bakimModu: typeof kayit.bakimModu === 'boolean' ? kayit.bakimModu : varsayilanSistem.bakimModu,
    bakimMesaji:
      typeof kayit.bakimMesaji === 'string' ? kayit.bakimMesaji : varsayilanSistem.bakimMesaji,
    bakimBaslik:
      typeof kayit.bakimBaslik === 'string' ? kayit.bakimBaslik : varsayilanSistem.bakimBaslik,
    bakimGorselUrl:
      typeof kayit.bakimGorselUrl === 'string' ? kayit.bakimGorselUrl : '',
    bakimTahminiSure:
      typeof kayit.bakimTahminiSure === 'string' ? kayit.bakimTahminiSure : '',
    bakimIpBeyazListe: Array.isArray(kayit.bakimIpBeyazListe)
      ? kayit.bakimIpBeyazListe.filter((x): x is string => typeof x === 'string')
      : [],
    logSaklamaGun:
      typeof kayit.logSaklamaGun === 'number' ? kayit.logSaklamaGun : varsayilanSistem.logSaklamaGun,
    panelDili: typeof kayit.panelDili === 'string' ? kayit.panelDili : 'tr',
    panelCeviriler: panelCevirilerCoz(kayit.panelCeviriler),
    sayfa404: sayfa404Coz(kayit.sayfa404),
    otomatikYedekleme:
      typeof kayit.otomatikYedekleme === 'boolean'
        ? kayit.otomatikYedekleme
        : varsayilanSistem.otomatikYedekleme,
    otomatikYedeklemeGun:
      typeof kayit.otomatikYedeklemeGun === 'number'
        ? kayit.otomatikYedeklemeGun
        : varsayilanSistem.otomatikYedeklemeGun,
    guvenlikBasliklari:
      typeof kayit.guvenlikBasliklari === 'boolean'
        ? kayit.guvenlikBasliklari
        : varsayilanSistem.guvenlikBasliklari,
    robotsEngelle:
      typeof kayit.robotsEngelle === 'boolean' ? kayit.robotsEngelle : varsayilanSistem.robotsEngelle,
  };
}

function sistemAyariSatirdanCoz(satir: Record<string, unknown> | null | undefined): SistemAyarlariJson {
  if (!satir) return { ...varsayilanSistem };
  return {
    bakimModu: typeof satir.bakimModu === 'boolean' ? satir.bakimModu : false,
    bakimMesaji:
      typeof satir.bakimMesaji === 'string' ? satir.bakimMesaji : varsayilanSistem.bakimMesaji,
    bakimBaslik:
      typeof satir.bakimBaslik === 'string' ? satir.bakimBaslik : varsayilanSistem.bakimBaslik,
    bakimGorselUrl: typeof satir.bakimGorselUrl === 'string' ? satir.bakimGorselUrl : '',
    bakimTahminiSure: typeof satir.bakimTahminiSure === 'string' ? satir.bakimTahminiSure : '',
    bakimIpBeyazListe: Array.isArray(satir.bakimIpBeyazListeJson)
      ? satir.bakimIpBeyazListeJson.filter((x): x is string => typeof x === 'string')
      : [],
    logSaklamaGun:
      typeof satir.logSaklamaGun === 'number' ? satir.logSaklamaGun : varsayilanSistem.logSaklamaGun,
    panelDili: typeof satir.panelDili === 'string' ? satir.panelDili : 'tr',
    panelCeviriler: panelCevirilerCoz(satir.panelCevirilerJson),
    sayfa404: {
      baslik:
        typeof satir.sayfa404Baslik === 'string' ? satir.sayfa404Baslik : varsayilan404.baslik,
      mesaj: typeof satir.sayfa404Mesaj === 'string' ? satir.sayfa404Mesaj : varsayilan404.mesaj,
      gorselUrl: typeof satir.sayfa404GorselUrl === 'string' ? satir.sayfa404GorselUrl : '',
      menuTipi:
        satir.sayfa404MenuTipi === 'footer' ||
        satir.sayfa404MenuTipi === 'her-ikisi' ||
        satir.sayfa404MenuTipi === 'yok'
          ? satir.sayfa404MenuTipi
          : 'ust',
      oneriSayfaId:
        satir.sayfa404OneriSayfaId != null ? String(satir.sayfa404OneriSayfaId) : null,
      anaSayfaButonu:
        typeof satir.sayfa404AnaSayfaButonu === 'boolean' ? satir.sayfa404AnaSayfaButonu : true,
    },
    otomatikYedekleme:
      typeof satir.otomatikYedekleme === 'boolean' ? satir.otomatikYedekleme : false,
    otomatikYedeklemeGun:
      typeof satir.otomatikYedeklemeGun === 'number' ? satir.otomatikYedeklemeGun : 7,
    guvenlikBasliklari:
      typeof satir.guvenlikBasliklari === 'boolean' ? satir.guvenlikBasliklari : true,
    robotsEngelle: typeof satir.robotsEngelle === 'boolean' ? satir.robotsEngelle : false,
  };
}

function satirYoksaEskidenCoz(site: Awaited<ReturnType<SiteRepository['findById']>>) {
  if (site?.siteAyarlari?.sistemAyarlariJson && typeof site.siteAyarlari.sistemAyarlariJson === 'object') {
    return sistemAyarlariCozKayit(site.siteAyarlari.sistemAyarlariJson as Record<string, unknown>);
  }
  return { ...varsayilanSistem };
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
      sistem: sistemAyariSatirdanCoz(ayar as Record<string, unknown>),
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
    };

    if (dto.siteAktif !== undefined || dto.domain !== undefined) {
      await siteRepo.guncelle(siteId, {
        ...(dto.siteAktif !== undefined ? { aktif: dto.siteAktif } : {}),
        ...(dto.domain !== undefined ? { domain: dto.domain || null } : {}),
      });
    }

    await ayarlarRepo.upsert(siteId, {
      bakimModu: guncel.bakimModu ?? false,
      bakimBaslik: guncel.bakimBaslik ?? varsayilanSistem.bakimBaslik,
      bakimMesaji: guncel.bakimMesaji ?? varsayilanSistem.bakimMesaji,
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
      // Dinamik genisleme alani: yeni sistem sekmeleri/opsiyonlari burada tutulabilir.
      ekAyarlarJson: {},
    });

    return this.getir(kullanici, explicitSiteId);
  }
}
