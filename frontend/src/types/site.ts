export interface SiteAyarlari {
  logoUrl?: string | null;
  faviconUrl?: string | null;
  anaRenk?: string;
  ikincilRenk?: string;
  slogan?: string | null;
  font?: string;
  telefon?: string | null;
  email?: string | null;
  adres?: string | null;
  whatsapp?: string | null;
  telifYazisi?: string | null;
  sosyalMedyaJson?: Record<string, string>;
  headerAyarlariJson?: import('./header').HeaderAyarlari | null;
  heroJson?: import('./hero').HeroAyarlari | null;
  footerAyarlariJson?: import('./footer').FooterAyarlari | null;
  blogAyarlariJson?: import('./blog').BlogAyarlari | null;
  sistemAyarlariJson?: import('./sistemAyarlari').SistemAyarlariJson | null;
  temaAyarlariJson?: import('./temaAyarlari').TemaAyarlari | null;
}

export interface Widget {
  id: string;
  ad: string;
  tip: string;
  sira: number;
  aktif: boolean;
  baslik?: string | null;
  altBaslik?: string | null;
  aciklama?: string | null;
  gorselUrl?: string | null;
  butonMetni?: string | null;
  butonLink?: string | null;
  arkaPlanRenk?: string | null;
  yaziRenk?: string | null;
  mobilGoster?: boolean;
  masaustuGoster?: boolean;
  configJson?: Record<string, unknown> | null;
}

export type SayfaAcilisModu = 'normal' | 'modal' | 'yeni_sekme';
export type AltMenuGorunum = 'dikey' | 'yatay';
export type AltMenuTetikleyici = 'hover' | 'tikla';

export interface Sayfa {
  id: string;
  baslik: string;
  slug: string;
  icerik: string;
  kapakGorsel?: string | null;
  ikon?: string | null;
  menudeGoster?: boolean;
  sira?: number;
  acilisModu?: SayfaAcilisModu;
  ustSayfaId?: string | null;
  altMenuGorunum?: AltMenuGorunum;
  altMenuTetikleyici?: AltMenuTetikleyici;
}

export interface SitePublicData {
  site: {
    id: string;
    ad: string;
    slug: string;
    aktif?: boolean;
    ayarlar: SiteAyarlari | null;
  };
  sayfalar: Sayfa[];
  widgetlar: Widget[];
  bloglar: import('./blog').BlogYazisiOzet[];
  navKategoriler: import('./navKategori').NavKategoriKayit[];
}

export interface MenuOgesi {
  baslik: string;
  yol: string;
  yeniSekme?: boolean;
  acilisModu?: SayfaAcilisModu;
  icerikVar?: boolean;
  altMenuGorunum?: AltMenuGorunum;
  altMenuTetikleyici?: AltMenuTetikleyici;
  altOgeler?: MenuOgesi[];
}

export interface HizmetKarti {
  baslik: string;
  aciklama: string;
  ikon: string;
}
