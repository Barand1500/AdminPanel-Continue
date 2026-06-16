import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

interface ReferanslarWidgetProps {
  widget: Widget;
}

export function ReferanslarWidget({ widget }: ReferanslarWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const referanslar = cfg.referanslar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} text-center font-bold`}>{widget.baslik}</h2>}
      <div className="mt-10 grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {referanslar.map((referans) => (
          <div
            key={referans}
            className="flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600"
          >
            {referans}
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
