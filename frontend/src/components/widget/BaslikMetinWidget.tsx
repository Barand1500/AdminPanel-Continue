import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function BaslikMetinWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);
  const hizalama = cfg.gorunum?.hizalama ?? 'sol';
  const alignClass = hizalama === 'orta' ? 'text-center' : hizalama === 'sag' ? 'text-right' : 'text-left';

  if (gt === 'sol-cizgi') {
    return (
      <WidgetKabuk widget={widget}>
        <div className={`bm-sol-cizgi border-l-4 border-violet-600 pl-6 ${alignClass}`}>
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} font-bold text-violet-950`}>{widget.baslik}</h2>
          )}
          {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'hero-buyuk') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bm-hero-buyuk rounded-2xl bg-slate-900 px-8 py-14 text-center text-white md:px-16">
          {widget.baslik && (
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{widget.baslik}</h2>
          )}
          {cfg.metin && <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-slate-300">{cfg.metin}</p>}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'okyanus-kutu') {
    return (
      <WidgetKabuk widget={widget}>
        <div className={`bm-okyanus-kutu rounded-2xl border border-blue-200 bg-gradient-to-br from-sky-50 to-blue-100 p-8 ${alignClass}`}>
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-blue-900`}>{widget.baslik}</h2>}
          {cfg.metin && <p className="mt-4 whitespace-pre-line text-blue-800/90">{cfg.metin}</p>}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-badge') {
    return (
      <WidgetKabuk widget={widget}>
        <div className={alignClass}>
          {widget.altBaslik && (
            <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase text-white">
              {widget.altBaslik}
            </span>
          )}
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} mt-3 font-bold text-slate-900`}>{widget.baslik}</h2>
          )}
          {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'yesil-minimal') {
    return (
      <WidgetKabuk widget={widget}>
        <div className={`bm-yesil-minimal border-l-2 border-emerald-400 pl-4 ${alignClass}`}>
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-semibold text-emerald-950`}>{widget.baslik}</h2>}
          {cfg.metin && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-emerald-800">{cfg.metin}</p>}
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className={`bm-duz-paragraf ${alignClass}`}>
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: 'var(--widget-baslik-renk)' }}>
            {widget.baslik}
          </h2>
        )}
        {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
      </div>
    </WidgetKabuk>
  );
}
