import type { AdminWidget } from '@/types/admin';
import { formSayfaId } from '@/utils/widgetFormYardimci';

/** Ana sayfa (boş sayfaId) ve alt sayfalar için ortak karşılaştırma anahtarı */
export function widgetSayfaAnahtari(sayfaId: unknown): string {
  const temiz = formSayfaId(sayfaId);
  return temiz || '__ana_sayfa__';
}

function widgetlarAyniSayfada(
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
