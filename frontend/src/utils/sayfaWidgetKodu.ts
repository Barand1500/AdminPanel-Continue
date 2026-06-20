import { sayfaDuzenEtiketiKaldir } from '@/utils/sayfaIcerikIsle';
import { idString } from '@/utils/idKarsilastir';

export const WIDGET_YERLESTIR_ETIKET = /<!--\s*@widget:([\w-]+)\s*-->/g;
export const WIDGET_STIL_ETIKET = /<!--\s*@widget-stil:([\w-]+)\s*-->\s*<style[^>]*>([\s\S]*?)<\/style>/gi;

export interface SayfaIcerikParca {
  tip: 'html' | 'widget';
  icerik?: string;
  widgetId?: string;
}

export function sayfaGomuluWidgetIdleri(html: string): Set<string> {
  const ids = new Set<string>();
  for (const eslesme of html.matchAll(WIDGET_YERLESTIR_ETIKET)) {
    ids.add(idString(eslesme[1]));
  }
  return ids;
}

export function sayfaWidgetStilBloklariniKaldir(html: string): string {
  return html.replace(WIDGET_STIL_ETIKET, '').trim();
}

export function sayfaIcerikParcala(html: string): SayfaIcerikParca[] {
  const temiz = sayfaWidgetStilBloklariniKaldir(sayfaDuzenEtiketiKaldir(html));
  if (!temiz.trim()) return [];

  const parcalar: SayfaIcerikParca[] = [];
  const regex = new RegExp(WIDGET_YERLESTIR_ETIKET.source, 'g');
  let son = 0;
  let eslesme: RegExpExecArray | null;

  while ((eslesme = regex.exec(temiz)) !== null) {
    if (eslesme.index > son) {
      const parca = temiz.slice(son, eslesme.index).trim();
      if (parca) parcalar.push({ tip: 'html', icerik: parca });
    }
    parcalar.push({ tip: 'widget', widgetId: idString(eslesme[1]) });
    son = eslesme.index + eslesme[0].length;
  }

  const kalan = temiz.slice(son).trim();
  if (kalan) parcalar.push({ tip: 'html', icerik: kalan });

  return parcalar.length > 0 ? parcalar : [{ tip: 'html', icerik: temiz }];
}

export function sayfaWidgetStilleriCikar(html: string): { widgetId: string; css: string }[] {
  const liste: { widgetId: string; css: string }[] = [];
  const regex = new RegExp(WIDGET_STIL_ETIKET.source, 'gi');
  let eslesme: RegExpExecArray | null;
  while ((eslesme = regex.exec(html)) !== null) {
    liste.push({ widgetId: idString(eslesme[1]), css: eslesme[2].trim() });
  }
  return liste;
}

export function sayfaWidgetYerlestirEtiketi(widgetId: string): string {
  return `<!-- @widget:${idString(widgetId)} -->`;
}

export function sayfaWidgetStilBlogu(widgetId: string, widgetAd: string): string {
  const id = idString(widgetId);
  return `<!-- @widget-stil:${id} -->
<style data-widget-stil="${id}">
/* ${widgetAd} — widget görünümü */
#sayfa-widget-${id} {
  width: 100%;
}

#sayfa-widget-${id} .widget-bolum {
  max-width: 100%;
}
</style>`;
}

export function sayfaWidgetStilBloguBul(html: string, widgetId: string): number {
  const id = idString(widgetId);
  const aranan = `<!-- @widget-stil:${id} -->`;
  return html.indexOf(aranan);
}

export function sayfaWidgetStilBloguGuncelle(html: string, widgetId: string, widgetAd: string): string {
  const id = idString(widgetId);
  const regex = new RegExp(
    `<!--\\s*@widget-stil:${id}\\s*-->\\s*<style[^>]*>[\\s\\S]*?<\\/style>`,
    'i',
  );
  if (regex.test(html)) return html;

  const blok = sayfaWidgetStilBlogu(id, widgetAd);
  const temiz = html.trim();
  return temiz ? `${temiz}\n\n${blok}\n` : `${blok}\n`;
}

export function sayfaWidgetYerlestir(html: string, widgetId: string): string {
  const etiket = sayfaWidgetYerlestirEtiketi(widgetId);
  if (html.includes(etiket)) return html;
  const temiz = html.trim();
  return temiz ? `${temiz}\n\n${etiket}\n` : `${etiket}\n`;
}
