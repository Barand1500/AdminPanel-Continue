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

/** Google Maps paylaşım linkini iframe embed URL'sine çevirir */
export function haritaEmbedUrl(
  urlOrAdres?: string | null,
  lat?: string | null,
  lng?: string | null,
  zoom = 14
): string {
  const raw = (urlOrAdres ?? '').trim();
  if (!raw && lat && lng) {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${zoom}&output=embed`;
  }
  if (!raw) return '';

  if (raw.includes('/maps/embed') || raw.includes('output=embed')) {
    return raw;
  }

  if (/^google\.com/i.test(raw) || raw === 'www.google.com') {
    return '';
  }

  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    const q = u.searchParams.get('q');
    if (q) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }
    const atMatch = raw.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return `https://www.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=${zoom}&output=embed`;
    }
    const placeMatch = raw.match(/\/maps\/place\/([^/?]+)/);
    if (placeMatch) {
      return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')))}&output=embed`;
    }
  } catch {
    /* düz metin adres */
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(raw)}&output=embed`;
}

export function youtubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
  ];
  let videoId: string | null = null;
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      videoId = match[1];
      break;
    }
  }
  if (!videoId) return null;

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (typeof window !== 'undefined') {
    params.set('origin', window.location.origin);
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function linkKartIkonu(ikon?: string | null): string {
  const t = (ikon ?? '').trim();
  if (!t || t.length > 8 || /\s/.test(t) || /[a-zA-Z0-9]{3,}/.test(t)) {
    return '👤';
  }
  return t;
}
