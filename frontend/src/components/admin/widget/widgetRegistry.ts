import {
  AKTIF_WIDGET_TIPLERI,
  DEPRECATED_WIDGET_TIPLERI,
  varsayilanConfig,
  type AktifWidgetTipi,
} from '@/types/widget';
import type { WidgetFormDegeri } from '@/types/admin';
import { ICERIK_PANEL_MAP } from './panels/WidgetIcerikPanelleri';

export const WIDGET_TIPLERI = [
  { id: 'SLIDER', etiket: 'Slider', ikon: '🎠', aciklama: 'Kayan banner slaytları', grup: 'Anasayfa' },
  { id: 'HERO_BANNER', etiket: 'Hero Banner', ikon: '🖼️', aciklama: 'Tek büyük banner', grup: 'Anasayfa' },
  { id: 'BASLIK_METIN', etiket: 'Başlık + Metin', ikon: '📝', aciklama: 'Sadece başlık ve metin bloğu', grup: 'İçerik' },
  { id: 'BASLIK_METIN_GORSEL', etiket: 'Metin + Görsel', ikon: '📰', aciklama: 'Başlık, metin ve görsel düzeni', grup: 'İçerik' },
  { id: 'HIZMET_KARTLARI', etiket: 'Hizmet Kartları', ikon: '💼', aciklama: 'Hizmet/özellik kartları', grup: 'İçerik' },
  { id: 'BLOG_KARUSEL', etiket: 'Blog Karuseli', ikon: '📰', aciklama: 'Yatay blog/haber kartları', grup: 'İçerik' },
  { id: 'LINK_KARTLARI', etiket: 'Link Kartları', ikon: '🔗', aciklama: 'İkonlu hızlı link grid', grup: 'İçerik' },
  { id: 'GORSEL_GRID_BLOK', etiket: 'Görsel Grid Bloğu', ikon: '🏥', aciklama: 'Sol panel + görsel kart grid', grup: 'İçerik' },
  { id: 'GALERI', etiket: 'Galeri', ikon: '🖼️', aciklama: 'Çoklu görsel galerisi', grup: 'İçerik' },
  { id: 'KATEGORI', etiket: 'Kategori', ikon: '📂', aciklama: 'Kategori navigasyonu', grup: 'İçerik' },
  { id: 'REFERANSLAR', etiket: 'Referanslar', ikon: '⭐', aciklama: 'Müşteri referansları', grup: 'İçerik' },
  { id: 'SSS', etiket: 'SSS', ikon: '❓', aciklama: 'Sık sorulan sorular', grup: 'İçerik' },
  { id: 'HARITA', etiket: 'Harita', ikon: '🗺️', aciklama: 'Konum haritası', grup: 'İletişim' },
  { id: 'ILETISIM_FORMU', etiket: 'İletişim CTA', ikon: '📧', aciklama: 'İletişim çağrı bandı', grup: 'İletişim' },
  { id: 'POPUP', etiket: 'Popup', ikon: '💬', aciklama: 'Açılır pencere', grup: 'Diğer' },
] as const;

export const GIZLI_WIDGET_TIPLERI = new Set<string>(DEPRECATED_WIDGET_TIPLERI);

export function tipOlusturulabilirMi(tip: string) {
  return (AKTIF_WIDGET_TIPLERI as readonly string[]).includes(tip);
}

export function tipEtiketi(tip: string) {
  return WIDGET_TIPLERI.find((t) => t.id === tip)?.etiket ?? tip.replaceAll('_', ' ');
}

export function tipIkon(tip: string) {
  return WIDGET_TIPLERI.find((t) => t.id === tip)?.ikon ?? '🧩';
}

export function varsayilanWidgetForm(tip: AktifWidgetTipi | string = 'SLIDER'): WidgetFormDegeri {
  const safeTip = tipOlusturulabilirMi(tip) ? tip : 'SLIDER';
  return {
    ad: '',
    tip: safeTip,
    sira: 0,
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
  };
}

export function tipDegistir(form: WidgetFormDegeri, yeniTip: string): WidgetFormDegeri {
  if (!tipOlusturulabilirMi(yeniTip)) return form;
  return {
    ...varsayilanWidgetForm(yeniTip),
    ad: form.ad,
    sira: form.sira,
    aktif: form.aktif,
    mobilGoster: form.mobilGoster,
    masaustuGoster: form.masaustuGoster,
  };
}

export function widgetRegistryIcerik(tip: string) {
  return ICERIK_PANEL_MAP[tip] ?? null;
}
