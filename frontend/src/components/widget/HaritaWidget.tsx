import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, haritaEmbedUrl } from './widgetHelpers';

function HaritaIframe({ src, className }: { src: string; className: string }) {
  return (
    <iframe
      title="Harita"
      src={src}
      className={className}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function HaritaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const src = haritaEmbedUrl(cfg.haritaUrl, cfg.haritaLat, cfg.haritaLng, cfg.haritaZoom ?? 14);
  if (!src) return null;

  const gt = widgetGorunumTipiAl(widget);

  if (gt === 'bolunmus-bilgi') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            {widget.baslik && <h2 className="section-title mb-3">{widget.baslik}</h2>}
            {widget.aciklama && <p className="text-slate-600">{widget.aciklama}</p>}
          </div>
          <HaritaIframe src={src} className="h-72 w-full rounded-2xl border border-slate-200 shadow-lg" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'kart-golge') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.baslik && <h2 className="section-title mb-4">{widget.baslik}</h2>}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <HaritaIframe src={src} className="h-80 w-full rounded-xl" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'koyu-cerceve') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} mb-4 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
        )}
        <div className="overflow-hidden rounded-2xl bg-slate-900 p-4 ring-2 ring-slate-700">
          <HaritaIframe src={src} className="h-80 w-full rounded-xl border border-slate-700" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'mint-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="mx-auto max-w-4xl rounded-2xl border border-teal-200 bg-teal-50/60 p-5">
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} mb-4 font-bold text-teal-950`}>{widget.baslik}</h2>
          )}
          {widget.aciklama && <p className="mb-4 text-teal-800">{widget.aciklama}</p>}
          <HaritaIframe src={src} className="h-72 w-full rounded-xl border border-teal-200" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-baslik') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="overflow-hidden rounded-2xl border border-orange-200">
          {(widget.baslik || widget.aciklama) && (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-white">
              {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`}>{widget.baslik}</h2>}
              {widget.aciklama && <p className="mt-2 text-orange-50">{widget.aciklama}</p>}
            </div>
          )}
          <HaritaIframe src={src} className="h-80 w-full border-0" />
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && <h2 className="section-title mb-4">{widget.baslik}</h2>}
      <HaritaIframe src={src} className="h-80 w-full rounded-xl border-0" />
    </WidgetKabuk>
  );
}
