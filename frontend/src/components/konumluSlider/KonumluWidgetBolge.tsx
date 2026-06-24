import { Fragment } from 'react';
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

function ustAltSliderSinifi(
  konum: 'ust' | 'alt',
  config: KonumluSliderKayit['configJson']
) {
  return `ks-ust-alt-arasi ks-ust-alt-arasi--${konum} ${boslukSinifi(config?.bosluk)}`;
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
          const zUst = oge.slider.configJson?.gorunum?.zIndex === 'ust';
          const tarafSinif = oge.taraf === 'sol' ? 'ks-yan-sarmal--sol' : 'ks-yan-sarmal--sag';
          const zSinif = zUst ? 'ks-yan-sarmal--z-ust' : 'ks-yan-sarmal--z-alt';

          return (
            <div
              key={`yan-${oge.slider.id}-${idx}`}
              className={`ks-yan-sarmal ${tarafSinif} ${zSinif} ks-yon--${yon}`}
            >
              <aside className="ks-yan-kolon" aria-label={oge.slider.ad}>
                <KonumluSliderRender slider={oge.slider} />
              </aside>
              <div className="ks-yan-akis">
                {oge.widgetlar.map((w) => (
                  <WidgetRender key={w.id} widget={w} />
                ))}
              </div>
            </div>
          );
        }

        const sliderKey = `${oge.konum}-${oge.slider.id}-${oge.widget.id}`;

        if (oge.konum === 'ust') {
          return (
            <Fragment key={sliderKey}>
              <div className={ustAltSliderSinifi('ust', oge.slider.configJson)}>
                <KonumluSliderRender slider={oge.slider} />
              </div>
              <WidgetRender widget={oge.widget} />
            </Fragment>
          );
        }

        return (
          <Fragment key={sliderKey}>
            <WidgetRender widget={oge.widget} />
            <div className={ustAltSliderSinifi('alt', oge.slider.configJson)}>
              <KonumluSliderRender slider={oge.slider} />
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
