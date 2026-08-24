import type { SagTikOgeId } from '@/types/sagTikPaneli';
import type { AdminFlatIkonAdi } from '@/components/admin/ortak/AdminFlatIkon';

export interface SagTikOgeTanim {
  id: SagTikOgeId;
  etiket: string;
  aciklama: string;
  ikon: AdminFlatIkonAdi;
  ayarlanabilir: boolean;
  ayirici?: boolean;
}

export const SAG_TIK_OGE_TANIMLARI: SagTikOgeTanim[] = [
  { id: 'kopyala', etiket: 'Kopyala', aciklama: 'Seçili metni panoya kopyalar', ikon: 'kopyala', ayarlanabilir: true },
  { id: 'kes', etiket: 'Kes', aciklama: 'Seçili metni keser', ikon: 'kes', ayarlanabilir: true },
  { id: 'yapistir', etiket: 'Yapıştır', aciklama: 'Panodaki metni yapıştırır', ikon: 'yapistir', ayarlanabilir: true },
  { id: 'tumunuSec', etiket: 'Tümünü Seç', aciklama: 'Aktif alandaki metni seçer', ikon: 'tumunu-sec', ayarlanabilir: true },
  { id: 'ayirici1', etiket: 'Ayırıcı', aciklama: 'Düzenleme ve gezinme arası çizgi', ikon: 'ayirici', ayarlanabilir: true, ayirici: true },
  { id: 'moduller', etiket: 'Modüller', aciklama: 'Hızlı modül listesi (alt menü)', ikon: 'puzzle', ayarlanabilir: true },
  { id: 'sayfalar', etiket: 'Tüm Sayfalar', aciklama: 'Site sayfalarına hızlı git', ikon: 'belge', ayarlanabilir: true },
  { id: 'yeniSayfa', etiket: 'Yeni Sayfa', aciklama: 'Sayfa modülünü yeni kayıt ile açar', ikon: 'yeni-belge', ayarlanabilir: true },
  { id: 'dashboard', etiket: 'Dashboard', aciklama: 'Ana panele dön', ikon: 'panel', ayarlanabilir: true },
  { id: 'ayirici2', etiket: 'Ayırıcı', aciklama: 'Gezinme ve işlemler arası çizgi', ikon: 'ayirici', ayarlanabilir: true, ayirici: true },
  { id: 'kaydet', etiket: 'Kaydet', aciklama: 'Aktif modülde kaydet', ikon: 'kaydet', ayarlanabilir: true },
  { id: 'onizle', etiket: 'Önizle', aciklama: 'Site veya modül önizlemesi', ikon: 'onizle', ayarlanabilir: true },
  { id: 'siteAc', etiket: 'Siteyi Aç', aciklama: 'Canlı siteyi yeni sekmede açar', ikon: 'web', ayarlanabilir: true },
  { id: 'tema', etiket: 'Tema Değiştir', aciklama: 'Gece / gündüz modu', ikon: 'tema', ayarlanabilir: true },
  { id: 'sistemKesif', etiket: 'Sistemi Keşfet', aciklama: 'İnteraktif panel turu', ikon: 'kesif', ayarlanabilir: true },
];

export function sagTikOgeTanimBul(id: SagTikOgeId) {
  return SAG_TIK_OGE_TANIMLARI.find((o) => o.id === id);
}
