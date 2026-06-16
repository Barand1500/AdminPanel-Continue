import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

export function SayacBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const sayaclar = cfg.sayaclar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mb-10 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {sayaclar.map((s) => (
          <div key={s.id} className="text-center">
            <p className="text-4xl font-bold text-primary">
              {String(s.deger).padStart(2, '0')}
              {s.sonEk}
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-600">{s.etiket}</p>
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
