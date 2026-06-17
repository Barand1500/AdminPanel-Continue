import type { SiteTemaPaleti } from '@/types/temaAyarlari';
import { geceSablonPalet, type GeceSablonId } from '@/types/temaAyarlari';

function hexParse(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const tam = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(tam.slice(0, 2), 16),
    parseInt(tam.slice(2, 4), 16),
    parseInt(tam.slice(4, 6), 16),
  ];
}

function hexYaz(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function hexKaristir(a: string, b: string, oran: number): string {
  const [ar, ag, ab] = hexParse(a);
  const [br, bg, bb] = hexParse(b);
  const t = Math.max(0, Math.min(1, oran));
  return hexYaz(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

export function hexKoyult(hex: string, oran = 0.12): string {
  const [r, g, b] = hexParse(hex);
  const f = 1 - oran;
  return hexYaz(r * f, g * f, b * f);
}

export function hexAcik(hex: string, oran = 0.13): string {
  return `${hex}${Math.round(oran * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

export function gunduzPaletiOlustur(anaRenk: string, ikincilRenk: string): SiteTemaPaleti {
  const surface = hexKaristir('#fafafa', anaRenk, 0.04);
  const surfaceElevated = hexKaristir('#ffffff', anaRenk, 0.02);
  const text = hexKaristir('#0f172a', anaRenk, 0.08);
  const textMuted = hexKaristir('#64748b', anaRenk, 0.06);
  const border = hexAcik(anaRenk, 0.12);

  return {
    surface,
    surfaceElevated,
    text,
    textMuted,
    border,
    primary: anaRenk,
    primaryDark: hexKoyult(anaRenk, 0.12),
    primaryLight: ikincilRenk,
    accent: hexAcik(ikincilRenk, 0.13),
    footerBg: hexAcik(ikincilRenk, 0.13),
    footerText: textMuted,
  };
}

export function aktifPaletiHesapla(
  mod: 'acik' | 'koyu',
  anaRenk: string,
  ikincilRenk: string,
  geceSablon: GeceSablonId
): SiteTemaPaleti {
  if (mod === 'koyu') return geceSablonPalet(geceSablon);
  return gunduzPaletiOlustur(anaRenk, ikincilRenk);
}

export const TEMA_CSS_VARS = [
  '--color-primary',
  '--color-primary-dark',
  '--color-primary-light',
  '--color-accent',
  '--color-surface',
  '--color-surface-elevated',
  '--color-text',
  '--color-text-muted',
  '--color-border',
  '--color-footer-bg',
  '--color-footer-text',
] as const;

export function paletiCssVarsUygula(root: HTMLElement, palet: SiteTemaPaleti) {
  root.style.setProperty('--color-primary', palet.primary);
  root.style.setProperty('--color-primary-dark', palet.primaryDark);
  root.style.setProperty('--color-primary-light', palet.primaryLight);
  root.style.setProperty('--color-accent', palet.accent);
  root.style.setProperty('--color-surface', palet.surface);
  root.style.setProperty('--color-surface-elevated', palet.surfaceElevated);
  root.style.setProperty('--color-text', palet.text);
  root.style.setProperty('--color-text-muted', palet.textMuted);
  root.style.setProperty('--color-border', palet.border);
  root.style.setProperty('--color-footer-bg', palet.footerBg);
  root.style.setProperty('--color-footer-text', palet.footerText);
}

export function paletiCssVarsTemizle(root: HTMLElement) {
  for (const v of TEMA_CSS_VARS) {
    root.style.removeProperty(v);
  }
}
