import type { Widget } from '@/types/site';

export function kurumsalHeroWidgetVarMi(widgetlar: Widget[]): boolean {
  return widgetlar.some((w) => w.aktif && w.tip === 'KURUMSAL_HERO');
}
