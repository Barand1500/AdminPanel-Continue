import { useMemo } from 'react';
import type { Widget } from '@/types/site';
import { idString } from '@/utils/idKarsilastir';
import { sayfaIcerikParcala } from '@/utils/sayfaWidgetKodu';
import { SayfaShadowIcerik } from '@/components/ortak/SayfaShadowIcerik';
import { SayfaWidgetStilleri } from '@/components/ortak/SayfaWidgetStilleri';
import { WidgetRender } from '@/components/widget/WidgetAlani';

interface SayfaIcerikParcalariProps {
  html: string;
  widgetlar: Widget[];
  shadowSinif?: string;
}

export function SayfaIcerikParcalari({ html, widgetlar, shadowSinif }: SayfaIcerikParcalariProps) {
  const parcalar = useMemo(() => sayfaIcerikParcala(html), [html]);
  const widgetHaritasi = useMemo(
    () => new Map(widgetlar.map((w) => [idString(w.id), w])),
    [widgetlar],
  );

  if (parcalar.length === 0) return null;

  return (
    <>
      <SayfaWidgetStilleri html={html} />
      {parcalar.map((parca, index) => {
        if (parca.tip === 'html' && parca.icerik) {
          return (
            <SayfaShadowIcerik
              key={`html-${index}`}
              html={parca.icerik}
              className={shadowSinif}
            />
          );
        }

        if (parca.tip !== 'widget' || !parca.widgetId) return null;
        const widget = widgetHaritasi.get(parca.widgetId);
        if (!widget) return null;

        const wid = idString(widget.id);
        return (
          <div
            key={`widget-${wid}-${index}`}
            id={`sayfa-widget-${wid}`}
            className={`sayfa-widget-yuvasi sayfa-widget-yuvasi-${wid}`}
          >
            <WidgetRender widget={widget} />
          </div>
        );
      })}
    </>
  );
}
