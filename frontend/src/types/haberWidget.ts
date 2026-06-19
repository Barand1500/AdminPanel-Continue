/** Haber / portal widget ortak tipleri */

export type SayfalamaStili = 'nokta' | 'numara' | 'ok' | 'thumbnail' | 'yok';
export type GorselKonumu = 'sol' | 'sag' | 'ust' | 'alt' | 'arkaplan';
export type KartStili = 'duz' | 'overlay' | 'yatay' | 'dikey';

export interface WidgetHaberKarti {
  id: string;
  baslik: string;
  ozet?: string;
  gorselUrl?: string;
  link?: string;
  tarih?: string;
  yorumSayisi?: number;
  etiketler?: string[];
  badge?: string;
  kartStili?: KartStili;
}

export interface WidgetKoseYazari {
  id: string;
  yazarAd: string;
  yazarGorsel?: string;
  tarih?: string;
  baslik: string;
  ozet?: string;
  link?: string;
}

export interface WidgetIletisimKarti {
  id: string;
  etiket: string;
  deger: string;
  ikon?: string;
  link?: string;
}

export interface WidgetVideoKarti {
  id: string;
  baslik: string;
  gorselUrl?: string;
  videoLink?: string;
  link?: string;
}

export interface WidgetHaberSekmesi {
  id: string;
  baslik: string;
  kartlar: WidgetHaberKarti[];
}

export interface WidgetKriptoPara {
  id: string;
  sembol: string;
  ad: string;
  fiyat: string;
  degisim: string;
  ikonUrl?: string;
}

export interface WidgetAcilisKapanisSaati {
  haftaIciAcilis: string;
  haftaIciKapanis: string;
  cumartesiAcilis: string;
  cumartesiKapanis: string;
  pazarAcilis: string;
  pazarKapanis: string;
}

export interface WidgetHavaGun {
  id: string;
  gun: string;
  durum: string;
  ikon?: string;
  max: string;
  min: string;
}

export const HABER_PORTAL_WIDGET_TIPLERI = [
  'KOSE_YAZARLARI',
  'ILETISIM_BLOK',
  'KATEGORI_HABER_LISTESI',
  'KATEGORI_HABER_OVERLAY',
  'VIDEO_GALERISI',
  'SEKMELI_HABER',
  'HAVA_DURUMU',
  'KRIPTO_LISTESI',
  'GUNCEL_KONULAR',
  'SIRKET_GIRIS_CIKIS',
  'HABER_MAGAZIN',
] as const;

export type HaberPortalWidgetTipi = (typeof HABER_PORTAL_WIDGET_TIPLERI)[number];
