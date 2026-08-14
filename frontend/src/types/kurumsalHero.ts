export type KurumsalHeroYukseklik = '70vh' | '85vh' | '100svh';

export interface KurumsalHeroButon {
  metin: string;
  link: string;
  renk?: string;
  yaziRenk?: string;
}

export interface KurumsalHeroSlayt {
  id: string;
  sira: number;
  aktif: boolean;
  arkaPlanUrl: string;
  onGorselUrl?: string;
  baslik: string;
  aciklama: string;
  birincilButon?: KurumsalHeroButon;
  ikinciButon?: KurumsalHeroButon;
}

export interface KurumsalHeroGorunum {
  yukseklik: KurumsalHeroYukseklik;
  overlayRenk: string;
  overlayOpaklik: number;
}

export interface KurumsalHeroConfig {
  gecisSuresiSn: number;
  ustBantGoster: boolean;
  headerOverlay: boolean;
  gorunum: KurumsalHeroGorunum;
  slaytlar: KurumsalHeroSlayt[];
}

export const KURUMSAL_HERO_VARSAYILAN_OVERLAY = '#1e40af';
export const KURUMSAL_HERO_VARSAYILAN_OPAKLIK = 0.72;
export const KURUMSAL_HERO_VARSAYILAN_GECIS_SN = 6;

export const KURUMSAL_HERO_YUKSEKLIKLER: { id: KurumsalHeroYukseklik; ad: string }[] = [
  { id: '70vh', ad: 'Orta (70vh)' },
  { id: '85vh', ad: 'Geniş (85vh)' },
  { id: '100svh', ad: 'Tam ekran' },
];

export function bosKurumsalHeroSlayt(sira = 0): KurumsalHeroSlayt {
  return {
    id: `kh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sira,
    aktif: true,
    arkaPlanUrl: '',
    baslik: '',
    aciklama: '',
    birincilButon: { metin: 'Şimdi Satın Al', link: '/iletisim', renk: '#38bdf8', yaziRenk: '#ffffff' },
    ikinciButon: { metin: 'İletişime Geç', link: '/iletisim' },
  };
}

export function varsayilanKurumsalHeroConfig(): KurumsalHeroConfig {
  return {
    gecisSuresiSn: KURUMSAL_HERO_VARSAYILAN_GECIS_SN,
    ustBantGoster: true,
    headerOverlay: true,
    gorunum: {
      yukseklik: '85vh',
      overlayRenk: KURUMSAL_HERO_VARSAYILAN_OVERLAY,
      overlayOpaklik: KURUMSAL_HERO_VARSAYILAN_OPAKLIK,
    },
    slaytlar: [],
  };
}

export function kurumsalHeroBirlestir(raw?: Partial<KurumsalHeroConfig> | null): KurumsalHeroConfig {
  const vars = varsayilanKurumsalHeroConfig();
  if (!raw) return vars;
  return {
    gecisSuresiSn: raw.gecisSuresiSn ?? vars.gecisSuresiSn,
    ustBantGoster: raw.ustBantGoster ?? vars.ustBantGoster,
    headerOverlay: raw.headerOverlay ?? vars.headerOverlay,
    gorunum: { ...vars.gorunum, ...raw.gorunum },
    slaytlar: Array.isArray(raw.slaytlar)
      ? [...raw.slaytlar].sort((a, b) => a.sira - b.sira)
      : vars.slaytlar,
  };
}

export function kurumsalHeroConfigOku(configJson: unknown): KurumsalHeroConfig {
  const cfg = (configJson ?? {}) as { kurumsalHero?: Partial<KurumsalHeroConfig> };
  return kurumsalHeroBirlestir(cfg.kurumsalHero);
}
