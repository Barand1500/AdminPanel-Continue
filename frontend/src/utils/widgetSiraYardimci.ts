import type { AdminWidget } from '@/types/admin';
import { idString } from '@/utils/idKarsilastir';
import { widgetSayfaFiltrele } from '@/utils/widgetYerlesim';
import { formSayfaId } from '@/utils/widgetFormYardimci';

/** Ana sayfa (boş sayfaId) ve alt sayfalar için ortak karşılaştırma anahtarı */
export function widgetSayfaAnahtari(sayfaId: unknown): string {
  const temiz = formSayfaId(sayfaId);
  return temiz || '__ana_sayfa__';
}

export function widgetlarAyniSayfada(
  widgetlar: AdminWidget[],
  sayfaId: unknown,
  haricId?: string
): AdminWidget[] {
  const anahtar = widgetSayfaAnahtari(sayfaId);
  return widgetlar.filter((w) => {
    if (haricId && w.id === haricId) return false;
    return widgetSayfaAnahtari(w.sayfaId) === anahtar;
  });
}

/** Seçili sayfa için bir sonraki sıra numarası (1, 2, 3…) */
export function sonrakiWidgetSira(
  widgetlar: AdminWidget[],
  sayfaId?: unknown,
  haricId?: string
): number {
  const ayniSayfa = widgetlarAyniSayfada(widgetlar, sayfaId ?? '', haricId);
  const siralar = ayniSayfa.map((w) => Number(w.sira)).filter((n) => Number.isFinite(n));
  if (siralar.length === 0) return 1;
  return Math.max(...siralar) + 1;
}

/** Aynı sayfada aynı sıraya sahip başka widget var mı? */
export function siraCakismasiBul(
  widgetlar: AdminWidget[],
  sira: number,
  sayfaId?: unknown,
  haricId?: string
): AdminWidget | null {
  const hedef = Number(sira);
  return (
    widgetlarAyniSayfada(widgetlar, sayfaId ?? '', haricId).find((w) => Number(w.sira) === hedef) ??
    null
  );
}

function widgetSiraKarsilastir(a: AdminWidget, b: AdminWidget): number {
  const fark = Number(a.sira) - Number(b.sira);
  if (fark !== 0) return fark;
  return idString(a.id).localeCompare(idString(b.id), 'tr');
}

/** Sayfa rozeti seçimine göre widget listesi (mevcut sıra düzenine göre sıralı) */
export function sayfaFiltreWidgetlari(
  widgetlar: AdminWidget[],
  sayfaFiltreId: string,
  tipFiltre?: string
): AdminWidget[] {
  let liste = widgetSayfaFiltrele(widgetlar, sayfaFiltreId) as AdminWidget[];
  if (tipFiltre) liste = liste.filter((w) => w.tip === tipFiltre);
  return [...liste].sort(widgetSiraKarsilastir);
}

/** Mevcut sırayı koruyarak 1…n ardışık numara üretir */
export function sayfaSiraSikistirMap(siraliWidgetlar: AdminWidget[]): Map<string, number> {
  const map = new Map<string, number>();
  siraliWidgetlar.forEach((w, i) => map.set(w.id, i + 1));
  return map;
}

/** Sıralar zaten 1, 2, 3… şeklinde mi? */
export function sayfaSiralariSikisikMi(siraliWidgetlar: AdminWidget[]): boolean {
  if (siraliWidgetlar.length === 0) return true;
  const siralar = [...siraliWidgetlar].sort(widgetSiraKarsilastir).map((w) => Number(w.sira));
  return siralar.every((s, i) => s === i + 1);
}
