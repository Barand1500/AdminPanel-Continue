import type { CSSProperties } from 'react';
import type { WidgetFormDegeri } from '@/types/admin';
import type { Widget } from '@/types/site';
import type { BlokOlusturucuConfig } from '@/types/blokOlusturucu';
import type {
  GorselKonumu,
  KartStili,
  SayfalamaStili,
  WidgetHaberKarti,
  WidgetHaberSekmesi,
  WidgetIletisimKarti,
  WidgetKoseYazari,
  WidgetKriptoPara,
  WidgetAcilisKapanisSaati,
  WidgetVideoKarti,
  WidgetHavaGun,
} from '@/types/haberWidget';
import { HABER_PORTAL_WIDGET_TIPLERI } from '@/types/haberWidget';
import { onizlemeMockVerisiUygula, widgetFormMockUygula } from '@/utils/widgetOnizlemeMock';
import { varsayilanWidgetGorunumTipi } from '@/data/widgetGorunumTipleri';
export { widgetFormMockUygula };
export { HABER_PORTAL_WIDGET_TIPLERI };

export const DEPRECATED_WIDGET_TIPLERI = [
  'HEADER',
  'NAVBAR',
  'FOOTER',
  'URUN_LISTELEME',
  'HERO_BANNER',
] as const;

export const YENI_WIDGET_TIPLERI = [
  'BASLIK_METIN',
  'BASLIK_METIN_GORSEL',
  'BLOG_KARUSEL',
  'LINK_KARTLARI',
  'GORSEL_GRID_BLOK',
  'GORSEL_ETIKET_KARTLARI',
  'EKIP_KARUSEL',
  'SAYAC_BLOK',
  'YORUM_KARUSEL',
  'YORUM_KARTLARI',
  'FIYATLANDIRMA',
  'MODUL_LOGO_BLOK',
] as const;

export const MODERN_WIDGET_TIPLERI = [
  'ZAMAN_CIZELGESI',
  'SUREC_ADIMLARI',
  'MARKA_SERIDI',
  'KARSILASTIRMA_TABLOSU',
  'GERI_SAYIM',
  'VIDEO_BANNER',
  'ONCESI_SONRASI',
  'BULTEN_KAYIT',
  'BLOK_OLUSTURUCU',
  ...HABER_PORTAL_WIDGET_TIPLERI,
] as const;

export const AKTIF_WIDGET_TIPLERI = [
  'SLIDER',
  'HIZMET_KARTLARI',
  'KATEGORI',
  'REFERANSLAR',
  'SSS',
  'GALERI',
  'HARITA',
  'ILETISIM_FORMU',
  'POPUP',
  ...YENI_WIDGET_TIPLERI,
  ...MODERN_WIDGET_TIPLERI,
] as const;

export type AktifWidgetTipi = (typeof AKTIF_WIDGET_TIPLERI)[number];

export type Hizalama = 'sol' | 'orta' | 'sag';
export type IcerikDuzeni = 'ust' | 'alt' | 'sol' | 'sag';
export type GaleriDuzeni = 'yan_yana' | 'alt_alta' | 'grid';
export type GorselBoyutu = 'kucuk' | 'orta' | 'buyuk' | 'tam';
export type GorselKirpma = 'kapla' | 'sigdir' | 'orijinal';
export type PaddingBoyutu = 'dar' | 'normal' | 'genis';

/** normal: container-site; tam_ekran: yatayda kenardan kenara */
export type WidgetBolumGenisligi = 'normal' | 'tam_ekran';
export type BaslikBoyutu = 'sm' | 'md' | 'lg' | 'xl';
export type GirisAnimasyonu = 'yok' | 'fade' | 'slide';

export type WidgetYerlesimBolge =
  | 'header_alti'
  | 'slider_alti'
  | 'icerik_alani'
  | 'footer_ustu'
  | 'sayfa_ustu'
  | 'sayfa_alti';

export interface WidgetYerlesim {
  bolge: WidgetYerlesimBolge;
  /** Başka bir widget’a göre ince konum */
  hedefWidgetId?: string;
  konum?: 'once' | 'sonra';
}

export const WIDGET_GORUNUM_GORSEL_TIPLERI = new Set([
  'BASLIK_METIN_GORSEL',
  'GALERI',
  'SLIDER',
  'BLOG_KARUSEL',
  'GORSEL_GRID_BLOK',
  'GORSEL_ETIKET_KARTLARI',
  'EKIP_KARUSEL',
  'YORUM_KARUSEL',
  'BLOK_OLUSTURUCU',
  'YORUM_KARTLARI',
  'MODUL_LOGO_BLOK',
]);

export const WIDGET_GORUNUM_HABER_TIPLERI = new Set<string>([...HABER_PORTAL_WIDGET_TIPLERI, 'SLIDER', 'BLOG_KARUSEL', 'EKIP_KARUSEL']);

export const WIDGET_GORUNUM_GRID_TIPLERI = new Set([
  'HIZMET_KARTLARI',
  'LINK_KARTLARI',
  'GALERI',
  'KATEGORI',
  'REFERANSLAR',
  'GORSEL_GRID_BLOK',
  'GORSEL_ETIKET_KARTLARI',
  'BLOG_KARUSEL',
  'EKIP_KARUSEL',
  'SAYAC_BLOK',
  'YORUM_KARUSEL',
  'YORUM_KARTLARI',
  'FIYATLANDIRMA',
  'MODUL_LOGO_BLOK',
  'BLOK_OLUSTURUCU',
  'KARSILASTIRMA_TABLOSU',
  ...HABER_PORTAL_WIDGET_TIPLERI,
]);

export const WIDGET_GORUNUM_METIN_TIPLERI = new Set([
  'BASLIK_METIN',
  'BASLIK_METIN_GORSEL',
  'SSS',
  'ILETISIM_FORMU',
  'HIZMET_KARTLARI',
  'POPUP',
  'KARSILASTIRMA_TABLOSU',
  'BLOK_OLUSTURUCU',
  'YORUM_KARTLARI',
  'MODUL_LOGO_BLOK',
]);

export interface WidgetGorunumAyarlari {
  font?: string;
  baslikBoyutu?: BaslikBoyutu;
  baslikRengi?: string;
  metinRengi?: string;
  gorselBoyutu?: GorselBoyutu;
  gorselKirpma?: GorselKirpma;
  borderRadius?: number;
  gorselGolge?: boolean;
  kolonSayisi?: number;
  kartAraligi?: 'dar' | 'normal' | 'genis';
  padding?: PaddingBoyutu;
  hizalama?: Hizalama;
  icerikDuzeni?: IcerikDuzeni;
  noktaRengi?: string;
  ctaStil?: 'dolu' | 'cerceve' | 'hayalet';
  tabloBaslikArkaPlan?: string;
  tabloKenarRengi?: string;
  vurguRengi?: string;
  /** Slider / karusel / haber widget sayfalama */
  sayfalamaStili?: SayfalamaStili;
  /** Kartlarda görsel konumu */
  gorselKonumu?: GorselKonumu;
  /** Kart görünüm stili */
  kartStili?: KartStili;
  /** Bölüm başlığı alt çizgi */
  baslikCizgi?: boolean;
  /** Bölüm başlık ikonu (emoji) */
  baslikIkon?: string;
  /** Yorum kartları: yıldız puanı göster */
  yildizGoster?: boolean;
  /** Yorum kartları: dolu yıldız rengi */
  yildizRengi?: string;
  /** Yorum kartları: alt bilgi (yazar) arka planı */
  kartFooterArkaPlan?: string;
  /** Yorum kartları: kart gölgesi */
  kartGolge?: boolean;
  /** normal: yan boşluklu container; tam_ekran: viewport genişliği */
  bolumGenisligi?: WidgetBolumGenisligi;
  /** Widget layout varyantı (headerTipi benzeri) */
  gorunumTipi?: string;
  /** Seçilen görünüm tipine özel ek ayarlar */
  tipEk?: Record<string, unknown>;
}

export interface WidgetEkAyarlar {
  ozelSinif?: string;
  bolumId?: string;
  girisAnimasyonu?: GirisAnimasyonu;
}

export interface WidgetSlide {
  id: string;
  gorselUrl: string;
  baslik: string;
  altBaslik: string;
  butonMetni: string;
  butonLink: string;
  aktif: boolean;
}

export interface WidgetGaleriOgesi {
  id: string;
  gorselUrl: string;
  baslik: string;
  link: string;
  kategori?: string;
}

export interface WidgetKartOgesi {
  id: string;
  baslik: string;
  aciklama: string;
  ikon: string;
  link: string;
  butonMetni?: string;
  gorselUrl?: string;
}

export interface WidgetSssOgesi {
  id: string;
  soru: string;
  cevap: string;
  kategori?: string;
}

export interface WidgetLinkOgesi {
  id: string;
  metin: string;
  ikon: string;
  link: string;
}

export interface WidgetBlogKart {
  id: string;
  baslik: string;
  gorselUrl: string;
  link: string;
  butonMetni: string;
  /** Sekmeli kategori görünümü için */
  kategori?: string;
  /** Kısa özet (hero / ticker görünümleri) */
  ozet?: string;
}

export interface WidgetGorselGridKart {
  id: string;
  etiket: string;
  gorselUrl: string;
  link: string;
  /** Hangi filtre kategorisine ait (ilk filtre = tümü, boş = her yerde) */
  filtreEtiketi?: string;
  /** Flip kart arka yüz metni */
  aciklama?: string;
}

export interface WidgetEtiketKarti {
  id: string;
  etiket: string;
  gorselUrl: string;
  link: string;
}

export interface WidgetEkipUyesi {
  id: string;
  ad: string;
  unvan: string;
  gorselUrl: string;
  aciklama?: string;
  departman?: string;
  linkedin?: string;
}

export interface WidgetSayac {
  id: string;
  /** Tam sayı, ondalık (1.2) veya metin olarak saklanabilir */
  deger: number | string;
  sonEk: string;
  etiket: string;
  ikon?: string;
}

export interface WidgetYorum {
  id: string;
  metin: string;
  ad: string;
  firma: string;
  gorselUrl?: string;
  /** 1–5 yıldız puanı */
  yildiz?: number;
}

export interface WidgetFiyatOzellik {
  metin: string;
  dahil: boolean;
}

export interface WidgetFiyatPaketi {
  id: string;
  ad: string;
  fiyat: string;
  aciklama: string;
  ozellikler: WidgetFiyatOzellik[];
  butonMetni: string;
  butonLink: string;
  oneCikan: boolean;
}

export interface WidgetIkonKart {
  id: string;
  ikon: string;
  metin: string;
}

export interface WidgetHaritaSube {
  id: string;
  ad: string;
  haritaUrl?: string;
  haritaLat?: string;
  haritaLng?: string;
  haritaZoom?: number;
}

export interface WidgetTimelineOgesi {
  id: string;
  tarih: string;
  baslik: string;
  aciklama: string;
}

export interface WidgetSurecAdimi {
  id: string;
  baslik: string;
  aciklama: string;
  ikon: string;
}

export interface WidgetMarkaLogosu {
  id: string;
  ad: string;
  gorselUrl: string;
  link?: string;
  /** istatistik-kapsul varyantı için */
  deger?: string;
  sonEk?: string;
  trend?: string;
  durumEtiketi?: string;
}

export interface WidgetKarsilastirmaPaket {
  id: string;
  ad: string;
  fiyat: string;
  oneCikan: boolean;
}

export interface WidgetKarsilastirmaSatiri {
  id: string;
  ozellik: string;
  hucreler: string[];
}

export interface WidgetConfig {
  yerlesim?: WidgetYerlesim;
  gorunum?: WidgetGorunumAyarlari;
  ek?: WidgetEkAyarlar;
  slides?: WidgetSlide[];
  kartlar?: WidgetKartOgesi[];
  galeri?: WidgetGaleriOgesi[];
  galeriDuzeni?: GaleriDuzeni;
  sorular?: WidgetSssOgesi[];
  referanslar?: string[];
  linkler?: WidgetLinkOgesi[];
  blogKartlari?: WidgetBlogKart[];
  blogKaynagi?: 'manuel' | 'otomatik';
  blogAdet?: number;
  otomatikKaydir?: boolean;
  tumunuGorLink?: string;
  tumunuGorMetin?: string;
  solBaslik?: string;
  solAciklama?: string;
  filtreler?: string[];
  gridKartlar?: WidgetGorselGridKart[];
  etiketKartlar?: WidgetEtiketKarti[];
  uyeler?: WidgetEkipUyesi[];
  sayaclar?: WidgetSayac[];
  yorumlar?: WidgetYorum[];
  paketler?: WidgetFiyatPaketi[];
  ikonKartlar?: WidgetIkonKart[];
  haritaUrl?: string;
  haritaLat?: string;
  haritaLng?: string;
  haritaZoom?: number;
  haritaSubeler?: WidgetHaritaSube[];
  popupGecikme?: number;
  popupTetikleyici?: 'sayfa_yukle' | 'cikis';
  formSlug?: string;
  metin?: string;
  kategoriler?: WidgetLinkOgesi[];
  timeline?: WidgetTimelineOgesi[];
  surecAdimlari?: WidgetSurecAdimi[];
  markalar?: WidgetMarkaLogosu[];
  modulIkon?: string;
  logoKartlar?: WidgetEtiketKarti[];
  dahaFazlaMetin?: string;
  dahaFazlaLink?: string;
  markaHizi?: 'yavas' | 'normal' | 'hizli';
  karsilastirmaPaketler?: WidgetKarsilastirmaPaket[];
  karsilastirmaSatirlari?: WidgetKarsilastirmaSatiri[];
  bitisTarihi?: string;
  videoUrl?: string;
  videoTip?: 'youtube' | 'dosya';
  onceGorsel?: string;
  sonraGorsel?: string;
  bultenPlaceholder?: string;
  bultenKvkk?: string;
  haberKartlari?: WidgetHaberKarti[];
  koseYazarlari?: WidgetKoseYazari[];
  iletisimKartlari?: WidgetIletisimKarti[];
  videoKartlari?: WidgetVideoKarti[];
  haberSekmeler?: WidgetHaberSekmesi[];
  kriptoParalar?: WidgetKriptoPara[];
  acilisKapanisSaatleri?: WidgetAcilisKapanisSaati;
  sirketKonum?: string;
  sirketAnlikSaat?: string;
  kapanisaKalan?: string;
  havaSehir?: string;
  havaIlce?: string;
  havaKaynak?: 'api' | 'manuel';
  havaAnlik?: { sicaklik: string; durum: string; hissedilen: string; nem: string; ruzgar: string };
  havaGunler?: WidgetHavaGun[];
  kriptoKaynak?: 'api' | 'manuel';
  kriptoLimit?: number;
  kriptoSemboller?: string[];
  olusturucu?: BlokOlusturucuConfig;
}

export function uid() {
  return `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function configOku(form: WidgetFormDegeri): WidgetConfig {
  try {
    const parsed = JSON.parse(form.configJsonMetin || '{}') as WidgetConfig;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function configYaz(form: WidgetFormDegeri, config: WidgetConfig): WidgetFormDegeri {
  return { ...form, configJsonMetin: JSON.stringify(config, null, 2) };
}

export function configGuncelle(
  form: WidgetFormDegeri,
  guncelle: (cfg: WidgetConfig) => WidgetConfig
): WidgetFormDegeri {
  return configYaz(form, guncelle(configOku(form)));
}

export function varsayilanConfig(tip: string): WidgetConfig {
  const gorunum: WidgetGorunumAyarlari = {
    padding: 'normal',
    hizalama: 'sol',
    kolonSayisi: 3,
    kartAraligi: 'normal',
    gorselBoyutu: 'orta',
    gorselKirpma: 'kapla',
    borderRadius: 12,
    baslikBoyutu: 'lg',
    gorunumTipi: varsayilanWidgetGorunumTipi(tip),
  };
  const ek: WidgetEkAyarlar = { girisAnimasyonu: 'yok' };
  const yerlesim: WidgetYerlesim = { bolge: 'icerik_alani' };

  switch (tip) {
    case 'BASLIK_METIN':
      return { yerlesim, gorunum: { ...gorunum, icerikDuzeni: 'ust' }, ek, metin: '' };
    case 'BASLIK_METIN_GORSEL':
      return { yerlesim, gorunum: { ...gorunum, icerikDuzeni: 'sol' }, ek, metin: '', ikonKartlar: [] };
    case 'SLIDER':
      return { yerlesim: { bolge: 'slider_alti' }, gorunum: { ...gorunum, sayfalamaStili: 'numara' }, ek, slides: [] };
    case 'HIZMET_KARTLARI':
      return { yerlesim, gorunum, ek, kartlar: [] };
    case 'GALERI':
      return { yerlesim, gorunum, ek, galeri: [], galeriDuzeni: 'grid' };
    case 'SSS':
      return { yerlesim, gorunum, ek, sorular: [] };
    case 'REFERANSLAR':
      return { yerlesim, gorunum, ek, referanslar: [] };
    case 'BLOG_KARUSEL':
      return {
        yerlesim,
        gorunum,
        ek,
        blogKartlari: [],
        filtreler: [],
        blogKaynagi: 'manuel',
        blogAdet: 3,
        otomatikKaydir: false,
        tumunuGorMetin: 'Tümünü Gör',
        tumunuGorLink: '/blog',
      };
    case 'LINK_KARTLARI':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 5 }, ek, linkler: [] };
    case 'GORSEL_GRID_BLOK':
      return {
        yerlesim,
        gorunum: { ...gorunum, kolonSayisi: 4 },
        ek,
        solBaslik: '',
        solAciklama: '',
        filtreler: [],
        gridKartlar: [],
      };
    case 'HARITA':
      return { yerlesim: { bolge: 'footer_ustu' }, gorunum, ek, haritaZoom: 14 };
    case 'ILETISIM_FORMU':
      return { yerlesim: { bolge: 'footer_ustu' }, gorunum, ek };
    case 'POPUP':
      return { yerlesim: { bolge: 'footer_ustu' }, gorunum, ek, popupGecikme: 3, popupTetikleyici: 'sayfa_yukle' };
    case 'KATEGORI':
      return { yerlesim, gorunum, ek, kategoriler: [] };
    case 'GORSEL_ETIKET_KARTLARI':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 3 }, ek, etiketKartlar: [] };
    case 'EKIP_KARUSEL':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 4 }, ek, uyeler: [], filtreler: [], otomatikKaydir: true };
    case 'SAYAC_BLOK':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 4 }, ek, sayaclar: [] };
    case 'YORUM_KARUSEL':
      return { yerlesim, gorunum, ek, yorumlar: [], otomatikKaydir: true };
    case 'YORUM_KARTLARI':
      return {
        yerlesim,
        gorunum: {
          ...gorunum,
          kolonSayisi: 3,
          yildizGoster: true,
          yildizRengi: '#facc15',
          kartFooterArkaPlan: '#f1f5f9',
          kartGolge: true,
          borderRadius: 12,
        },
        ek,
        yorumlar: [],
      };
    case 'FIYATLANDIRMA':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 3 }, ek, paketler: [] };
    case 'MODUL_LOGO_BLOK':
      return {
        yerlesim,
        gorunum: { ...gorunum, kolonSayisi: 4, icerikDuzeni: 'sol' },
        ek,
        modulIkon: '💳',
        ikonKartlar: [],
        logoKartlar: [],
        dahaFazlaMetin: '+ Daha Fazlası',
        dahaFazlaLink: '',
      };
    case 'ZAMAN_CIZELGESI':
      return { yerlesim, gorunum, ek, timeline: [] };
    case 'SUREC_ADIMLARI':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 4 }, ek, surecAdimlari: [] };
    case 'MARKA_SERIDI':
      return { yerlesim, gorunum, ek, markalar: [], markaHizi: 'normal' };
    case 'KARSILASTIRMA_TABLOSU':
      return { yerlesim, gorunum, ek, karsilastirmaPaketler: [], karsilastirmaSatirlari: [] };
    case 'GERI_SAYIM':
      return { yerlesim, gorunum, ek, bitisTarihi: '' };
    case 'VIDEO_BANNER':
      return { yerlesim: { bolge: 'slider_alti' }, gorunum, ek, videoUrl: '', videoTip: 'youtube' };
    case 'ONCESI_SONRASI':
      return { yerlesim, gorunum, ek, onceGorsel: '', sonraGorsel: '' };
    case 'BULTEN_KAYIT':
      return { yerlesim: { bolge: 'footer_ustu' }, gorunum, ek, formSlug: 'bulten', bultenPlaceholder: 'E-posta adresiniz' };
    case 'KOSE_YAZARLARI':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 4, gorselKonumu: 'sol', sayfalamaStili: 'ok' }, ek, koseYazarlari: [], tumunuGorMetin: 'Tüm Yazarlar', tumunuGorLink: '/yazarlar' };
    case 'ILETISIM_BLOK':
      return { yerlesim: { bolge: 'footer_ustu' }, gorunum: { ...gorunum, icerikDuzeni: 'sag' }, ek, iletisimKartlari: [], haritaZoom: 14 };
    case 'KATEGORI_HABER_LISTESI':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 2, gorselKonumu: 'sol', kartStili: 'yatay' }, ek, haberKartlari: [], tumunuGorMetin: '+ Tümünü Görüntüle', tumunuGorLink: '#' };
    case 'KATEGORI_HABER_OVERLAY':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 3, kartStili: 'overlay' }, ek, haberKartlari: [], tumunuGorMetin: '+ Tümünü Görüntüle', tumunuGorLink: '#' };
    case 'VIDEO_GALERISI':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 4, sayfalamaStili: 'ok' }, ek, videoKartlari: [], tumunuGorMetin: '+ Tümünü Görüntüle', tumunuGorLink: '#' };
    case 'SEKMELI_HABER':
      return { yerlesim, gorunum, ek, haberSekmeler: [] };
    case 'HAVA_DURUMU':
      return { yerlesim, gorunum, ek, havaSehir: 'İstanbul', havaIlce: 'Kadıköy', havaKaynak: 'api' };
    case 'KRIPTO_LISTESI':
      return {
        yerlesim,
        gorunum: { ...gorunum, vurguRengi: '#dc2626' },
        ek,
        kriptoKaynak: 'api',
        kriptoLimit: 10,
        kriptoParalar: [],
        tumunuGorMetin: 'Tümünü Göster →',
        tumunuGorLink: '#',
      };
    case 'GUNCEL_KONULAR':
      return { yerlesim, gorunum: { ...gorunum, vurguRengi: '#dc2626' }, ek, haberKartlari: [] };
    case 'SIRKET_GIRIS_CIKIS':
      return {
        yerlesim,
        gorunum: { ...gorunum, vurguRengi: '#2563eb' },
        ek,
        sirketKonum: 'Merkez Ofis — İstanbul',
        sirketAnlikSaat: '09:50:28',
        kapanisaKalan: '08:09:32',
        acilisKapanisSaatleri: {
          haftaIciAcilis: '09:00',
          haftaIciKapanis: '18:00',
          cumartesiAcilis: '09:00',
          cumartesiKapanis: '13:00',
          pazarAcilis: 'Kapalı',
          pazarKapanis: 'Kapalı',
        },
      };
    case 'HABER_MAGAZIN':
      return { yerlesim, gorunum: { ...gorunum, kolonSayisi: 3 }, ek, haberKartlari: [], tumunuGorMetin: '+ Tümünü Görüntüle', tumunuGorLink: '#' };
    case 'BLOK_OLUSTURUCU':
      return {
        yerlesim,
        gorunum: { ...gorunum, kolonSayisi: 2, padding: 'normal', borderRadius: 12 },
        ek,
        olusturucu: { parcaSayisi: 0, duzen: 'yan_yana', parcaGorunum: 'birlesik', hucreler: [] },
      };
    default:
      return { yerlesim, gorunum, ek };
  }
}

export function formToWidgetOnizleme(form: WidgetFormDegeri, id = 'onizleme', mockKullan = true): Widget {
  let configJson: Record<string, unknown> | null = null;
  try {
    configJson = JSON.parse(form.configJsonMetin || '{}') as Record<string, unknown>;
  } catch {
    configJson = {};
  }
  const widget: Widget = {
    id,
    ad: form.ad || 'Önizleme',
    tip: form.tip,
    sira: form.sira,
    aktif: true,
    baslik: form.baslik || null,
    altBaslik: form.altBaslik || null,
    aciklama: form.aciklama || null,
    gorselUrl: form.gorselUrl || null,
    butonMetni: form.butonMetni || null,
    butonLink: form.butonLink || null,
    arkaPlanRenk: form.arkaPlanRenk || null,
    yaziRenk: form.yaziRenk || null,
    mobilGoster: form.mobilGoster,
    masaustuGoster: form.masaustuGoster,
    configJson,
  };
  return mockKullan ? onizlemeMockVerisiUygula(widget) : widget;
}

export function widgetGorunumStili(
  widget: Widget & { arkaPlanRenk?: string | null; yaziRenk?: string | null },
  cfg: WidgetConfig
): CSSProperties {
  const g = cfg.gorunum ?? {};
  const paddingMap = { dar: '2rem 0', normal: '4rem 0', genis: '6rem 0' };
  return {
    backgroundColor: widget.arkaPlanRenk || undefined,
    color: widget.yaziRenk || g.metinRengi || undefined,
    padding: paddingMap[g.padding ?? 'normal'],
    fontFamily: g.font || undefined,
    ['--widget-baslik-renk' as string]: g.baslikRengi || widget.yaziRenk || undefined,
    ['--widget-kolon' as string]: String(g.kolonSayisi ?? 3),
  };
}

export function widgetTamEkranMi(cfg: WidgetConfig): boolean {
  return cfg.gorunum?.bolumGenisligi === 'tam_ekran';
}
