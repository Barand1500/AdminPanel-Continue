import type { Widget } from '@/types/site';
import type {
  KonumluSliderBolge,
  KonumluSliderConfig,
  KonumluSliderKayit,
  KonumluSliderKonumTipi,
} from '@/types/konumluSlider';
import { idString } from '@/utils/idKarsilastir';
import { bolgeWidgetlari } from '@/utils/widgetYerlesim';

export interface YerlesimOnizlemeOgesi {
  id: string;
  tip: 'header' | 'footer' | 'widget';
  widget?: Widget;
  bolge: KonumluSliderBolge;
  sira: number;
}

export interface KonumSecimNoktasi {
  tip: KonumluSliderKonumTipi;
  bolge: KonumluSliderBolge;
  widgetId: string | null;
  widgetAd?: string;
  widgetSira: number;
}

export function yanKonumMu(tip: KonumluSliderKonumTipi) {
  return tip === 'widget-sol' || tip === 'widget-sag';
}

export function ustAltKonumMu(tip: KonumluSliderKonumTipi) {
  return tip === 'widget-ustu' || tip === 'widget-alti';
}

const ANA_SAYFA_BOLGELERI = ['header_alti', 'slider_alti', 'icerik_alani', 'footer_ustu'] as const;
const DINAMIK_SAYFA_BOLGELERI = ['sayfa_ustu', 'sayfa_alti'] as const;

export function sayfaOnizlemeOgeleri(widgetlar: Widget[], anaSayfaMi = false): YerlesimOnizlemeOgesi[] {
  const ogeler: YerlesimOnizlemeOgesi[] = [
    { id: '__header', tip: 'header', bolge: 'header', sira: 0 },
  ];

  const bolgeler = anaSayfaMi ? ANA_SAYFA_BOLGELERI : DINAMIK_SAYFA_BOLGELERI;
  let sira = 1;
  for (const bolge of bolgeler) {
    const liste = bolgeWidgetlari(widgetlar, bolge);
    for (const w of liste) {
      ogeler.push({
        id: w.id,
        tip: 'widget',
        widget: w,
        bolge,
        sira: sira++,
      });
    }
  }

  ogeler.push({ id: '__footer', tip: 'footer', bolge: 'footer', sira: sira++ });
  return ogeler;
}

export function widgetBolgeSirasi(widgetlar: Widget[], widgetId: string, bolge: KonumluSliderBolge): number {
  if (bolge === 'header' || bolge === 'footer') return -1;
  const liste = bolgeWidgetlari(widgetlar, bolge as import('@/types/widget').WidgetYerlesimBolge);
  return liste.findIndex((w) => idString(w.id) === idString(widgetId));
}

export function bitisikWidgetIndeksleri(indeksler: number[]): boolean {
  if (indeksler.length <= 1) return true;
  const sirali = [...indeksler].sort((a, b) => a - b);
  for (let i = 1; i < sirali.length; i++) {
    if (sirali[i] !== sirali[i - 1] + 1) return false;
  }
  return true;
}

export function secimNoktalariUyumlu(mevcut: KonumSecimNoktasi[], yeni: KonumSecimNoktasi): boolean {
  if (mevcut.length === 0) return true;
  const ilk = mevcut[0];

  if (yeni.tip !== ilk.tip) return false;
  if (yeni.bolge !== ilk.bolge) return false;

  if (!yanKonumMu(yeni.tip)) {
    return mevcut.length === 0;
  }

  const tum = [...mevcut, yeni];
  const indeksler = tum
    .filter((n) => n.widgetId)
    .map((n) => n.widgetSira)
    .filter((i) => i >= 0);
  return bitisikWidgetIndeksleri(indeksler);
}

export function secimdenHedefWidgetIds(secimler: KonumSecimNoktasi[]): string[] {
  return secimler
    .map((s) => s.widgetId)
    .filter((id): id is string => Boolean(id))
    .map(idString);
}

export function konumluSliderlarSayfaFiltre(
  sliderlar: KonumluSliderKayit[],
  sayfaId: string | null
): KonumluSliderKayit[] {
  const anahtar = sayfaId ? idString(sayfaId) : '';
  return sliderlar.filter((s) => {
    const sSayfa = s.sayfaId ? idString(s.sayfaId) : '';
    return sSayfa === anahtar;
  });
}

export function yanSliderGruplari(
  sliderlar: KonumluSliderKayit[],
  widgetlar: Widget[],
  bolge: KonumluSliderBolge
): Map<string, { slider: KonumluSliderKayit; widgetIds: string[]; taraf: 'sol' | 'sag' }> {
  const map = new Map<string, { slider: KonumluSliderKayit; widgetIds: string[]; taraf: 'sol' | 'sag' }>();
  const liste =
    bolge === 'sayfa_ustu' || bolge === 'sayfa_alti'
      ? bolgeWidgetlari(widgetlar, bolge)
      : [];

  for (const slider of sliderlar) {
    const cfg = slider.configJson;
    if (!cfg || !yanKonumMu(cfg.yerlesim.tip) || cfg.yerlesim.bolge !== bolge) continue;
    const ids = cfg.yerlesim.hedefWidgetIds.filter((id) => liste.some((w) => idString(w.id) === idString(id)));
    if (ids.length === 0) continue;
    map.set(slider.id, {
      slider,
      widgetIds: ids,
      taraf: cfg.yerlesim.tip === 'widget-sol' ? 'sol' : 'sag',
    });
  }
  return map;
}

export function ustAltSliderlar(
  sliderlar: KonumluSliderKayit[],
  widgetId: string,
  bolge: KonumluSliderBolge
): KonumluSliderKayit[] {
  return sliderlar.filter((s) => {
    const cfg = s.configJson;
    if (!cfg || !ustAltKonumMu(cfg.yerlesim.tip)) return false;
    if (cfg.yerlesim.bolge !== bolge) return false;
    return cfg.yerlesim.hedefWidgetIds.some((id) => idString(id) === idString(widgetId));
  });
}

export function headerFooterSliderlar(
  sliderlar: KonumluSliderKayit[],
  tip: 'header-ustu' | 'header-alti' | 'footer-ustu' | 'footer-alti'
): KonumluSliderKayit[] {
  return sliderlar.filter((s) => s.configJson?.yerlesim.tip === tip);
}

export function boslukSinifi(bosluk?: KonumluSliderConfig['bosluk']) {
  if (bosluk === 'kucuk') return 'ks-bosluk--kucuk';
  if (bosluk === 'buyuk') return 'ks-bosluk--buyuk';
  return 'ks-bosluk--orta';
}
