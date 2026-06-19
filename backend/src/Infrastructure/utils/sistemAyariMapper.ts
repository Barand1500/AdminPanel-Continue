import type { Sayfa404Ayarlari, ScriptAyarlari, SistemAyarlariJson } from '../../Application/DTOs/SistemAyarlariDto.js';

const varsayilan404: Sayfa404Ayarlari = {
  baslik: 'Sayfa Bulunamadı',
  mesaj: 'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.',
  menuTipi: 'ust',
  anaSayfaButonu: true,
  gorselUrl: '',
  oneriSayfaId: null,
};

export const varsayilanSistemAyarlari: SistemAyarlariJson = {
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
  scriptAyarlari: {
    googleAnalytics: '',
    headerScript: '',
    bodyAcilisScript: '',
    footerScript: '',
  },
};

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

function scriptAyarlariCoz(kaynak: unknown): ScriptAyarlari {
  const varsayilan = varsayilanSistemAyarlari.scriptAyarlari!;
  if (!kaynak || typeof kaynak !== 'object') return { ...varsayilan };
  const s = kaynak as Record<string, unknown>;
  return {
    googleAnalytics: typeof s.googleAnalytics === 'string' ? s.googleAnalytics : '',
    headerScript: typeof s.headerScript === 'string' ? s.headerScript : '',
    bodyAcilisScript: typeof s.bodyAcilisScript === 'string' ? s.bodyAcilisScript : '',
    footerScript: typeof s.footerScript === 'string' ? s.footerScript : '',
  };
}

function scriptAyarlariEkAyarlarCoz(ekAyarlarJson: unknown): ScriptAyarlari {
  if (!ekAyarlarJson || typeof ekAyarlarJson !== 'object') {
    return { ...varsayilanSistemAyarlari.scriptAyarlari! };
  }
  const script = (ekAyarlarJson as Record<string, unknown>).scriptAyarlari;
  return scriptAyarlariCoz(script);
}

function sayfa404Coz(json: unknown): Sayfa404Ayarlari {
  if (!json || typeof json !== 'object') return { ...varsayilan404 };
  const k = json as Record<string, unknown>;
  const menuTipi = k.menuTipi;
  return {
    baslik: typeof k.baslik === 'string' ? k.baslik : varsayilan404.baslik,
    mesaj: typeof k.mesaj === 'string' ? k.mesaj : varsayilan404.mesaj,
    gorselUrl: typeof k.gorselUrl === 'string' ? k.gorselUrl : '',
    menuTipi:
      menuTipi === 'footer' || menuTipi === 'her-ikisi' || menuTipi === 'yok' ? menuTipi : 'ust',
    oneriSayfaId: typeof k.oneriSayfaId === 'string' ? k.oneriSayfaId : null,
    anaSayfaButonu: typeof k.anaSayfaButonu === 'boolean' ? k.anaSayfaButonu : true,
  };
}

function sagTikPaneliCoz(json: unknown): SistemAyarlariJson['sagTikPaneli'] | undefined {
  if (!json || typeof json !== 'object') return undefined;
  const k = json as Record<string, unknown>;
  const ogeler = Array.isArray(k.ogeler)
    ? k.ogeler
        .filter((o): o is { id: string; aktif: boolean } =>
          Boolean(o && typeof o === 'object' && typeof (o as Record<string, unknown>).id === 'string')
        )
        .map((o) => ({ id: o.id, aktif: Boolean((o as { aktif?: boolean }).aktif) }))
    : undefined;
  const modulIdler = Array.isArray(k.modulIdler)
    ? k.modulIdler.filter((x): x is string => typeof x === 'string')
    : undefined;
  return {
    aktif: typeof k.aktif === 'boolean' ? k.aktif : undefined,
    ogeler,
    modulIdler,
  };
}

export function sistemAyarlariJsonCozKayit(kayit: Record<string, unknown>): SistemAyarlariJson {
  return {
    bakimModu: typeof kayit.bakimModu === 'boolean' ? kayit.bakimModu : varsayilanSistemAyarlari.bakimModu,
    bakimMesaji:
      typeof kayit.bakimMesaji === 'string' ? kayit.bakimMesaji : varsayilanSistemAyarlari.bakimMesaji,
    bakimBaslik:
      typeof kayit.bakimBaslik === 'string' ? kayit.bakimBaslik : varsayilanSistemAyarlari.bakimBaslik,
    bakimGorselUrl: typeof kayit.bakimGorselUrl === 'string' ? kayit.bakimGorselUrl : '',
    bakimTahminiSure: typeof kayit.bakimTahminiSure === 'string' ? kayit.bakimTahminiSure : '',
    bakimIpBeyazListe: Array.isArray(kayit.bakimIpBeyazListe)
      ? kayit.bakimIpBeyazListe.filter((x): x is string => typeof x === 'string')
      : [],
    logSaklamaGun:
      typeof kayit.logSaklamaGun === 'number' ? kayit.logSaklamaGun : varsayilanSistemAyarlari.logSaklamaGun,
    panelDili: typeof kayit.panelDili === 'string' ? kayit.panelDili : 'tr',
    panelCeviriler: panelCevirilerCoz(kayit.panelCeviriler),
    sayfa404: sayfa404Coz(kayit.sayfa404),
    otomatikYedekleme:
      typeof kayit.otomatikYedekleme === 'boolean'
        ? kayit.otomatikYedekleme
        : varsayilanSistemAyarlari.otomatikYedekleme,
    otomatikYedeklemeGun:
      typeof kayit.otomatikYedeklemeGun === 'number'
        ? kayit.otomatikYedeklemeGun
        : varsayilanSistemAyarlari.otomatikYedeklemeGun,
    guvenlikBasliklari:
      typeof kayit.guvenlikBasliklari === 'boolean'
        ? kayit.guvenlikBasliklari
        : varsayilanSistemAyarlari.guvenlikBasliklari,
    robotsEngelle:
      typeof kayit.robotsEngelle === 'boolean' ? kayit.robotsEngelle : varsayilanSistemAyarlari.robotsEngelle,
    sagTikPaneli: sagTikPaneliCoz(kayit.sagTikPaneli),
    scriptAyarlari: scriptAyarlariCoz(kayit.scriptAyarlari),
  };
}

export function sistemAyariSatirdanJson(satir: Record<string, unknown> | null | undefined): SistemAyarlariJson {
  if (!satir) return { ...varsayilanSistemAyarlari };
  return {
    bakimModu: typeof satir.bakimModu === 'boolean' ? satir.bakimModu : false,
    bakimMesaji:
      typeof satir.bakimMesaji === 'string' ? satir.bakimMesaji : varsayilanSistemAyarlari.bakimMesaji,
    bakimBaslik:
      typeof satir.bakimBaslik === 'string' ? satir.bakimBaslik : varsayilanSistemAyarlari.bakimBaslik,
    bakimGorselUrl: typeof satir.bakimGorselUrl === 'string' ? satir.bakimGorselUrl : '',
    bakimTahminiSure: typeof satir.bakimTahminiSure === 'string' ? satir.bakimTahminiSure : '',
    bakimIpBeyazListe: Array.isArray(satir.bakimIpBeyazListeJson)
      ? satir.bakimIpBeyazListeJson.filter((x): x is string => typeof x === 'string')
      : [],
    logSaklamaGun:
      typeof satir.logSaklamaGun === 'number' ? satir.logSaklamaGun : varsayilanSistemAyarlari.logSaklamaGun,
    panelDili: typeof satir.panelDili === 'string' ? satir.panelDili : 'tr',
    panelCeviriler: panelCevirilerCoz(satir.panelCevirilerJson),
    sayfa404: {
      baslik: typeof satir.sayfa404Baslik === 'string' ? satir.sayfa404Baslik : varsayilan404.baslik!,
      mesaj: typeof satir.sayfa404Mesaj === 'string' ? satir.sayfa404Mesaj : varsayilan404.mesaj!,
      gorselUrl: typeof satir.sayfa404GorselUrl === 'string' ? satir.sayfa404GorselUrl : '',
      menuTipi:
        satir.sayfa404MenuTipi === 'footer' ||
        satir.sayfa404MenuTipi === 'her-ikisi' ||
        satir.sayfa404MenuTipi === 'yok'
          ? satir.sayfa404MenuTipi
          : 'ust',
      oneriSayfaId: satir.sayfa404OneriSayfaId != null ? String(satir.sayfa404OneriSayfaId) : null,
      anaSayfaButonu:
        typeof satir.sayfa404AnaSayfaButonu === 'boolean' ? satir.sayfa404AnaSayfaButonu : true,
    },
    otomatikYedekleme: typeof satir.otomatikYedekleme === 'boolean' ? satir.otomatikYedekleme : false,
    otomatikYedeklemeGun: typeof satir.otomatikYedeklemeGun === 'number' ? satir.otomatikYedeklemeGun : 7,
    guvenlikBasliklari: typeof satir.guvenlikBasliklari === 'boolean' ? satir.guvenlikBasliklari : true,
    robotsEngelle: typeof satir.robotsEngelle === 'boolean' ? satir.robotsEngelle : false,
    sagTikPaneli: sagTikPaneliCoz(
      satir.ekAyarlarJson && typeof satir.ekAyarlarJson === 'object'
        ? (satir.ekAyarlarJson as Record<string, unknown>).sagTikPaneli
        : undefined
    ),
    scriptAyarlari: scriptAyarlariEkAyarlarCoz(satir.ekAyarlarJson),
  };
}
