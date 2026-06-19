export type BlokDuzen = 'yan_yana' | 'alt_alta';

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
  | 'kart';

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
  /** Çoklu ikon satırı */
  ikonlar?: BlokIkonOgesi[];
  /** Combobox */
  comboboxEtiket?: string;
  secenekler?: string[];
  seciliSecenek?: string;
  /** Toggle */
  toggleEtiket?: string;
  toggleAcik?: boolean;
  /** Kart */
  kartBaslik?: string;
  kartMetin?: string;
  kartGorselUrl?: string;
  kartLink?: string;
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

export const BLOK_PALET: { tip: BlokTipi; etiket: string; ikon: string }[] = [
  { tip: 'baslik', etiket: 'Başlık', ikon: 'H' },
  { tip: 'metin', etiket: 'Metin', ikon: '¶' },
  { tip: 'gorsel', etiket: 'Görsel', ikon: '🖼' },
  { tip: 'kart', etiket: 'Kart', ikon: '🃏' },
  { tip: 'ikon_grup', etiket: 'İkon Grubu', ikon: '⊞' },
  { tip: 'combobox', etiket: 'Combobox', ikon: '▾' },
  { tip: 'toggle', etiket: 'Toggle', ikon: '◉' },
  { tip: 'tarih', etiket: 'Tarih', ikon: '📅' },
  { tip: 'buton', etiket: 'Buton', ikon: '🔗' },
  { tip: 'yildiz', etiket: 'Yıldız', ikon: '★' },
  { tip: 'bosluk', etiket: 'Boşluk', ikon: '↕' },
];

export function bosOlusturucu(): BlokOlusturucuConfig {
  return { parcaSayisi: 0, duzen: 'yan_yana', hucreler: [] };
}

export function olusturucuOku(cfg: { olusturucu?: BlokOlusturucuConfig | null }): BlokOlusturucuConfig {
  return cfg.olusturucu ?? bosOlusturucu();
}
