import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function ZamanCizelgesiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const ogeler = cfg.timeline ?? [];
  if (ogeler.length === 0) return null;

  const gt = widgetGorunumTipiAl(widget);

  if (gt === 'kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="mx-auto max-w-3xl text-center">
          {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ogeler.map((o, i) => (
            <article key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold text-primary">{o.tarih}</span>
              <h3 className="mt-1 font-semibold text-slate-900">{o.baslik}</h3>
              {o.aciklama && <p className="mt-2 text-sm text-slate-600">{o.aciklama}</p>}
              <span className="mt-3 inline-block text-xs text-slate-400">#{i + 1}</span>
            </article>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'yatay') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="mx-auto max-w-3xl text-center">
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-slate-900`}>{widget.baslik}</h2>}
        </div>
        <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
          {ogeler.map((o, i) => (
            <div key={o.id} className="min-w-[200px] flex-shrink-0 rounded-xl border border-slate-200 bg-white p-4 text-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{i + 1}</span>
              <time className="mt-2 block text-xs font-bold text-primary">{o.tarih}</time>
              <h3 className="mt-1 text-sm font-semibold">{o.baslik}</h3>
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

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
