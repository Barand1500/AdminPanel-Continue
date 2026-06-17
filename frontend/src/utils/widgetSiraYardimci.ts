import type { AdminWidget } from '@/types/admin';

/** Yeni widget için bir sonraki sıra numarası (1, 2, 3… → 4) */
export function sonrakiWidgetSira(widgetlar: AdminWidget[], haricId?: string): number {
  const siralar = widgetlar.filter((w) => w.id !== haricId).map((w) => w.sira);
  if (siralar.length === 0) return 1;
  return Math.max(...siralar) + 1;
}

/** Aynı sıraya sahip başka widget var mı? */
export function siraCakismasiBul(
  widgetlar: AdminWidget[],
  sira: number,
  haricId?: string
): AdminWidget | null {
  return widgetlar.find((w) => w.sira === sira && w.id !== haricId) ?? null;
}
