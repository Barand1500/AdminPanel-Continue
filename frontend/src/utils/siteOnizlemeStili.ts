import type { CSSProperties } from 'react';
import type { SiteAyarlari } from '@/types/site';
import { temaAyarlariBirlestir } from '@/types/temaAyarlari';
import { aktifPaletiHesapla } from '@/utils/temaRenkleri';

/** Admin canlı önizleme kutusuna public site tema değişkenlerini uygular */
export function siteOnizlemeCssStili(ayarlar?: SiteAyarlari | null): CSSProperties {
  const anaRenk = ayarlar?.anaRenk ?? '#7c3aed';
  const ikincilRenk = ayarlar?.ikincilRenk ?? '#a78bfa';
  const geceSablon = temaAyarlariBirlestir(ayarlar?.temaAyarlariJson).geceSablon;
  const palet = aktifPaletiHesapla('acik', anaRenk, ikincilRenk, geceSablon);
  const font = ayarlar?.font ?? 'Inter';

  return {
    '--color-primary': palet.primary,
    '--color-primary-dark': palet.primaryDark,
    '--color-primary-light': palet.primaryLight,
    '--color-accent': palet.accent,
    '--color-surface': palet.surface,
    '--color-surface-elevated': palet.surfaceElevated,
    '--color-text': palet.text,
    '--color-text-muted': palet.textMuted,
    '--color-border': palet.border,
    '--color-footer-bg': palet.footerBg,
    '--color-footer-text': palet.footerText,
    '--font-sans': `"${font}", system-ui, sans-serif`,
    fontFamily: `"${font}", system-ui, sans-serif`,
  } as CSSProperties;
}
