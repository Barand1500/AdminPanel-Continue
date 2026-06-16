import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumStili } from '@/types/widget';

export function configOkuFromWidget(widget: Widget): WidgetConfig {
  return (widget.configJson ?? {}) as WidgetConfig;
}

export function medyaUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
  const base = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ?? '';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function widgetSectionStyle(widget: Widget) {
  return widgetGorunumStili(widget, configOkuFromWidget(widget));
}

export function widgetSectionClass(widget: Widget, ekSinif?: string) {
  const parts = ['widget-bolum'];
  if (!widget.mobilGoster) parts.push('hidden md:block');
  if (!widget.masaustuGoster) parts.push('md:hidden');
  if (ekSinif) parts.push(ekSinif);
  return parts.join(' ');
}

export function gorselSinifi(cfg: WidgetConfig) {
  const boyut = { kucuk: 'max-h-40', orta: 'max-h-56', buyuk: 'max-h-72', tam: 'w-full' };
  const fit = { kapla: 'object-cover', sigdir: 'object-contain', orijinal: 'object-none' };
  const g = cfg.gorunum ?? {};
  return `${boyut[g.gorselBoyutu ?? 'orta']} ${fit[g.gorselKirpma ?? 'kapla']} w-full rounded-xl`;
}

export function gridStyle(cfg: WidgetConfig): CSSProperties {
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;
  return { gridTemplateColumns: `repeat(${kolon}, minmax(0, 1fr))` };
}
