import type { CSSProperties } from 'react';

export type BlokDuzen = 'yan_yana' | 'alt_alta';

export type BlokGorselGenislik = 'tam' | 'yari' | 'uc_ceyrek';

export type BlokTipi =
  | 'baslik'
  | 'metin'
  | 'gorsel'
  | 'tarih'
  | 'buton'
  | 'bosluk'
  | 'yildiz'
  | 'ikon_grup'
  | 'combobox'
  | 'toggle'
  | 'kart'
  | 'video'
  | 'sayac'
  | 'fiyat'
  | 'yorum_tek'
  | 'link_satir'
  | 'badge'
  | 'ayirici'
  | 'liste'
  | 'cta_serit';

export type BlokPaletKategori = 'metin' | 'medya' | 'kart' | 'etkilesim' | 'istatistik' | 'duzen';

export interface BlokIkonOgesi {
  id: string;
  ikon: string;
  etiket: string;
}

export interface WidgetBlok {
  id: string;
  tip: BlokTipi;
  metin?: string;
  gorselUrl?: string;
  tarih?: string;
  butonMetni?: string;
  butonLink?: string;
  yildiz?: number;
  boslukPx?: number;
  gorselYukseklikPx?: number;
  gorselGenislik?: BlokGorselGenislik;
  /** Sürükleme ile ayarlanan px genişlik; yoksa gorselGenislik yüzdesi kullanılır */
  blokGenislikPx?: number;
  ikonlar?: BlokIkonOgesi[];
  comboboxEtiket?: string;
  secenekler?: string[];
  seciliSecenek?: string;
  toggleEtiket?: string;
  toggleAcik?: boolean;
  kartBaslik?: string;
  kartMetin?: string;
  kartGorselUrl?: string;
  kartLink?: string;
  videoUrl?: string;
  videoKapakUrl?: string;
  sayacDeger?: number;
  sayacSonEk?: string;
  sayacEtiket?: string;
  fiyatMetin?: string;
  paketAd?: string;
  ozellikler?: string[];
  yorumMetin?: string;
  yorumAd?: string;
  yorumFirma?: string;
  linkIkon?: string;
  linkMetin?: string;
  linkUrl?: string;
  badgeMetin?: string;
  listeSatirlari?: string[];
  ctaMetin?: string;
}

export interface BlokHucre {
  id: string;
  bloklar: WidgetBlok[];
}

export interface BlokOlusturucuConfig {
  parcaSayisi: 0 | 1 | 2 | 3 | 4;
  duzen: BlokDuzen;
  hucreler: BlokHucre[];
}

export interface BlokPaletOgesi {
  tip: BlokTipi;
  etiket: string;
  ikon: string;
  kategori: BlokPaletKategori;
}

export const BLOK_PALET_KATEGORILERI: { id: BlokPaletKategori; etiket: string }[] = [
  { id: 'metin', etiket: 'Metin' },
  { id: 'medya', etiket: 'Medya' },
  { id: 'kart', etiket: 'Kart' },
  { id: 'etkilesim', etiket: 'Etkileşim' },
  { id: 'istatistik', etiket: 'İstatistik' },
  { id: 'duzen', etiket: 'Düzen' },
];

export const BLOK_PALET: BlokPaletOgesi[] = [
  { tip: 'baslik', etiket: 'Başlık', ikon: 'H', kategori: 'metin' },
  { tip: 'metin', etiket: 'Metin', ikon: '¶', kategori: 'metin' },
  { tip: 'tarih', etiket: 'Tarih', ikon: '📅', kategori: 'metin' },
  { tip: 'badge', etiket: 'Rozet', ikon: '🏷', kategori: 'metin' },
  { tip: 'liste', etiket: 'Liste', ikon: '☰', kategori: 'metin' },
  { tip: 'gorsel', etiket: 'Görsel', ikon: '🖼', kategori: 'medya' },
  { tip: 'video', etiket: 'Video', ikon: '▶', kategori: 'medya' },
  { tip: 'kart', etiket: 'Kart', ikon: '🃏', kategori: 'kart' },
  { tip: 'yorum_tek', etiket: 'Yorum', ikon: '💬', kategori: 'kart' },
  { tip: 'buton', etiket: 'Buton', ikon: '🔗', kategori: 'etkilesim' },
  { tip: 'combobox', etiket: 'Combobox', ikon: '▾', kategori: 'etkilesim' },
  { tip: 'toggle', etiket: 'Toggle', ikon: '◉', kategori: 'etkilesim' },
  { tip: 'link_satir', etiket: 'Link Satırı', ikon: '↗', kategori: 'etkilesim' },
  { tip: 'cta_serit', etiket: 'CTA Şerit', ikon: '📢', kategori: 'etkilesim' },
  { tip: 'sayac', etiket: 'Sayaç', ikon: '#', kategori: 'istatistik' },
  { tip: 'fiyat', etiket: 'Fiyat', ikon: '₺', kategori: 'istatistik' },
  { tip: 'yildiz', etiket: 'Yıldız', ikon: '★', kategori: 'istatistik' },
  { tip: 'ikon_grup', etiket: 'İkon Grubu', ikon: '⊞', kategori: 'duzen' },
  { tip: 'bosluk', etiket: 'Boşluk', ikon: '↕', kategori: 'duzen' },
  { tip: 'ayirici', etiket: 'Ayırıcı', ikon: '—', kategori: 'duzen' },
];

export const VARSAYILAN_GORSEL_YUKSEKLIK = 160;

export function bosOlusturucu(): BlokOlusturucuConfig {
  return { parcaSayisi: 0, duzen: 'yan_yana', hucreler: [] };
}

export function olusturucuOku(cfg: { olusturucu?: BlokOlusturucuConfig | null }): BlokOlusturucuConfig {
  return cfg.olusturucu ?? bosOlusturucu();
}

const GENISLIK_YUZDE: Record<BlokGorselGenislik, string> = {
  tam: '100%',
  yari: '50%',
  uc_ceyrek: '75%',
};

export function blokMinYukseklik(tip: BlokTipi): number {
  return tip === 'gorsel' || tip === 'kart' || tip === 'video' ? 80 : 32;
}

export function blokOnizlemeWrapperStili(
  blok: Pick<WidgetBlok, 'blokGenislikPx' | 'gorselGenislik' | 'gorselYukseklikPx'>
): CSSProperties {
  const width =
    blok.blokGenislikPx != null ? `${blok.blokGenislikPx}px` : GENISLIK_YUZDE[blok.gorselGenislik ?? 'tam'];
  const style: CSSProperties = { width, maxWidth: '100%' };
  if (blok.gorselYukseklikPx != null) {
    style.minHeight = blok.gorselYukseklikPx;
    style.height = blok.gorselYukseklikPx;
    style.overflow = 'hidden';
  }
  return style;
}

export function blokOnizlemeMedyaStili(
  blok: Pick<WidgetBlok, 'gorselYukseklikPx' | 'gorselGenislik' | 'blokGenislikPx'>
) {
  return {
    height: blok.gorselYukseklikPx ?? VARSAYILAN_GORSEL_YUKSEKLIK,
    width: '100%',
    maxWidth: '100%',
    objectFit: 'cover' as const,
  };
}

/** @deprecated blokOnizlemeMedyaStili kullanın */
export function blokGorselBoyutStili(
  blok: Pick<WidgetBlok, 'gorselYukseklikPx' | 'gorselGenislik' | 'blokGenislikPx'>
) {
  const width =
    blok.blokGenislikPx != null ? `${blok.blokGenislikPx}px` : GENISLIK_YUZDE[blok.gorselGenislik ?? 'tam'];
  return {
    height: blok.gorselYukseklikPx ?? VARSAYILAN_GORSEL_YUKSEKLIK,
    width,
    maxWidth: '100%',
    objectFit: 'cover' as const,
  };
}
