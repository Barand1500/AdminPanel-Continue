import { widgetGorunumTipiNormalize } from '@/data/widgetGorunumTipleri';

/** Admin içerik sekmesinde görünüm tipine göre gösterilecek alanlar */
export type WidgetIcerikAlanId =
  | 'baslik'
  | 'altBaslik'
  | 'aciklama'
  | 'butonMetni'
  | 'butonLink'
  | 'solBaslik'
  | 'solAciklama'
  | 'filtreler'
  | 'modulIkon'
  | 'dahaFazla'
  | 'tumunuGor'
  | 'heroBannerMetin';

type WidgetIcerikAlanHaritasi = Record<string, WidgetIcerikAlanId[] | undefined> & {
  _varsayilan?: WidgetIcerikAlanId[];
};

/**
 * Widget tipi → görünüm tipi → gerekli içerik alanları.
 * _varsayilan: görünüm seçilmemiş veya eşleşme yoksa.
 */
export const WIDGET_GORUNUM_ICERIK_ALANLARI: Record<string, WidgetIcerikAlanHaritasi> = {
  GORSEL_GRID_BLOK: {
    _varsayilan: ['solBaslik', 'solAciklama'],
    'bento-grid': ['baslik', 'altBaslik', 'solBaslik', 'solAciklama', 'filtreler'],
    'snap-serit': ['solBaslik', 'solAciklama', 'filtreler'],
    'hover-zoom': ['baslik', 'aciklama'],
    'sekmeli-panel': ['baslik', 'solBaslik', 'solAciklama', 'filtreler'],
    'hero-banner-grid': ['baslik', 'altBaslik', 'aciklama', 'heroBannerMetin'],
    'flip-kart': ['baslik', 'aciklama'],
    'sol-panel': ['solBaslik', 'solAciklama', 'filtreler'],
  },
  SLIDER: {
    _varsayilan: ['baslik'],
    'split-ozellik-vitrin': ['baslik', 'aciklama', 'filtreler'],
    'cam-hero-beyaz': ['baslik', 'altBaslik', 'aciklama'],
    'orbit-merkez': ['baslik', 'altBaslik'],
    'badge-modern': ['baslik', 'aciklama', 'filtreler'],
    'sinematik-acik': ['baslik', 'aciklama'],
    'gradient-split': ['baslik', 'altBaslik', 'aciklama', 'heroBannerMetin'],
  },
  BLOG_KARUSEL: {
    _varsayilan: ['baslik', 'tumunuGor'],
    'snap-serit': ['baslik', 'tumunuGor'],
    'hero-mini-grid': ['baslik', 'tumunuGor'],
    'sekmeli-kategori': ['baslik', 'filtreler', 'tumunuGor'],
    'overlay-sinematik': ['baslik', 'tumunuGor'],
    'ticker-hero': ['baslik', 'tumunuGor'],
  },
  EKIP_KARUSEL: {
    _varsayilan: ['baslik', 'altBaslik'],
    'hero-merkez': ['baslik', 'altBaslik'],
    'sekmeli-departman': ['baslik', 'altBaslik', 'filtreler'],
    'orbit-duzen': ['baslik', 'altBaslik'],
    'marquee-spotlight': ['baslik', 'altBaslik'],
  },
  MODUL_LOGO_BLOK: {
    _varsayilan: ['baslik', 'aciklama', 'modulIkon', 'butonMetni', 'butonLink', 'dahaFazla'],
  },
  HIZMET_KARTLARI: {
    _varsayilan: ['baslik', 'aciklama'],
    'sinematik-hero': ['baslik', 'altBaslik', 'aciklama'],
    'hero-mini-grid': ['baslik', 'aciklama'],
  },
  FIYATLANDIRMA: {
    _varsayilan: ['baslik', 'altBaslik'],
  },
  YORUM_KARTLARI: {
    _varsayilan: ['baslik', 'altBaslik'],
  },
  GALERI: {
    _varsayilan: ['baslik'],
    'snap-yatay-serit': ['baslik', 'altBaslik'],
    'hero-vitrin': ['baslik', 'heroBannerMetin'],
    'lightbox-odak': ['baslik'],
    'sekmeli-kategori': ['baslik', 'filtreler'],
    'hover-zoom-etiket': ['baslik', 'aciklama'],
    'karusel-merkez': ['baslik', 'altBaslik'],
  },
  HARITA: {
    _varsayilan: ['baslik'],
    'split-sol-bilgi': ['baslik', 'aciklama', 'butonMetni', 'butonLink'],
    'split-ters': ['baslik', 'aciklama', 'butonMetni', 'butonLink'],
    'ust-bant-alt': ['baslik', 'altBaslik', 'aciklama'],
    'yan-ikon-liste': ['baslik', 'aciklama'],
    'kompakt-kart': ['baslik', 'butonMetni', 'butonLink'],
    'sekme-subeler': ['baslik', 'aciklama'],
  },
  SSS: {
    _varsayilan: ['baslik'],
    'iki-kolon-grid': ['baslik', 'altBaslik'],
    'sekmeli-kategori': ['baslik', 'filtreler'],
    'arama-filtre': ['baslik', 'aciklama'],
    'tek-acik-odak': ['baslik'],
    'kart-destesi': ['baslik', 'aciklama'],
    'yan-menu-icerik': ['baslik', 'solBaslik'],
  },
  POPUP: {
    _varsayilan: ['baslik', 'aciklama', 'butonMetni', 'butonLink'],
  },
  KARSILASTIRMA_TABLOSU: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama'],
  },
  LINK_KARTLARI: {
    _varsayilan: ['baslik'],
    'sidebar-nav': ['baslik', 'aciklama'],
  },
  GORSEL_ETIKET_KARTLARI: {
    _varsayilan: ['baslik'],
    'split-panel': ['baslik', 'aciklama'],
  },
  BASLIK_METIN_GORSEL: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama', 'butonMetni', 'butonLink'],
  },
  SITE_HAKKINDA: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama', 'butonMetni', 'butonLink'],
  },
  MARKA_SERIDI: {
    _varsayilan: ['baslik', 'altBaslik'],
  },
  SAYAC_BLOK: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama'],
  },
  ZAMAN_CIZELGESI: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama'],
  },
  SUREC_ADIMLARI: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama'],
  },
  VIDEO_BANNER: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama', 'butonMetni', 'butonLink'],
  },
  GERI_SAYIM: {
    _varsayilan: ['baslik', 'aciklama', 'butonMetni', 'butonLink'],
  },
  BULTEN_KAYIT: {
    _varsayilan: ['baslik', 'aciklama'],
  },
  UCRETSIZ_DENEME: {
    _varsayilan: ['baslik', 'aciklama', 'butonMetni'],
    'split-form-sol': ['baslik', 'aciklama', 'butonMetni'],
    'split-form-ters': ['baslik', 'aciklama', 'butonMetni'],
    'dikey-ortali': ['baslik', 'aciklama', 'butonMetni'],
    'minimal-ortali': ['baslik', 'aciklama', 'butonMetni'],
    'blob-arkaplan': ['baslik', 'aciklama', 'butonMetni'],
    'kart-golge': ['baslik', 'aciklama', 'butonMetni'],
  },
  ONCESI_SONRASI: {
    _varsayilan: ['baslik'],
    'surukle-slider': ['baslik'],
    'yan-yana-split': ['baslik', 'altBaslik'],
    'ust-alt-dizilim': ['baslik', 'aciklama'],
    'toggle-gecis': ['baslik'],
    'tam-genis-band': ['baslik', 'altBaslik', 'aciklama'],
    'cerceveli-ikili': ['baslik', 'aciklama'],
  },
  ILETISIM_BLOK: {
    _varsayilan: ['baslik', 'altBaslik', 'aciklama'],
    'split-kart-harita': ['baslik', 'altBaslik', 'aciklama'],
    'harita-ust-kart-alt': ['baslik', 'aciklama'],
    'overlay-yuzen-kart': ['baslik', 'altBaslik', 'aciklama', 'butonMetni', 'butonLink'],
    'ikon-serit-harita': ['baslik', 'altBaslik'],
    'cam-panel-harita': ['baslik', 'altBaslik', 'aciklama', 'butonMetni', 'butonLink'],
    'sidebar-liste-harita': ['baslik', 'aciklama'],
  },
  KATEGORI_HABER_LISTESI: {
    _varsayilan: ['baslik', 'tumunuGor'],
    'hero-alt-liste': ['baslik', 'altBaslik', 'tumunuGor', 'heroBannerMetin'],
    'magazin-asimetrik': ['baslik', 'tumunuGor'],
    'snap-yatay-serit': ['baslik', 'tumunuGor'],
    'numarali-haber': ['baslik', 'altBaslik', 'tumunuGor'],
    'timeline-tarih': ['baslik', 'aciklama', 'tumunuGor'],
    'karusel-sayfali': ['baslik', 'tumunuGor'],
  },
  SEKMELI_HABER: {
    _varsayilan: ['baslik'],
    'pill-sekmeli': ['baslik', 'tumunuGor'],
    'dikey-sekme-panel': ['baslik', 'solBaslik', 'solAciklama'],
    'grid-kart-sekme': ['baslik', 'tumunuGor'],
    'hero-liste-sekme': ['baslik', 'tumunuGor'],
    'chip-ust-filtre': ['baslik', 'filtreler'],
    'accordion-sekme': ['baslik', 'aciklama'],
  },
  HAVA_DURUMU: {
    _varsayilan: ['baslik'],
    'detayli-kart': ['baslik'],
    'kompakt-serit': ['baslik', 'altBaslik'],
    'tam-genis-banner': ['baslik', 'altBaslik', 'aciklama'],
    'split-buyuk-tahmin': ['baslik'],
    'cam-hava-kart': ['baslik', 'aciklama'],
    'ikon-tahmin-grid': ['baslik', 'altBaslik'],
  },
  KRIPTO_LISTESI: {
    _varsayilan: ['baslik', 'tumunuGor'],
    'tablo-detay': ['baslik', 'tumunuGor'],
    'kart-grid': ['baslik', 'altBaslik', 'tumunuGor'],
    'ticker-kaydir': ['baslik'],
    'lider-podyum': ['baslik', 'tumunuGor'],
    'kompakt-satir': ['baslik', 'tumunuGor'],
    'split-ozet-panel': ['baslik', 'altBaslik', 'aciklama', 'tumunuGor'],
  },
  GUNCEL_KONULAR: {
    _varsayilan: ['baslik'],
    'hero-alt-liste': ['baslik', 'altBaslik', 'tumunuGor'],
    'yan-gorsel-liste': ['baslik', 'tumunuGor'],
    'chip-konu-filtre': ['baslik', 'filtreler'],
    'timeline-konu': ['baslik', 'aciklama'],
    'snap-yatay-kart': ['baslik', 'tumunuGor'],
    'buyuk-numara-dizilim': ['baslik', 'altBaslik'],
  },
  SIRKET_GIRIS_CIKIS: {
    _varsayilan: ['baslik'],
    'tablo-gunler': ['baslik', 'altBaslik'],
    'canli-genis-band': ['baslik', 'altBaslik', 'aciklama'],
    'kart-grid-gun': ['baslik'],
    'dikey-timeline-saat': ['baslik', 'aciklama'],
    'durum-rozet-panel': ['baslik', 'altBaslik'],
    'cam-saat-panel': ['baslik', 'aciklama'],
  },
  HABER_MAGAZIN: {
    _varsayilan: ['baslik', 'tumunuGor'],
    'asimetrik-grid': ['baslik', 'tumunuGor'],
    'hero-kucuk-grid': ['baslik', 'altBaslik', 'tumunuGor', 'heroBannerMetin'],
    'overlay-editorial': ['baslik', 'tumunuGor'],
    'iki-sutun-akis': ['baslik', 'aciklama', 'tumunuGor'],
    'snap-yatay-serit': ['baslik', 'tumunuGor'],
    'spotlight-liste': ['baslik', 'altBaslik', 'tumunuGor'],
  },
};

export function gorunumIcerikAlanlariBul(widgetTip: string, gorunumTipi?: string | null): WidgetIcerikAlanId[] {
  const harita = WIDGET_GORUNUM_ICERIK_ALANLARI[widgetTip];
  if (!harita) return [];
  const gt = widgetGorunumTipiNormalize(widgetTip, gorunumTipi);
  const ozel = harita[gt];
  if (ozel?.length) return ozel;
  return harita._varsayilan ?? [];
}

export function gorunumIcerikAlaniGerekli(
  widgetTip: string,
  gorunumTipi: string | null | undefined,
  alan: WidgetIcerikAlanId
): boolean {
  return gorunumIcerikAlanlariBul(widgetTip, gorunumTipi).includes(alan);
}
