import { Fragment } from 'react';
import type { Widget } from '@/types/site';
import type { KonumluSliderKayit } from '@/types/konumluSlider';
import type { WidgetYerlesimBolge } from '@/types/widget';
import { WidgetRender } from '@/components/widget/WidgetAlani';
import { KonumluSliderRender } from '@/components/konumluSlider/KonumluSliderRender';
import { YanSliderGrup } from '@/components/konumluSlider/YanSliderGrup';
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
            <YanSliderGrup
              key={`yan-${oge.slider.id}-${idx}`}
              tarafSinif={tarafSinif}
              zSinif={zSinif}
              yonSinif={`ks-yon--${yon}`}
              sliderAd={oge.slider.ad}
              slider={
                <KonumluSliderRender
                  slider={oge.slider}
                  sinif={yon === 'dikey' ? 'ks-slider--yan-dolgu' : ''}
                />
              }
            >
              {oge.widgetlar.map((w) => (
                <WidgetRender key={w.id} widget={w} />
              ))}
            </YanSliderGrup>
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
