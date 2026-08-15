import type { Widget } from '@/types/site';
import { kurumsalHeroConfigOku } from '@/types/kurumsalHero';
import { kurumsalHeroProxyMi } from '@/utils/kurumsalHeroProxy';
import { anaSayfaWidgetlari, sayfaWidgetlari } from '@/utils/widgetYerlesim';

export function kurumsalHeroWidgetMi(widget: Widget): boolean {
  return widget.tip === 'KURUMSAL_HERO' || kurumsalHeroProxyMi(widget);
}

export function kurumsalHeroWidgetVarMi(widgetlar: Widget[]): boolean {
  return widgetlar.some((w) => w.aktif && kurumsalHeroWidgetMi(w));
}

/** Sayfadaki ilk aktif Kurumsal Hero widget'ını bulur (proxy SLIDER dahil). */
export function kurumsalHeroSayfaWidgetBul(widgetlar: Widget[], sayfaId: string | null): Widget | undefined {
  const liste = sayfaId ? sayfaWidgetlari(widgetlar, sayfaId) : anaSayfaWidgetlari(widgetlar);
  return liste.find((w) => w.aktif && kurumsalHeroWidgetMi(w));
}

export function kurumsalHeroOverlayAyarlariBul(widget: Widget | undefined) {
  if (!widget) return null;
  const kh = kurumsalHeroConfigOku(widget.configJson);
  if (!kh.headerOverlay) return null;
  return {
    yukseklik: kh.gorunum.yukseklik ?? '85vh',
    ustBantGoster: kh.ustBantGoster,
  };
}
