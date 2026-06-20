import {
  AKTIF_WIDGET_TIPLERI,
  DEPRECATED_WIDGET_TIPLERI,
  varsayilanConfig,
  type AktifWidgetTipi,
} from '@/types/widget';
import type { WidgetFormDegeri, AdminWidget } from '@/types/admin';
import { sonrakiWidgetSira } from '@/utils/widgetSiraYardimci';
import { ICERIK_PANEL_MAP } from './panels/WidgetIcerikPanelleri';

/** Widget tipi seçicide kullanılan içerik kategorileri */
export const WIDGET_TIP_KATEGORILERI = [
  { id: 'slider', etiket: 'Slider', aciklama: 'Kayan slaytlar ve banner alanları' },
  { id: 'resim_metin', etiket: 'Görsel + Metin', aciklama: 'Resim ve metin birlikte (hakkımızda vb.)' },
  { id: 'metin', etiket: 'Metin', aciklama: 'Sadece başlık ve paragraf blokları' },
  { id: 'kart', etiket: 'Kart', aciklama: 'İkonlu, görselli veya fiyat kart gridleri' },
  { id: 'karusel', etiket: 'Karusel', aciklama: 'Yatay kaydırmalı blog, ekip, yorum' },
  { id: 'resimli', etiket: 'Resimli', aciklama: 'Galeri ve görsel grid blokları' },
  { id: 'istatistik', etiket: 'İstatistik', aciklama: 'Sayaç ve rakam blokları' },
  { id: 'iletisim', etiket: 'İletişim', aciklama: 'Harita ve iletişim CTA' },
  { id: 'diger', etiket: 'Diğer', aciklama: 'SSS, referans, popup, kategori' },
  { id: 'modern', etiket: 'Modern', aciklama: 'Zaman çizelgesi, video, geri sayım ve özel bloklar' },
  { id: 'haber', etiket: 'Haber / Portal', aciklama: 'Köşe yazarları, haber grid, hava durumu, kripto ve daha fazlası' },
] as const;

export type WidgetTipKategoriId = (typeof WIDGET_TIP_KATEGORILERI)[number]['id'];

export const WIDGET_TIPLERI = [
  { id: 'SLIDER', etiket: 'Slider', ikon: '🎠', aciklama: 'Kayan banner slaytları', grup: 'Anasayfa', kategori: 'slider' as const },
  { id: 'BASLIK_METIN', etiket: 'Başlık + Metin', ikon: '📝', aciklama: 'Sadece başlık ve metin bloğu', grup: 'İçerik', kategori: 'metin' as const },
  { id: 'BASLIK_METIN_GORSEL', etiket: 'Metin + Görsel', ikon: '📰', aciklama: 'Başlık, metin, görsel ve ikon kartları', grup: 'İçerik', kategori: 'resim_metin' as const },
  { id: 'HIZMET_KARTLARI', etiket: 'Hizmet Kartları', ikon: '💼', aciklama: 'İkon + başlık + açıklama + CTA kartları', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'BLOG_KARUSEL', etiket: 'Blog Karuseli', ikon: '📰', aciklama: 'Yatay blog/haber kartları', grup: 'İçerik', kategori: 'karusel' as const },
  { id: 'LINK_KARTLARI', etiket: 'Link Kartları', ikon: '🔗', aciklama: 'İkonlu hızlı link grid', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'GORSEL_GRID_BLOK', etiket: 'Görsel Grid Bloğu', ikon: '🏥', aciklama: 'Sol panel + görsel kart grid', grup: 'İçerik', kategori: 'resimli' as const },
  { id: 'GORSEL_ETIKET_KARTLARI', etiket: 'Görsel Etiket Kartları', ikon: '🖼️', aciklama: 'Görsel + alt etiket kart grid', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'EKIP_KARUSEL', etiket: 'Ekip Karuseli', ikon: '👥', aciklama: 'Takım fotoğrafları karuseli', grup: 'İçerik', kategori: 'karusel' as const },
  { id: 'SAYAC_BLOK', etiket: 'Sayaç Bloğu', ikon: '📊', aciklama: 'İstatistik sayaçları', grup: 'İçerik', kategori: 'istatistik' as const },
  { id: 'YORUM_KARUSEL', etiket: 'Yorum Karuseli', ikon: '💬', aciklama: 'Müşteri yorumları (karusel)', grup: 'İçerik', kategori: 'karusel' as const },
  { id: 'YORUM_KARTLARI', etiket: 'Yorum Kartları', ikon: '⭐', aciklama: 'Grid müşteri yorum kartları', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'FIYATLANDIRMA', etiket: 'Fiyatlandırma', ikon: '💰', aciklama: 'Paket fiyat kartları', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'GALERI', etiket: 'Galeri', ikon: '🖼️', aciklama: 'Çoklu görsel galerisi', grup: 'İçerik', kategori: 'resimli' as const },
  { id: 'KATEGORI', etiket: 'Kategori', ikon: '📂', aciklama: 'Kategori navigasyonu', grup: 'İçerik', kategori: 'diger' as const },
  { id: 'REFERANSLAR', etiket: 'Referanslar', ikon: '⭐', aciklama: 'Müşteri referansları', grup: 'İçerik', kategori: 'diger' as const },
  { id: 'SSS', etiket: 'SSS', ikon: '❓', aciklama: 'Sık sorulan sorular', grup: 'İçerik', kategori: 'diger' as const },
  { id: 'HARITA', etiket: 'Harita', ikon: '🗺️', aciklama: 'Konum haritası', grup: 'İletişim', kategori: 'iletisim' as const },
  { id: 'ILETISIM_FORMU', etiket: 'İletişim CTA', ikon: '📧', aciklama: 'İletişim çağrı bandı', grup: 'İletişim', kategori: 'iletisim' as const },
  { id: 'POPUP', etiket: 'Popup', ikon: '💬', aciklama: 'Açılır pencere', grup: 'Diğer', kategori: 'diger' as const },
  { id: 'ZAMAN_CIZELGESI', etiket: 'Zaman Çizelgesi', ikon: '📅', aciklama: 'Dikey timeline — şirket tarihçesi', grup: 'Modern', kategori: 'modern' as const },
  { id: 'SUREC_ADIMLARI', etiket: 'Süreç Adımları', ikon: '🪜', aciklama: 'Numaralı adım akışı', grup: 'Modern', kategori: 'modern' as const },
  { id: 'MARKA_SERIDI', etiket: 'Marka Şeridi', ikon: '🏷️', aciklama: 'Kayan logo / partner şeridi', grup: 'Modern', kategori: 'modern' as const },
  { id: 'KARSILASTIRMA_TABLOSU', etiket: 'Karşılaştırma Tablosu', ikon: '📋', aciklama: 'Paket özellik karşılaştırması', grup: 'Modern', kategori: 'modern' as const },
  { id: 'GERI_SAYIM', etiket: 'Geri Sayım', ikon: '⏳', aciklama: 'Kampanya countdown + CTA', grup: 'Modern', kategori: 'modern' as const },
  { id: 'VIDEO_BANNER', etiket: 'Video Banner', ikon: '🎬', aciklama: 'YouTube veya video arka plan', grup: 'Modern', kategori: 'modern' as const },
  { id: 'ONCESI_SONRASI', etiket: 'Öncesi / Sonrası', ikon: '↔️', aciklama: 'Kaydırmalı görsel karşılaştırma', grup: 'Modern', kategori: 'modern' as const },
  { id: 'BULTEN_KAYIT', etiket: 'Bülten Kayıt', ikon: '✉️', aciklama: 'E-posta abonelik formu', grup: 'Modern', kategori: 'modern' as const },
  { id: 'BLOK_OLUSTURUCU', etiket: 'Özel Grid Widget', ikon: '🧱', aciklama: 'Grid parçalarıyla özel widget oluştur', grup: 'Oluşturucu', kategori: 'modern' as const },
  { id: 'KOSE_YAZARLARI', etiket: 'Köşe Yazarları', ikon: '✒️', aciklama: 'Yazar kartları karuseli', grup: 'Haber', kategori: 'haber' as const },
  { id: 'ILETISIM_BLOK', etiket: 'İletişim + Harita', ikon: '📍', aciklama: 'İletişim kartları ve harita', grup: 'Haber', kategori: 'haber' as const },
  { id: 'KATEGORI_HABER_LISTESI', etiket: 'Kategori Haber Listesi', ikon: '🚗', aciklama: 'Yatay haber kart listesi', grup: 'Haber', kategori: 'haber' as const },
  { id: 'KATEGORI_HABER_OVERLAY', etiket: 'Kategori Haber Grid', ikon: '📶', aciklama: 'Görsel üzeri başlıklı grid', grup: 'Haber', kategori: 'haber' as const },
  { id: 'VIDEO_GALERISI', etiket: 'Video Galerisi', ikon: '▶️', aciklama: 'Video kapak kartları', grup: 'Haber', kategori: 'haber' as const },
  { id: 'SEKMELI_HABER', etiket: 'Sekmeli Haber', ikon: '📰', aciklama: 'Sekmeli öne çıkan + liste', grup: 'Haber', kategori: 'haber' as const },
  { id: 'HAVA_DURUMU', etiket: 'Hava Durumu', ikon: '⛅', aciklama: 'Anlık hava ve tahmin', grup: 'Haber', kategori: 'haber' as const },
  { id: 'KRIPTO_LISTESI', etiket: 'Kripto Paralar', ikon: '📈', aciklama: 'Kripto fiyat listesi', grup: 'Haber', kategori: 'haber' as const },
  { id: 'GUNCEL_KONULAR', etiket: 'Güncel Konular', ikon: '☰', aciklama: 'Numaralı haber listesi', grup: 'Haber', kategori: 'haber' as const },
  { id: 'SIRKET_GIRIS_CIKIS', etiket: 'Şirket Açılış / Kapanış', ikon: '🏢', aciklama: 'Haftalık açılış ve kapanış saatleri', grup: 'Haber', kategori: 'haber' as const },
  { id: 'HABER_MAGAZIN', etiket: 'Haber Magazin', ikon: '📊', aciklama: 'Karışık haber magazin grid', grup: 'Haber', kategori: 'haber' as const },
] as const;

export type WidgetTipMeta = (typeof WIDGET_TIPLERI)[number];

export const GIZLI_WIDGET_TIPLERI = new Set<string>(DEPRECATED_WIDGET_TIPLERI);

export function tipOlusturulabilirMi(tip: string) {
  return (AKTIF_WIDGET_TIPLERI as readonly string[]).includes(tip);
}

export function tipMetaBul(tip: string): WidgetTipMeta | undefined {
  return WIDGET_TIPLERI.find((t) => t.id === tip);
}

export function tipEtiketi(tip: string) {
  return tipMetaBul(tip)?.etiket ?? tip.replaceAll('_', ' ');
}

export function tipIkon(tip: string) {
  return tipMetaBul(tip)?.ikon ?? '🧩';
}

export function tipKategori(tip: string): WidgetTipKategoriId {
  return tipMetaBul(tip)?.kategori ?? 'diger';
}

export function tipKategoriEtiketi(tip: string) {
  const kid = tipKategori(tip);
  return WIDGET_TIP_KATEGORILERI.find((k) => k.id === kid)?.etiket ?? 'Diğer';
}

export function widgetTipleriKategoriyeGore(tipFiltre?: string) {
  const liste = WIDGET_TIPLERI.filter((t) => !tipFiltre || t.id === tipFiltre);
  const gruplar = new Map<WidgetTipKategoriId, WidgetTipMeta[]>();

  for (const kat of WIDGET_TIP_KATEGORILERI) {
    gruplar.set(kat.id, []);
  }

  for (const tip of liste) {
    const mevcut = gruplar.get(tip.kategori) ?? [];
    mevcut.push(tip);
    gruplar.set(tip.kategori, mevcut);
  }

  return WIDGET_TIP_KATEGORILERI.map((kat) => ({
    kategori: kat,
    tipler: gruplar.get(kat.id) ?? [],
  })).filter((g) => g.tipler.length > 0);
}

export function varsayilanWidgetForm(
  tip: AktifWidgetTipi | string = 'SLIDER',
  widgetlar: AdminWidget[] = []
): WidgetFormDegeri {
  const safeTip = tipOlusturulabilirMi(tip) ? tip : 'SLIDER';
  return {
    ad: safeTip === 'BLOK_OLUSTURUCU' ? 'Özel Grid Widget' : '',
    tip: safeTip,
    sira: sonrakiWidgetSira(widgetlar),
    aktif: true,
    baslik: '',
    altBaslik: '',
    aciklama: '',
    gorselUrl: '',
    butonMetni: '',
    butonLink: '',
    arkaPlanRenk: '',
    yaziRenk: '',
    mobilGoster: true,
    masaustuGoster: true,
    configJsonMetin: JSON.stringify(varsayilanConfig(safeTip), null, 2),
    sayfaId: '',
  };
}

export function tipDegistir(
  form: WidgetFormDegeri,
  yeniTip: string,
  widgetlar: AdminWidget[] = []
): WidgetFormDegeri {
  if (!tipOlusturulabilirMi(yeniTip)) return form;
  return {
    ...varsayilanWidgetForm(yeniTip, widgetlar),
    ad: form.ad,
    sira: form.sira,
    aktif: form.aktif,
    mobilGoster: form.mobilGoster,
    masaustuGoster: form.masaustuGoster,
    sayfaId: form.sayfaId,
  };
}

export function widgetRegistryIcerik(tip: string) {
  return ICERIK_PANEL_MAP[tip] ?? null;
}
