import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

export function GorselEtiketKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.etiketKartlar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
      <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((k) => (
          <a key={k.id} href={k.link || '#'} className="group overflow-hidden rounded-xl bg-white shadow-sm">
            {k.gorselUrl && (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className={`h-full w-full ${gorselSinifi(cfg)}`} />
              </div>
            )}
            <div className="border-t border-slate-100 bg-white px-4 py-3 text-center">
              <span className="text-sm font-semibold text-slate-800">{k.etiket}</span>
            </div>
          </a>
        ))}
      </div>
    </WidgetKabuk>
  );
}
