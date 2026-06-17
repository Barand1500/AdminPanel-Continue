import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function ZamanCizelgesiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const ogeler = cfg.timeline ?? [];
  if (ogeler.length === 0) return null;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mx-auto max-w-3xl text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mt-3 text-slate-600">{widget.aciklama}</p>}
      </div>
      <ol className="relative mx-auto mt-12 max-w-2xl border-l-2 border-primary/30 pl-8">
        {ogeler.map((o, i) => (
          <li key={o.id} className={`relative ${i < ogeler.length - 1 ? 'pb-10' : ''}`}>
            <span className="absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md">
              {i + 1}
            </span>
            <time className="text-sm font-bold text-primary">{o.tarih}</time>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{o.baslik}</h3>
            {o.aciklama && <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.aciklama}</p>}
          </li>
        ))}
      </ol>
    </WidgetKabuk>
  );
}
