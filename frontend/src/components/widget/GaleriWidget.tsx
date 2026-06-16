import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

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
        {galeri.map((g) => (
          <figure key={g.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className={gorselSinifi(cfg)} />}
            {g.baslik && <figcaption className="p-3 text-sm font-medium text-slate-700">{g.baslik}</figcaption>}
          </figure>
        ))}
      </div>
    </WidgetKabuk>
  );
}
