import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

const ikonHaritasi: Record<string, string> = {
  globe: '🌐',
  settings: '⚙️',
  search: '🔍',
};

interface HizmetKartlariWidgetProps {
  widget: Widget;
}

export function HizmetKartlariWidget({ widget }: HizmetKartlariWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.kartlar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mx-auto max-w-2xl text-center">
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: cfg.gorunum?.baslikRengi }}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mt-3 text-slate-600" style={{ color: cfg.gorunum?.metinRengi }}>{widget.aciklama}</p>}
      </div>
      <div className="mt-10 grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((kart) => (
          <article key={kart.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-3xl">{ikonHaritasi[kart.ikon] ?? (kart.ikon || '📦')}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{kart.baslik}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{kart.aciklama}</p>
            {kart.link && (
              <a href={kart.link} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                Detay →
              </a>
            )}
          </article>
        ))}
      </div>
    </WidgetKabuk>
  );
}
