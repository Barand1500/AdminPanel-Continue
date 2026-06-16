import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

export function GorselGridBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.gridKartlar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;

  return (
    <WidgetKabuk widget={widget}>
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {cfg.solBaslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-slate-900`}>{cfg.solBaslik}</h2>}
          {cfg.solAciklama && <p className="mt-3 text-sm text-slate-600">{cfg.solAciklama}</p>}
          {(cfg.filtreler ?? []).length > 0 && (
            <div className="mt-4 space-y-2">
              {cfg.filtreler!.map((f) => (
                <div key={f} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{f}</div>
              ))}
            </div>
          )}
        </div>
        <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {kartlar.map((k) => (
            <a key={k.id} href={k.link || '#'} className="group relative overflow-hidden rounded-xl">
              {k.gorselUrl && (
                <img src={medyaUrl(k.gorselUrl)} alt="" className={`aspect-square w-full ${gorselSinifi(cfg)}`} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <span className="text-sm font-semibold text-white">{k.etiket}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </WidgetKabuk>
  );
}
