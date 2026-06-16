import type { Widget } from '@/types/site';
import { WidgetRender } from '@/components/widget/WidgetAlani';
import { bolgeWidgetlari, popupWidgetlari } from '@/utils/widgetYerlesim';
import type { WidgetYerlesimBolge } from '@/types/widget';

export function WidgetBolge({ widgetlar, bolge }: { widgetlar: Widget[]; bolge: WidgetYerlesimBolge }) {
  const liste = bolgeWidgetlari(widgetlar, bolge);
  if (liste.length === 0) return null;
  return (
    <>
      {liste.map((widget) => (
        <WidgetRender key={widget.id} widget={widget} />
      ))}
    </>
  );
}

export function PopupWidgetlar({ widgetlar }: { widgetlar: Widget[] }) {
  const popuplar = popupWidgetlari(widgetlar);
  return (
    <>
      {popuplar.map((widget) => (
        <WidgetRender key={widget.id} widget={widget} />
      ))}
    </>
  );
}
