import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetYerlesim, WidgetYerlesimBolge } from '@/types/widget';
import { idString } from '@/utils/idKarsilastir';
import { sayfaGomuluWidgetIdleri } from '@/utils/sayfaWidgetKodu';

export const ANA_SAYFA_YERLESIM_BOLGELERI: {
  id: WidgetYerlesimBolge;
  etiket: string;
  aciklama: string;
}[] = [
  { id: 'header_alti', etiket: 'Header altı', aciklama: 'Menünün hemen altında' },
  { id: 'slider_alti', etiket: 'Slider / Hero altı', aciklama: 'Ana banner ve güven şeridinin altında' },
  { id: 'icerik_alani', etiket: 'İçerik alanı', aciklama: 'Ana sayfa gövdesi — slider ile footer arası' },
  { id: 'footer_ustu', etiket: 'Footer üstü', aciklama: 'Sayfa sonunda, footer’dan önce' },
];

export const SAYFA_YERLESIM_BOLGELERI: {
  id: WidgetYerlesimBolge;
  etiket: string;
  aciklama: string;
}[] = [
  { id: 'sayfa_ustu', etiket: 'Sayfa üstü', aciklama: 'Sayfa başlığı ve içeriğin üstünde' },
  { id: 'sayfa_alti', etiket: 'Sayfa altı', aciklama: 'Sayfa içeriğinin ve alt sayfa kartlarının altında' },
];

/** @deprecated Admin listesinde kullanılmaz; eski kayıtlar için normalize edilir */
const LEGACY_BOLGE_MAP: Record<string, WidgetYerlesimBolge> = {
  urunler_ustu: 'icerik_alani',
  urunler_alti: 'icerik_alani',
};

export function bolgeNormalize(bolge?: string | null): WidgetYerlesimBolge {
  if (!bolge) return 'icerik_alani';
  return LEGACY_BOLGE_MAP[bolge] ?? (bolge as WidgetYerlesimBolge);
}

export const VARSAYILAN_YERLESIM: WidgetYerlesim = { bolge: 'icerik_alani' };

export function yerlesimOku(widget: Widget): WidgetYerlesim {
  const cfg = (widget.configJson ?? {}) as WidgetConfig;
  const y = cfg.yerlesim;
  if (!y?.bolge) return VARSAYILAN_YERLESIM;
  return {
    bolge: bolgeNormalize(y.bolge),
    hedefWidgetId: y.hedefWidgetId,
    konum: y.konum,
  };
}

export function yerlesimBolgeEtiketi(bolge: WidgetYerlesimBolge): string {
  const tum = [...ANA_SAYFA_YERLESIM_BOLGELERI, ...SAYFA_YERLESIM_BOLGELERI];
  return tum.find((b) => b.id === bolge)?.etiket ?? bolge;
}

export function yerlesimEtiketi(yerlesim: WidgetYerlesim, widgetAdlari?: Map<string, string>) {
  if (yerlesim.hedefWidgetId && yerlesim.konum) {
    const ad = widgetAdlari?.get(yerlesim.hedefWidgetId) ?? 'Widget';
    return yerlesim.konum === 'once' ? `${ad} üstüne` : `${ad} altına`;
  }
  return yerlesimBolgeEtiketi(yerlesim.bolge);
}

export function anaSayfaWidgetlari(widgetlar: Widget[]): Widget[] {
  return widgetlar.filter((w) => !w.sayfaId);
}

export function sayfaWidgetlari(widgetlar: Widget[], sayfaId: string): Widget[] {
  return widgetlar.filter((w) => w.sayfaId && idString(w.sayfaId) === idString(sayfaId));
}

/** HTML içine gömülen widget'lar üst/alt bölgede tekrar gösterilmez */
export function sayfaBolgeWidgetlariHaric(widgetlar: Widget[], html: string): Widget[] {
  const gomulu = sayfaGomuluWidgetIdleri(html);
  if (gomulu.size === 0) return widgetlar;
  return widgetlar.filter((w) => !gomulu.has(idString(w.id)));
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
  const norm = bolgeNormalize(bolge);
  return widgetlariSirala(widgetlar).filter((w) => yerlesimOku(w).bolge === norm);
}

export function popupWidgetlari(widgetlar: Widget[]): Widget[] {
  return widgetlar.filter((w) => w.aktif && w.tip === 'POPUP');
}

export interface WidgetSayfaFiltreOgesi {
  id: string;
  etiket: string;
}

/** Widget listesi için sayfa rozetleri — yalnızca widget atanmış sayfalar */
export function widgetSayfaFiltreOgeleri(
  widgetlar: AdminWidgetLike[],
  sayfaAdlari: Map<string, string>
): WidgetSayfaFiltreOgesi[] {
  const ogeler: WidgetSayfaFiltreOgesi[] = [];
  const anaVar = widgetlar.some((w) => !w.sayfaId);
  if (anaVar) ogeler.push({ id: '__ana__', etiket: 'Ana Sayfa' });

  const sayfaIdleri = new Set<string>();
  for (const w of widgetlar) {
    if (w.sayfaId) sayfaIdleri.add(idString(w.sayfaId));
  }

  for (const sid of sayfaIdleri) {
    ogeler.push({
      id: sid,
      etiket: sayfaAdlari.get(sid) ?? 'Sayfa',
    });
  }

  return ogeler.sort((a, b) => {
    if (a.id === '__ana__') return -1;
    if (b.id === '__ana__') return 1;
    return a.etiket.localeCompare(b.etiket, 'tr');
  });
}

type AdminWidgetLike = { sayfaId?: string | null };

export function widgetSayfaFiltrele(
  widgetlar: AdminWidgetLike[],
  filtreId: string | null
): AdminWidgetLike[] {
  if (!filtreId) return widgetlar;
  if (filtreId === '__ana__') return widgetlar.filter((w) => !w.sayfaId);
  return widgetlar.filter((w) => w.sayfaId && idString(w.sayfaId) === filtreId);
}
