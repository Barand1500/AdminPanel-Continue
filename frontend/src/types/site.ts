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

export interface Sayfa {
  id: string;
  baslik: string;
  slug: string;
  icerik: string;
  kapakGorsel?: string | null;
  menudeGoster?: boolean;
  sira?: number;
  acilisModu?: SayfaAcilisModu;
}

export interface Urun {
  id: string;
  ad: string;
  slug: string;
  aciklama?: string | null;
  fiyat: number;
  paraBirimi: string;
  gorselUrl?: string | null;
  kategori?: string | null;
  yeni: boolean;
  cokSatan: boolean;
  stokta: boolean;
  aktif?: boolean;
  sira: number;
}

export interface SitePublicData {
  site: {
    id: string;
    ad: string;
    slug: string;
    ayarlar: SiteAyarlari | null;
  };
  sayfalar: Sayfa[];
  widgetlar: Widget[];
  urunler: Urun[];
  bloglar: import('./blog').BlogYazisiOzet[];
}

export interface MenuOgesi {
  baslik: string;
  yol: string;
  yeniSekme?: boolean;
  acilisModu?: SayfaAcilisModu;
}

export interface HizmetKarti {
  baslik: string;
  aciklama: string;
  ikon: string;
}
