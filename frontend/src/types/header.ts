import type { LogoBoyutu } from './logo';
import { logoBoyutuNormalize } from './logo';
import { dilDestegiBirlestir } from '@/data/siteDilleri';

export type KurTipi = 'doviz_alis' | 'doviz_satis' | 'efektif_alis' | 'efektif_satis';

export const KATEGORI_ACILIS_MODLARI = ['dropdown', 'sidebar', 'liste'] as const;
export type KategoriAcilisModu = (typeof KATEGORI_ACILIS_MODLARI)[number];

export const KATEGORI_ACILIS_ETIKET: Record<KategoriAcilisModu, string> = {
  dropdown: 'Dropdown (mega menü)',
  sidebar: 'Yan panel (sidebar)',
  liste: 'Liste (kompakt)',
};

export function kategoriAcilisModuNormalize(mod?: string | null): KategoriAcilisModu {
  if (mod === 'sidebar' || mod === 'liste') return mod;
  return 'dropdown';
}

export interface IkonSecimi {
  tip: 'preset' | 'custom';
  presetId?: string;
  customUrl?: string;
}

export interface ParaBirimiKaydi {
  id: string;
  ad: string;
  kod: string;
  sembol: string;
  kaynak: 'manuel' | 'tcmb';
  kurTipi?: KurTipi;
  manuelKur?: number;
  guncelKur?: number;
  sira: number;
  sabit?: boolean;
}

export interface TemaIkonlari {
  gunduz: IkonSecimi;
  gece: IkonSecimi;
}

export interface UstMenuOgesi {
  id: string;
  ad: string;
  link: string;
  yeniSekme: boolean;
  sira: number;
  sayfaId?: string;
}

export type DilGorunumModu = 'bayrak' | 'kod';

export interface SiteDilKaydi {
  kod: string;
  ad: string;
  bayrak: string;
  aktif: boolean;
  sira: number;
}

export interface DilDestegiAyarlari {
  aktif: boolean;
  gorunum: DilGorunumModu;
  varsayilanDil: string;
  diller: SiteDilKaydi[];
  /** Dil kodu → çeviri anahtarı → metin */
  ceviriler?: Record<string, Record<string, string>>;
}

export interface HeaderAyarlari {
  slogan?: string | null;
  /** Header marka alanında görünen metin (tarayıcı sekmesi site adından bağımsız) */
  markaMetni?: string | null;
  logoUrl?: string | null;
  logoBoyutu?: LogoBoyutu;
  ustBant?: {
    telefonGoster: boolean;
    emailGoster: boolean;
    kurlarGoster: boolean;
    sosyalGoster: boolean;
  };
  kurlar?: ParaBirimiKaydi[];
  ikonlar?: {
    tema: TemaIkonlari;
    hesap: IkonSecimi;
  };
  kategori?: {
    acilisModu: KategoriAcilisModu;
    baslikMetni: string;
    /** false ise header'da Tüm Kategoriler menüsü gizlenir */
    menuGoster?: boolean;
  };
  arama?: {
    placeholder: string;
    stil: 'yuvarlak' | 'kare' | 'minimal';
    ikon: IkonSecimi;
  };
  sonKurGuncelleme?: string | null;
  ustMenu?: UstMenuOgesi[];
  dilDestegi?: DilDestegiAyarlari;
}

export const VARSAYILAN_IKON = (presetId: string): IkonSecimi => ({
  tip: 'preset',
  presetId,
});

function legacyPresetCevir(pid: string, hedef: 'gunduz' | 'gece'): string {
  if (hedef === 'gunduz') {
    if (pid === 'tema-gunes' || pid.startsWith('gunduz-')) return pid.startsWith('gunduz-') ? pid : 'gunduz-gunes';
    if (pid === 'tema-bulut') return 'gunduz-bulut';
    return 'gunduz-gunes';
  }
  if (pid === 'tema-ay' || pid.startsWith('gece-')) return pid.startsWith('gece-') ? pid : 'gece-ay';
  if (pid === 'tema-bulut') return 'gece-bulut-ay';
  return 'gece-ay';
}

export function temaIkonlariBirlestir(tema?: TemaIkonlari | IkonSecimi | null): TemaIkonlari {
  if (tema && typeof tema === 'object' && 'gunduz' in tema && 'gece' in tema) {
    return {
      gunduz: tema.gunduz ?? VARSAYILAN_IKON('gunduz-gunes'),
      gece: tema.gece ?? VARSAYILAN_IKON('gece-ay'),
    };
  }
  const legacy = tema as IkonSecimi | undefined;
  if (legacy?.tip === 'custom' && legacy.customUrl) {
    return {
      gunduz: VARSAYILAN_IKON('gunduz-gunes'),
      gece: VARSAYILAN_IKON('gece-ay'),
    };
  }
  const pid = legacy?.presetId ?? '';
  return {
    gunduz: VARSAYILAN_IKON(legacyPresetCevir(pid, 'gunduz')),
    gece: VARSAYILAN_IKON(legacyPresetCevir(pid, 'gece')),
  };
}

export function varsayilanHeaderAyarlari(
  mevcut?: Partial<HeaderAyarlari> | null,
  legacy?: { logoUrl?: string | null; slogan?: string | null }
): HeaderAyarlari {
  return {
    slogan:
      mevcut?.slogan ??
      legacy?.slogan ??
      'Teknolojinin en güzel hali — güvenli, hızlı ve uygun fiyatlı.',
    markaMetni: mevcut?.markaMetni ?? null,
    logoUrl: mevcut?.logoUrl ?? legacy?.logoUrl ?? null,
    logoBoyutu: logoBoyutuNormalize(mevcut?.logoBoyutu),
    ustBant: {
      telefonGoster: true,
      emailGoster: true,
      kurlarGoster: true,
      sosyalGoster: false,
      ...mevcut?.ustBant,
    },
    kurlar: mevcut?.kurlar ?? [
      {
        id: 'try',
        ad: 'Türk Lirası',
        kod: 'TRY',
        sembol: '₺',
        kaynak: 'manuel',
        manuelKur: 1,
        sira: 0,
        sabit: true,
      },
      {
        id: 'usd',
        ad: 'Dolar',
        kod: 'USD',
        sembol: '$',
        kaynak: 'tcmb',
        kurTipi: 'doviz_satis',
        sira: 1,
      },
      {
        id: 'eur',
        ad: 'Euro',
        kod: 'EUR',
        sembol: '€',
        kaynak: 'tcmb',
        kurTipi: 'doviz_satis',
        sira: 2,
      },
    ],
    ikonlar: {
      tema: temaIkonlariBirlestir(mevcut?.ikonlar?.tema),
      hesap: mevcut?.ikonlar?.hesap ?? VARSAYILAN_IKON('hesap-varsayilan'),
    },
    kategori: {
      acilisModu: kategoriAcilisModuNormalize(mevcut?.kategori?.acilisModu),
      baslikMetni: mevcut?.kategori?.baslikMetni ?? 'Tüm Kategoriler',
      menuGoster: mevcut?.kategori?.menuGoster ?? true,
    },
    arama: mevcut?.arama ?? {
      placeholder: 'Ürün Ara...',
      stil: 'yuvarlak',
      ikon: VARSAYILAN_IKON('arama-varsayilan'),
    },
    sonKurGuncelleme: mevcut?.sonKurGuncelleme ?? null,
    ustMenu: mevcut?.ustMenu ?? [],
    dilDestegi: dilDestegiBirlestir(mevcut?.dilDestegi),
  };
}

export function headerAyarlariBirlestir(
  ayarlar?: { headerAyarlariJson?: HeaderAyarlari | null; logoUrl?: string | null; slogan?: string | null } | null
): HeaderAyarlari {
  const json = ayarlar?.headerAyarlariJson;
  const birlestirilmis = varsayilanHeaderAyarlari(json ?? undefined, {
    logoUrl: ayarlar?.logoUrl ?? json?.logoUrl,
    slogan: ayarlar?.slogan ?? json?.slogan,
  });
  return {
    ...birlestirilmis,
    markaMetni: json?.markaMetni ?? birlestirilmis.markaMetni ?? null,
    logoUrl: json?.logoUrl ?? ayarlar?.logoUrl ?? null,
    logoBoyutu: logoBoyutuNormalize(json?.logoBoyutu ?? birlestirilmis.logoBoyutu),
  };
}

export function headerMarkaMetni(header: HeaderAyarlari): string {
  return header.markaMetni?.trim() ?? '';
}
