import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetYerlesim, WidgetYerlesimBolge } from '@/types/widget';

export const WIDGET_YERLESIM_BOLGELERI: { id: WidgetYerlesimBolge; etiket: string; aciklama: string }[] = [
  { id: 'header_alti', etiket: 'Header altı', aciklama: 'Menünün hemen altında' },
  { id: 'slider_alti', etiket: 'Slider / Hero altı', aciklama: 'Ana banner ve güven şeridinin altında' },
  { id: 'urunler_ustu', etiket: 'Ürünler üstü', aciklama: 'Ürün listesinden önce' },
  { id: 'urunler_alti', etiket: 'Ürünler altı', aciklama: 'Ürün listesinden sonra (varsayılan)' },
  { id: 'footer_ustu', etiket: 'Footer üstü', aciklama: 'Sayfa sonunda, footer’dan önce' },
];

export const VARSAYILAN_YERLESIM: WidgetYerlesim = { bolge: 'urunler_alti' };

export function yerlesimOku(widget: Widget): WidgetYerlesim {
  const cfg = (widget.configJson ?? {}) as WidgetConfig;
  const y = cfg.yerlesim;
  if (!y?.bolge) return VARSAYILAN_YERLESIM;
  return {
    bolge: y.bolge,
    hedefWidgetId: y.hedefWidgetId,
    konum: y.konum,
  };
}

export function yerlesimEtiketi(yerlesim: WidgetYerlesim, widgetAdlari?: Map<string, string>) {
  if (yerlesim.hedefWidgetId && yerlesim.konum) {
    const ad = widgetAdlari?.get(yerlesim.hedefWidgetId) ?? 'Widget';
    return yerlesim.konum === 'once' ? `${ad} üstüne` : `${ad} altına`;
  }
  return WIDGET_YERLESIM_BOLGELERI.find((b) => b.id === yerlesim.bolge)?.etiket ?? yerlesim.bolge;
}

/** Bölge + göreli konum + sıra ile render sırası */
export function widgetlariSirala(widgetlar: Widget[]): Widget[] {
  const aktif = widgetlar.filter((w) => w.aktif && w.tip !== 'POPUP');
  const idSet = new Set(aktif.map((w) => w.id));
  const sirali = [...aktif].sort((a, b) => a.sira - b.sira);

  const sonuc: Widget[] = [];
  const eklendi = new Set<string>();

  function ekle(w: Widget) {
    if (eklendi.has(w.id)) return;
    sonuc.push(w);
    eklendi.add(w.id);
  }

  for (const w of sirali) {
    const y = yerlesimOku(w);
    if (y.hedefWidgetId && y.konum && idSet.has(y.hedefWidgetId)) continue;
    ekle(w);
  }

  for (const w of sirali) {
    const y = yerlesimOku(w);
    if (!y.hedefWidgetId || !y.konum || !idSet.has(y.hedefWidgetId)) continue;
    const hedefIdx = sonuc.findIndex((x) => x.id === y.hedefWidgetId);
    if (hedefIdx === -1) {
      ekle(w);
      continue;
    }
    const idx = y.konum === 'once' ? hedefIdx : hedefIdx + 1;
    if (!eklendi.has(w.id)) {
      sonuc.splice(idx, 0, w);
      eklendi.add(w.id);
    }
  }

  for (const w of sirali) {
    ekle(w);
  }

  return sonuc;
}

export function bolgeWidgetlari(widgetlar: Widget[], bolge: WidgetYerlesimBolge): Widget[] {
  return widgetlariSirala(widgetlar).filter((w) => yerlesimOku(w).bolge === bolge);
}

export function popupWidgetlari(widgetlar: Widget[]): Widget[] {
  return widgetlar.filter((w) => w.aktif && w.tip === 'POPUP');
}
