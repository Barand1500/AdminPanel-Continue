import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

function galeriOgeIcerik(g: { gorselUrl: string; baslik: string }, cfg: ReturnType<typeof configOkuFromWidget>) {
  return (
    <>
      {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className={gorselSinifi(cfg)} />}
      {g.baslik && <figcaption className="p-3 text-sm font-medium text-slate-700">{g.baslik}</figcaption>}
    </>
  );
}

export function GaleriWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const galeri = cfg.galeri ?? [];
  const duzen = cfg.galeriDuzeni ?? 'grid';
  const layoutClass =
    duzen === 'alt_alta' ? 'flex flex-col gap-4' :
    duzen === 'yan_yana' ? 'flex flex-wrap gap-4' :
    'grid gap-4';

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold`}>{widget.baslik}</h2>}
      <div className={layoutClass} style={duzen === 'grid' ? gridStyle(cfg) : undefined}>
        {galeri.map((g) => {
          const icerik = galeriOgeIcerik(g, cfg);
          const link = g.link?.trim();
          if (link) {
            const href = link.startsWith('http') || link.startsWith('/') ? link : `https://${link}`;
            const dis = href.startsWith('http');
            return (
              <a
                key={g.id}
                href={href}
                className="block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                {...(dis ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {icerik}
              </a>
            );
          }
          return (
            <figure key={g.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
              {icerik}
            </figure>
          );
        })}
      </div>
    </WidgetKabuk>
  );
}
