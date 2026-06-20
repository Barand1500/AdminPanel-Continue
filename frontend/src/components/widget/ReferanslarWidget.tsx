import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

interface ReferanslarWidgetProps {
  widget: Widget;
}

export function ReferanslarWidget({ widget }: ReferanslarWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const referanslar = cfg.referanslar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;
  const gt = widgetGorunumTipiAl(widget);

  if (gt === 'quote' && referanslar[0]) {
    return (
      <WidgetKabuk widget={widget}>
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-medium italic leading-relaxed text-slate-700 md:text-3xl">
            &ldquo;{referanslar[0]}&rdquo;
          </p>
        </blockquote>
      </WidgetKabuk>
    );
  }

  const listeSinif =
    gt === 'carousel'
      ? 'mt-10 flex gap-4 overflow-x-auto pb-4'
      : 'mt-10 grid gap-4';

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} text-center font-bold`}>{widget.baslik}</h2>}
      <div className={listeSinif} style={gt === 'carousel' ? undefined : gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {referanslar.map((referans) => (
          <div
            key={referans}
            className={`flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 ${gt === 'carousel' ? 'min-w-[160px] shrink-0' : ''}`}
          >
            {referans}
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
