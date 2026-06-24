import type { WidgetYerlesimBolge } from './widget';

export type KonumluSliderYon = 'yatay' | 'dikey';

export type KonumluSliderKonumTipi =
  | 'widget-sol'
  | 'widget-sag'
  | 'widget-ustu'
  | 'widget-alti'
  | 'header-ustu'
  | 'header-alti'
  | 'footer-ustu'
  | 'footer-alti';

export type KonumluSliderBolge = WidgetYerlesimBolge | 'header' | 'footer';

export type KonumluSliderBosluk = 'kucuk' | 'orta' | 'buyuk';

export type KonumluSliderZIndex = 'ust' | 'alt';

export type KonumluSliderGorselKirpma = 'kapla' | 'sigdir' | 'orijinal';

export type KonumluSliderButonKonumu =
  | 'sol-alt'
  | 'sag-alt'
  | 'orta-alt'
  | 'sol-ust'
  | 'sag-ust'
  | 'orta-ust';

export interface KonumluSliderSlayt {
  id: string;
  gorselUrl: string;
  baslik?: string;
  altBaslik?: string;
  butonMetni?: string;
  butonLink?: string;
  sira: number;
  aktif: boolean;
}

export interface KonumluSliderGorunum {
  borderRadius: number;
  arkaplanTransparan: boolean;
  arkaplanRengi?: string;
  zIndex: KonumluSliderZIndex;
  gorselKirpma: KonumluSliderGorselKirpma;
  butonGoster: boolean;
  butonKonumu: KonumluSliderButonKonumu;
}

export interface KonumluSliderYerlesim {
  tip: KonumluSliderKonumTipi;
  bolge: KonumluSliderBolge;
  hedefWidgetIds: string[];
}

export interface KonumluSliderConfig {
  yon: KonumluSliderYon;
  yerlesim: KonumluSliderYerlesim;
  bosluk?: KonumluSliderBosluk;
  gorunum: KonumluSliderGorunum;
  slaytlar: KonumluSliderSlayt[];
}

export interface KonumluSliderKayit {
  id: string;
  siteId: string;
  sayfaId: string | null;
  ad: string;
  aktif: boolean;
  sira: number;
  configJson: KonumluSliderConfig | null;
  olusturma?: string;
  guncelleme?: string;
}

export interface KonumluSliderFormDegeri {
  ad: string;
  sayfaId: string;
  aktif: boolean;
  sira: number;
  configJson: KonumluSliderConfig;
}

export function varsayilanKonumluSliderConfig(): KonumluSliderConfig {
  return {
    yon: 'dikey',
    yerlesim: {
      tip: 'widget-sol',
      bolge: 'sayfa_ustu',
      hedefWidgetIds: [],
    },
    gorunum: {
      borderRadius: 12,
      arkaplanTransparan: true,
      zIndex: 'alt',
      gorselKirpma: 'kapla',
      butonGoster: false,
      butonKonumu: 'orta-alt',
    },
    slaytlar: [],
  };
}

export function konumluSliderConfigOku(json: unknown): KonumluSliderConfig {
  const v = varsayilanKonumluSliderConfig();
  if (!json || typeof json !== 'object') return v;
  const o = json as Partial<KonumluSliderConfig>;
  return {
    yon: o.yon === 'yatay' ? 'yatay' : 'dikey',
    yerlesim: {
      tip: (o.yerlesim?.tip as KonumluSliderKonumTipi) ?? v.yerlesim.tip,
      bolge: (o.yerlesim?.bolge as KonumluSliderBolge) ?? v.yerlesim.bolge,
      hedefWidgetIds: Array.isArray(o.yerlesim?.hedefWidgetIds)
        ? o.yerlesim!.hedefWidgetIds.map(String)
        : [],
    },
    bosluk: o.bosluk,
    gorunum: { ...v.gorunum, ...(o.gorunum ?? {}) },
    slaytlar: Array.isArray(o.slaytlar) ? o.slaytlar : [],
  };
}

export const KONUMLU_SLIDER_KONUM_ETIKET: Record<KonumluSliderKonumTipi, string> = {
  'widget-sol': 'Widget solu',
  'widget-sag': 'Widget sağı',
  'widget-ustu': 'Widget üstü',
  'widget-alti': 'Widget altı',
  'header-ustu': 'Header üstü',
  'header-alti': 'Header altı',
  'footer-ustu': 'Footer üstü',
  'footer-alti': 'Footer altı',
};

export const KONUMLU_SLIDER_BOSLUK_ETIKET: Record<KonumluSliderBosluk, string> = {
  kucuk: 'Küçük boşluk',
  orta: 'Orta boşluk',
  buyuk: 'Büyük boşluk',
};
