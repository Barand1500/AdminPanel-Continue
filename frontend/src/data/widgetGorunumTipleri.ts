import { AKTIF_WIDGET_TIPLERI, type AktifWidgetTipi } from '@/types/widget';

export interface WidgetGorunumTipTanimi {
  id: string;
  ad: string;
  aciklama: string;
  ilham?: string;
}

function gt(id: string, ad: string, aciklama: string, ilham?: string): WidgetGorunumTipTanimi {
  return { id, ad, aciklama, ilham };
}

/** Her widget tipi için 2–3 görünüm varyantı */
export const WIDGET_GORUNUM_TIP_TANIMLARI: Record<AktifWidgetTipi, WidgetGorunumTipTanimi[]> = {
  SLIDER: [
    gt('klasik', 'Klasik', 'Tam genişlik slayt + alt noktalar', 'Apple'),
    gt('kart', 'Kart Slider', 'Yuvarlatılmış kart içinde slayt', 'Stripe'),
    gt('bolunmus', 'Bölünmüş', 'Sol metin, sağ görsel', 'SaaS'),
  ],
  HIZMET_KARTLARI: [
    gt('klasik-grid', 'Klasik Grid', 'İkon + başlık + açıklama kartları'),
    gt('cam-kart', 'Cam Kart', 'Glassmorphism kart stili'),
    gt('minimal-liste', 'Minimal Liste', 'Yatay liste düzeni'),
  ],
  KATEGORI: [
    gt('klasik', 'Klasik', 'Ikonlu kategori grid'),
    gt('pill', 'Pill', 'Yuvarlak pill butonlar'),
    gt('buyuk-kart', 'Büyük Kart', 'Geniş görsel kartlar'),
  ],
  REFERANSLAR: [
    gt('klasik', 'Klasik', 'Logo/metin grid'),
    gt('carousel', 'Karusel', 'Yatay kaydırmalı'),
    gt('quote', 'Alıntı', 'Büyük alıntı stili'),
  ],
  SSS: [
    gt('klasik', 'Klasik', 'Accordion liste'),
    gt('iki-kolon', 'İki Kolon', 'Yan yana sorular'),
    gt('kart', 'Kart', 'Kart içinde SSS'),
  ],
  GALERI: [
    gt('klasik-grid', 'Grid', 'Eşit grid galeri'),
    gt('masonry', 'Masonry', 'Pinterest tarzı'),
    gt('lightbox', 'Lightbox', 'Büyük önizleme odaklı'),
  ],
  HARITA: [
    gt('klasik', 'Klasik', 'Tam genişlik harita'),
    gt('bol-split', 'Bölünmüş', 'Sol bilgi, sağ harita'),
    gt('kart', 'Kart', 'Çerçeveli harita kartı'),
  ],
  ILETISIM_FORMU: [
    gt('merkez-basit', 'Merkez Basit', 'Ortalanmış başlık + tek buton'),
    gt('gradient-banner', 'Gradient Banner', 'Turuncu gradient CTA bandı', 'SaaS'),
    gt('bol-split', 'Bölünmüş', 'Sol metin, sağ butonlar'),
  ],
  POPUP: [
    gt('klasik', 'Klasik', 'Ortada modal popup'),
    gt('slide-alt', 'Alt Slide', 'Alttan kayan banner'),
    gt('kose', 'Köşe', 'Sağ alt köşe bildirim'),
  ],
  BASLIK_METIN: [
    gt('klasik', 'Klasik', 'Başlık + paragraf'),
    gt('vurgu-cizgi', 'Vurgu Çizgi', 'Sol kenar vurgu çizgisi'),
    gt('buyuk-baslik', 'Büyük Başlık', 'Hero tarzı büyük tipografi'),
  ],
  BASLIK_METIN_GORSEL: [
    gt('klasik', 'Klasik', 'Metin + görsel yan yana'),
    gt('overlay', 'Overlay', 'Görsel üzeri metin'),
    gt('kart', 'Kart', 'Kart içinde düzen'),
  ],
  BLOG_KARUSEL: [
    gt('klasik', 'Klasik', 'Yatay kart karuseli'),
    gt('buyuk-kart', 'Büyük Kart', 'Geniş kart önizleme'),
    gt('minimal', 'Minimal', 'Kompakt liste'),
  ],
  LINK_KARTLARI: [
    gt('klasik-grid', 'Grid', 'Ikonlu link grid'),
    gt('cam-kart', 'Cam Kart', 'Glassmorphism'),
    gt('minimal-liste', 'Liste', 'Dikey link listesi'),
  ],
  GORSEL_GRID_BLOK: [
    gt('klasik', 'Klasik', 'Sol panel + grid'),
    gt('tam-grid', 'Tam Grid', 'Filtresiz tam grid'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'Büyük kart vurgusu'),
  ],
  GORSEL_ETIKET_KARTLARI: [
    gt('klasik-grid', 'Grid', 'Görsel + alt etiket'),
    gt('overlay', 'Overlay', 'Görsel üzeri etiket'),
    gt('minimal', 'Minimal', 'Küçük kompakt kartlar'),
  ],
  EKIP_KARUSEL: [
    gt('klasik', 'Klasik', 'Yuvarlak foto + bilgi'),
    gt('kart', 'Kart', 'Kare kart stili'),
    gt('minimal', 'Minimal', 'Sadece foto + isim'),
  ],
  SAYAC_BLOK: [
    gt('klasik', 'Klasik', 'Büyük rakam grid'),
    gt('kapsul', 'Kapsül', 'Pill şerit istatistik'),
    gt('cam-kart', 'Cam Kart', 'Glassmorphism kartlar'),
  ],
  YORUM_KARUSEL: [
    gt('klasik', 'Klasik', 'Yorum kart karuseli'),
    gt('buyuk-alinti', 'Büyük Alıntı', 'Tek büyük alıntı'),
    gt('minimal', 'Minimal', 'Kompakt yorum listesi'),
  ],
  FIYATLANDIRMA: [
    gt('klasik', 'Klasik', '3 kolon fiyat kartları'),
    gt('vurgulu-orta', 'Vurgulu Orta', 'Orta paket öne çıkar'),
    gt('minimal', 'Minimal', 'Sade tablo stili'),
  ],
  ZAMAN_CIZELGESI: [
    gt('dikey', 'Dikey', 'Dikey timeline çizgisi'),
    gt('yatay', 'Yatay', 'Yatay adım çizgisi'),
    gt('kart', 'Kart', 'Kart bazlı timeline'),
  ],
  SUREC_ADIMLARI: [
    gt('kart-grid', 'Kart Grid', 'Beyaz numaralı kart grid'),
    gt('koyu-yatay-adim', 'Koyu Yatay', 'Koyu arka plan, yatay 3 adım', 'SaaS'),
    gt('dikey-zaman', 'Dikey Zaman', 'Dikey adım akışı'),
  ],
  MARKA_SERIDI: [
    gt('logo-kayan', 'Logo Kayan', 'Yatay kayan logo şeridi'),
    gt('egik-metin-seridi', 'Eğik Metin', 'Turuncu eğik metin bandı', 'Landing'),
    gt('istatistik-kapsul', 'İstatistik Kapsül', 'KPI pill şerit', 'Dashboard'),
  ],
  KARSILASTIRMA_TABLOSU: [
    gt('klasik', 'Klasik', 'Tam karşılaştırma tablosu'),
    gt('kart', 'Kart', 'Mobil uyumlu kart görünümü'),
    gt('minimal', 'Minimal', 'Sadeleştirilmiş tablo'),
  ],
  GERI_SAYIM: [
    gt('klasik', 'Klasik', 'Büyük sayaç + CTA'),
    gt('kompakt', 'Kompakt', 'Küçük inline sayaç'),
    gt('banner', 'Banner', 'Tam genişlik banner'),
  ],
  VIDEO_BANNER: [
    gt('klasik', 'Klasik', 'Tam genişlik video arka plan'),
    gt('bol-split', 'Bölünmüş', 'Sol metin, sağ video'),
    gt('kart', 'Kart', 'Çerçeveli video kart'),
  ],
  ONCESI_SONRASI: [
    gt('klasik', 'Klasik', 'Kaydırmalı karşılaştırma'),
    gt('yan-yana', 'Yan Yana', 'Sabit iki görsel'),
    gt('kart', 'Kart', 'Çerçeveli karşılaştırma'),
  ],
  BULTEN_KAYIT: [
    gt('klasik', 'Klasik', 'Ortalanmış form'),
    gt('banner', 'Banner', 'Tam genişlik bülten bandı'),
    gt('kart', 'Kart', 'Kart içinde form'),
  ],
  BLOK_OLUSTURUCU: [
    gt('klasik', 'Klasik', 'Standart grid parçalar'),
    gt('cam-kart', 'Cam Kart', 'Glassmorphism parçalar'),
    gt('minimal', 'Minimal', 'Sade parça düzeni'),
  ],
  KOSE_YAZARLARI: [
    gt('klasik', 'Klasik', 'Yazar kart karuseli'),
    gt('liste', 'Liste', 'Dikey yazar listesi'),
    gt('buyuk-kart', 'Büyük Kart', 'Geniş yazar kartları'),
  ],
  ILETISIM_BLOK: [
    gt('klasik', 'Klasik', 'Kartlar + harita'),
    gt('bol-split', 'Bölünmüş', 'Sol kartlar, sağ harita'),
    gt('kart', 'Kart', 'Kompakt kart düzeni'),
  ],
  KATEGORI_HABER_LISTESI: [
    gt('klasik', 'Klasik', 'Yatay haber kart listesi'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'İlk haber büyük'),
    gt('minimal', 'Minimal', 'Kompakt liste'),
  ],
  KATEGORI_HABER_OVERLAY: [
    gt('klasik', 'Klasik', 'Overlay grid'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'İlk kart büyük'),
    gt('minimal', 'Minimal', 'Küçük grid'),
  ],
  VIDEO_GALERISI: [
    gt('klasik', 'Klasik', 'Video kapak grid'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'İlk video büyük'),
    gt('liste', 'Liste', 'Dikey video listesi'),
  ],
  SEKMELI_HABER: [
    gt('klasik', 'Klasik', 'Sekmeli haber paneli'),
    gt('pill-sekme', 'Pill Sekme', 'Yuvarlak sekme butonları'),
    gt('minimal', 'Minimal', 'Sade sekme düzeni'),
  ],
  HAVA_DURUMU: [
    gt('klasik', 'Klasik', 'Detaylı hava paneli'),
    gt('kompakt', 'Kompakt', 'Küçük hava özeti'),
    gt('banner', 'Banner', 'Tam genişlik hava bandı'),
  ],
  KRIPTO_LISTESI: [
    gt('klasik', 'Klasik', 'Fiyat tablosu'),
    gt('kart', 'Kart', 'Kart bazlı liste'),
    gt('minimal', 'Minimal', 'Kompakt ticker'),
  ],
  GUNCEL_KONULAR: [
    gt('klasik', 'Klasik', 'Numaralı haber listesi'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'İlk konu büyük'),
    gt('minimal', 'Minimal', 'Kompakt liste'),
  ],
  SIRKET_GIRIS_CIKIS: [
    gt('klasik', 'Klasik', 'Açılış/kapanış tablosu'),
    gt('banner', 'Banner', 'Canlı saat bandı'),
    gt('kart', 'Kart', 'Kompakt bilgi kartı'),
  ],
  HABER_MAGAZIN: [
    gt('klasik', 'Klasik', 'Magazin grid'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'Hero + grid'),
    gt('minimal', 'Minimal', 'Kompakt magazin'),
  ],
};

export function widgetGorunumTipleriBul(widgetTip: string): WidgetGorunumTipTanimi[] {
  const tipler = WIDGET_GORUNUM_TIP_TANIMLARI[widgetTip as AktifWidgetTipi];
  if (tipler?.length) return tipler;
  return [gt('klasik', 'Klasik', 'Varsayılan görünüm')];
}

export function widgetGorunumTipiNormalize(widgetTip: string, gorunumTipi?: string | null): string {
  const tipler = widgetGorunumTipleriBul(widgetTip);
  if (gorunumTipi && tipler.some((t) => t.id === gorunumTipi)) return gorunumTipi;
  return tipler[0]?.id ?? 'klasik';
}

export function widgetGorunumTipTanimiBul(widgetTip: string, gorunumTipi?: string | null): WidgetGorunumTipTanimi {
  const id = widgetGorunumTipiNormalize(widgetTip, gorunumTipi);
  return widgetGorunumTipleriBul(widgetTip).find((t) => t.id === id) ?? widgetGorunumTipleriBul(widgetTip)[0];
}

export function varsayilanWidgetGorunumTipi(widgetTip: string): string {
  return widgetGorunumTipleriBul(widgetTip)[0]?.id ?? 'klasik';
}

/** CSS modifier sınıfı: widget-marka-seridi--logo-kayan */
export function widgetGorunumSinifi(widgetTip: string, gorunumTipi?: string | null): string {
  const tip = widgetGorunumTipiNormalize(widgetTip, gorunumTipi);
  const slug = widgetTip.toLowerCase().replace(/_/g, '-');
  return `widget-${slug} widget-${slug}--${tip}`;
}

export function tumAktifWidgetTipleri(): readonly string[] {
  return AKTIF_WIDGET_TIPLERI;
}
