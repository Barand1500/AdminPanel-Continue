import type { Widget } from '@/types/site';
import type { KonumluSliderKayit } from '@/types/konumluSlider';
import type { WidgetYerlesimBolge } from '@/types/widget';
import { WidgetRender } from '@/components/widget/WidgetAlani';
import { KonumluSliderRender } from '@/components/konumluSlider/KonumluSliderRender';
import { bolgeRenderPlani } from '@/utils/konumluSliderRenderPlani';
import { boslukSinifi } from '@/utils/konumluSliderYerlesim';

interface KonumluWidgetBolgeProps {
  widgetlar: Widget[];
  bolge: WidgetYerlesimBolge;
  konumluSliderlar?: KonumluSliderKayit[];
}

export function KonumluWidgetBolge({
  widgetlar,
  bolge,
  konumluSliderlar = [],
}: KonumluWidgetBolgeProps) {
  const plan = bolgeRenderPlani(widgetlar, konumluSliderlar, bolge);
  if (plan.length === 0) return null;

  return (
    <>
      {plan.map((oge, idx) => {
        if (oge.tip === 'widget') {
          return <WidgetRender key={oge.widget.id} widget={oge.widget} />;
        }

        if (oge.tip === 'yan-grup') {
          const yon = oge.slider.configJson?.yon ?? 'dikey';
          const tarafSinif = oge.taraf === 'sol' ? 'ks-yan-wrap--sol' : 'ks-yan-wrap--sag';
          return (
            <div
              key={`yan-${oge.slider.id}-${idx}`}
              className={`ks-yan-wrap ${tarafSinif} ks-yon--${yon}`}
            >
              <div className="ks-yan-slider">
                <KonumluSliderRender slider={oge.slider} />
              </div>
              <div className="ks-yan-widgetlar">
                {oge.widgetlar.map((w) => (
                  <WidgetRender key={w.id} widget={w} />
                ))}
              </div>
            </div>
          );
        }

        const bosluk = oge.slider.configJson?.bosluk;
        const boslukCls = boslukSinifi(bosluk);
        if (oge.konum === 'ust') {
          return (
            <div key={`ust-${oge.slider.id}-${oge.widget.id}`} className={`ks-ust-alt-wrap ${boslukCls}`}>
              <KonumluSliderRender slider={oge.slider} />
              <WidgetRender widget={oge.widget} />
            </div>
          );
        }

        return (
          <div key={`alt-${oge.slider.id}-${oge.widget.id}`} className={`ks-ust-alt-wrap ${boslukCls}`}>
            <WidgetRender widget={oge.widget} />
            <KonumluSliderRender slider={oge.slider} />
          </div>
        );
      })}
    </>
  );
}
