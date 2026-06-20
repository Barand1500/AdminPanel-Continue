import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget, haritaEmbedUrl } from './widgetHelpers';

export function HaritaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const src = haritaEmbedUrl(cfg.haritaUrl, cfg.haritaLat, cfg.haritaLng, cfg.haritaZoom ?? 14);
  if (!src) return null;

  const gt = widgetGorunumTipiAl(widget);
  const iframeClass =
    gt === 'kart-golge'
      ? 'h-72 w-full rounded-2xl border border-slate-200 shadow-lg'
      : 'h-80 w-full rounded-xl border-0';

  if (gt === 'bolunmus-bilgi') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            {widget.baslik && <h2 className="section-title mb-3">{widget.baslik}</h2>}
            {widget.aciklama && <p className="text-slate-600">{widget.aciklama}</p>}
          </div>
          <iframe
            title="Harita"
            src={src}
            className={iframeClass}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && gt !== 'klasik' && <h2 className="section-title mb-4">{widget.baslik}</h2>}
      <iframe
        title="Harita"
        src={src}
        className={iframeClass}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </WidgetKabuk>
  );
}
