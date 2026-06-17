export type GunduzSablonId = 'mor' | 'mavi' | 'yesil' | 'ozel';
export type GeceSablonId = 'midnight' | 'slate' | 'carbon';

export interface TemaAyarlari {
  gunduzSablon: GunduzSablonId;
  geceSablon: GeceSablonId;
}

export interface SiteTemaPaleti {
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  footerBg: string;
  footerText: string;
}

export interface GunduzSablonTanimi {
  id: Exclude<GunduzSablonId, 'ozel'>;
  ad: string;
  anaRenk: string;
  ikincilRenk: string;
}

export interface GeceSablonTanimi {
  id: GeceSablonId;
  ad: string;
  palet: SiteTemaPaleti;
}

export const VARSAYILAN_TEMA_AYARLARI: TemaAyarlari = {
  gunduzSablon: 'mor',
  geceSablon: 'midnight',
};

export const GUNDUZ_SABLONLARI: GunduzSablonTanimi[] = [
  { id: 'mor', ad: 'Mor', anaRenk: '#7c3aed', ikincilRenk: '#a78bfa' },
  { id: 'mavi', ad: 'Mavi', anaRenk: '#2563eb', ikincilRenk: '#60a5fa' },
  { id: 'yesil', ad: 'Yeşil', anaRenk: '#059669', ikincilRenk: '#34d399' },
];

export const GECE_SABLONLARI: GeceSablonTanimi[] = [
  {
    id: 'midnight',
    ad: 'Midnight',
    palet: {
      surface: '#0f172a',
      surfaceElevated: '#1e293b',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      primary: '#818cf8',
      primaryDark: '#6366f1',
      primaryLight: '#a5b4fc',
      accent: '#818cf822',
      footerBg: '#0f172a',
      footerText: '#94a3b8',
    },
  },
  {
    id: 'slate',
    ad: 'Slate',
    palet: {
      surface: '#111827',
      surfaceElevated: '#1f2937',
      text: '#e5e7eb',
      textMuted: '#9ca3af',
      border: '#374151',
      primary: '#a78bfa',
      primaryDark: '#8b5cf6',
      primaryLight: '#c4b5fd',
      accent: '#a78bfa22',
      footerBg: '#111827',
      footerText: '#9ca3af',
    },
  },
  {
    id: 'carbon',
    ad: 'Carbon',
    palet: {
      surface: '#0a0a0a',
      surfaceElevated: '#171717',
      text: '#fafafa',
      textMuted: '#a3a3a3',
      border: '#262626',
      primary: '#34d399',
      primaryDark: '#10b981',
      primaryLight: '#6ee7b7',
      accent: '#34d39922',
      footerBg: '#0a0a0a',
      footerText: '#a3a3a3',
    },
  },
];

export function temaAyarlariBirlestir(
  kaynak?: TemaAyarlari | null | Record<string, unknown>
): TemaAyarlari {
  const g = kaynak as TemaAyarlari | undefined;
  const gunduz = g?.gunduzSablon;
  const gece = g?.geceSablon;
  return {
    gunduzSablon:
      gunduz === 'mor' || gunduz === 'mavi' || gunduz === 'yesil' || gunduz === 'ozel'
        ? gunduz
        : VARSAYILAN_TEMA_AYARLARI.gunduzSablon,
    geceSablon:
      gece === 'midnight' || gece === 'slate' || gece === 'carbon'
        ? gece
        : VARSAYILAN_TEMA_AYARLARI.geceSablon,
  };
}

export function geceSablonPalet(id: GeceSablonId): SiteTemaPaleti {
  return GECE_SABLONLARI.find((s) => s.id === id)?.palet ?? GECE_SABLONLARI[0].palet;
}
