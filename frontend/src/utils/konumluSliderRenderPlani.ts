import type { Widget } from '@/types/site';
import type { KonumluSliderKayit } from '@/types/konumluSlider';
import type { WidgetYerlesimBolge } from '@/types/widget';
import { idString } from '@/utils/idKarsilastir';
import { bolgeWidgetlari, bolgeNormalize } from '@/utils/widgetYerlesim';
import { ustAltSliderlar, yanKonumMu } from '@/utils/konumluSliderYerlesim';

function bolgeEsitMi(kayitli: string | undefined, bolge: WidgetYerlesimBolge) {
  return bolgeNormalize(kayitli) === bolgeNormalize(bolge);
}

export type KonumluSliderRenderOge =
  | { tip: 'widget'; widget: Widget }
  | { tip: 'yan-grup'; taraf: 'sol' | 'sag'; slider: KonumluSliderKayit; widgetlar: Widget[] }
  | { tip: 'ust-alt'; konum: 'ust' | 'alt'; slider: KonumluSliderKayit; widget: Widget };

interface YanGrupBilgi {
  slider: KonumluSliderKayit;
  taraf: 'sol' | 'sag';
  widgetIds: string[];
  baslangicIdx: number;
}

function yanGruplariHazirla(
  sliderlar: KonumluSliderKayit[],
  liste: Widget[],
  bolge: WidgetYerlesimBolge
): YanGrupBilgi[] {
  const gruplar: YanGrupBilgi[] = [];

  for (const slider of sliderlar) {
    const cfg = slider.configJson;
    if (!cfg || !slider.aktif || !yanKonumMu(cfg.yerlesim.tip) || !bolgeEsitMi(cfg.yerlesim.bolge, bolge)) {
      continue;
    }

    const ids = cfg.yerlesim.hedefWidgetIds
      .map(idString)
      .filter((id) => liste.some((w) => idString(w.id) === id));
    if (ids.length === 0) continue;

    const indeksler = [...new Set(
      ids
        .map((id) => liste.findIndex((w) => idString(w.id) === id))
        .filter((i) => i >= 0)
    )].sort((a, b) => a - b);

    if (indeksler.length === 0) continue;

    let ardışık = true;
    for (let i = 1; i < indeksler.length; i++) {
      if (indeksler[i] !== indeksler[i - 1] + 1) {
        ardışık = false;
        break;
      }
    }
    if (!ardışık) continue;

    const siraliIds = indeksler.map((idx) => idString(liste[idx].id));

    gruplar.push({
      slider,
      taraf: cfg.yerlesim.tip === 'widget-sol' ? 'sol' : 'sag',
      widgetIds: siraliIds,
      baslangicIdx: indeksler[0],
    });
  }

  return gruplar.sort((a, b) => a.baslangicIdx - b.baslangicIdx);
}

export function bolgeRenderPlani(
  widgetlar: Widget[],
  sliderlar: KonumluSliderKayit[],
  bolge: WidgetYerlesimBolge
): KonumluSliderRenderOge[] {
  const liste = bolgeWidgetlari(widgetlar, bolge);
  if (liste.length === 0) return [];

  const yanGruplar = yanGruplariHazirla(sliderlar, liste, bolge);
  const yanKapsanan = new Set<string>();
  for (const g of yanGruplar) {
    for (const id of g.widgetIds) yanKapsanan.add(id);
  }

  const sonuc: KonumluSliderRenderOge[] = [];
  const islenenYan = new Set<string>();

  for (let i = 0; i < liste.length; i++) {
    const widget = liste[i];
    const wId = idString(widget.id);

    const yanGrup = yanGruplar.find(
      (g) => g.baslangicIdx === i && !islenenYan.has(g.slider.id)
    );
    if (yanGrup) {
      islenenYan.add(yanGrup.slider.id);
      const grupWidgetlar = liste.filter((w) => yanGrup.widgetIds.includes(idString(w.id)));
      sonuc.push({
        tip: 'yan-grup',
        taraf: yanGrup.taraf,
        slider: yanGrup.slider,
        widgetlar: grupWidgetlar,
      });
      continue;
    }

    if (yanKapsanan.has(wId)) continue;

    const ustSliderlar = ustAltSliderlar(sliderlar, wId, bolge).filter(
      (s) => s.configJson?.yerlesim.tip === 'widget-ustu'
    );
    for (const s of ustSliderlar) {
      sonuc.push({ tip: 'ust-alt', konum: 'ust', slider: s, widget });
    }

    sonuc.push({ tip: 'widget', widget });

    const altSliderlar = ustAltSliderlar(sliderlar, wId, bolge).filter(
      (s) => s.configJson?.yerlesim.tip === 'widget-alti'
    );
    for (const s of altSliderlar) {
      sonuc.push({ tip: 'ust-alt', konum: 'alt', slider: s, widget });
    }
  }

  return sonuc;
}
