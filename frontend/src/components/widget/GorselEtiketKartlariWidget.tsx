import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

export function GorselEtiketKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.etiketKartlar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;
  const gt = widgetGorunumTipiAl(widget);

  const baslik = widget.baslik ? (
    <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
  ) : null;

  if (gt === 'ust-overlay') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="gek-ust-overlay grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {kartlar.map((k) => (
            <a key={k.id} href={k.link || '#'} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
              {k.gorselUrl && (
                <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className={`h-full w-full ${gorselSinifi(cfg)} opacity-90`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-4 left-4 text-lg font-bold text-white">{k.etiket}</span>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'mor-cerceve') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="gek-mor-cerceve grid gap-4 rounded-2xl border-2 border-violet-300 bg-violet-50/50 p-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {kartlar.map((k) => (
            <a key={k.id} href={k.link || '#'} className="overflow-hidden rounded-xl border-2 border-violet-400 bg-white shadow-sm">
              {k.gorselUrl && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className={`h-full w-full ${gorselSinifi(cfg)}`} />
                </div>
              )}
              <div className="px-3 py-2 text-center text-sm font-semibold text-violet-800">{k.etiket}</div>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'mint-kucuk') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="gek-mint-kucuk flex flex-wrap gap-2">
          {kartlar.map((k) => (
            <a
              key={k.id}
              href={k.link || '#'}
              className="flex w-[calc(50%-0.25rem)] items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 p-2 sm:w-[calc(33.333%-0.34rem)]"
            >
              {k.gorselUrl && (
                <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className="h-12 w-12 shrink-0 rounded object-cover" />
              )}
              <span className="text-xs font-semibold text-teal-900">{k.etiket}</span>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'okyanus-buyuk') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="gek-okyanus-buyuk grid gap-6 sm:grid-cols-2">
          {kartlar.map((k) => (
            <a key={k.id} href={k.link || '#'} className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 shadow-md">
              {k.gorselUrl && (
                <div className="aspect-video overflow-hidden">
                  <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className={`h-full w-full ${gorselSinifi(cfg)}`} />
                </div>
              )}
              <div className="px-4 py-3 text-lg font-bold text-blue-900">{k.etiket}</div>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'korall-hover') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="gek-korall-hover grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {kartlar.map((k) => (
            <a
              key={k.id}
              href={k.link || '#'}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:border-rose-400 hover:shadow-rose-200/60 hover:shadow-lg"
            >
              {k.gorselUrl && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={medyaUrl(k.gorselUrl)}
                    alt={k.etiket}
                    className={`h-full w-full transition group-hover:scale-105 ${gorselSinifi(cfg)}`}
                  />
                </div>
              )}
              <div className="border-t border-rose-100 bg-rose-50 px-4 py-3 text-center transition group-hover:bg-rose-100">
                <span className="text-sm font-semibold text-rose-800">{k.etiket}</span>
              </div>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      {baslik}
      <div className="gek-alt-etiket grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
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
