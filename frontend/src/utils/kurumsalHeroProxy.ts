import type { AdminWidget } from '@/types/admin';
import type { Widget } from '@/types/site';

/** Eski sunucularda kabul edilen widget tipi (KURUMSAL_HERO proxy). */
export const KURUMSAL_HERO_PROXY_TIP = 'SLIDER';

export const KURUMSAL_HERO_GERCEK_TIP_ANAHTAR = 'gercekTip';

export function kurumsalHeroProxyMi(widget: {
  tip?: string;
  configJson?: Record<string, unknown> | null;
}): boolean {
  const cfg = widget.configJson ?? {};
  return cfg[KURUMSAL_HERO_GERCEK_TIP_ANAHTAR] === 'KURUMSAL_HERO' || widget.tip === 'KURUMSAL_HERO';
}

export function kurumsalHeroWidgetNormalize<T extends Widget | AdminWidget>(widget: T): T {
  if (!kurumsalHeroProxyMi(widget)) return widget;
  return { ...widget, tip: 'KURUMSAL_HERO' };
}

export function kurumsalHeroWidgetlariNormalize<T extends Widget | AdminWidget>(widgetlar: T[]): T[] {
  return widgetlar.map(kurumsalHeroWidgetNormalize);
}

/** API'ye gonderilecek payload: KURUMSAL_HERO -> SLIDER + gercekTip isareti. */
export function kurumsalHeroApiPayloadDonustur(payload: Record<string, unknown>): Record<string, unknown> {
  if (payload.tip !== 'KURUMSAL_HERO') return payload;

  const mevcutCfg =
    payload.configJson && typeof payload.configJson === 'object'
      ? (payload.configJson as Record<string, unknown>)
      : {};

  return {
    ...payload,
    tip: KURUMSAL_HERO_PROXY_TIP,
    configJson: {
      ...mevcutCfg,
      [KURUMSAL_HERO_GERCEK_TIP_ANAHTAR]: 'KURUMSAL_HERO',
    },
  };
}

export function kurumsalHeroApiPayloadGerekli(payload: Record<string, unknown>): boolean {
  return payload.tip === 'KURUMSAL_HERO';
}
