import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';
import { useSiteDil } from '@/contexts/SiteDilContext';

const eskiIkonHaritasi: Record<string, string> = {
  globe: '🌐',
  settings: '⚙️',
  search: '🔍',
  users: '👥',
  monitor: '🖥️',
  headset: '🎧',
  wrench: '🔧',
};

function ikonGoster(ikon: string): string {
  if (!ikon.trim()) return '📦';
  return eskiIkonHaritasi[ikon] ?? ikon;
}

interface HizmetKartlariWidgetProps {
  widget: Widget;
}

export function HizmetKartlariWidget({ widget }: HizmetKartlariWidgetProps) {
  const { cevir } = useSiteDil();
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.kartlar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mx-auto max-w-2xl text-center">
        {widget.altBaslik && (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
        )}
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: cfg.gorunum?.baslikRengi }}>
            {widget.baslik}
          </h2>
        )}
        {widget.aciklama && (
          <p className="mt-3 text-slate-600" style={{ color: cfg.gorunum?.metinRengi }}>
            {widget.aciklama}
          </p>
        )}
      </div>
      <div className="mt-10 grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((kart) => (
          <article key={kart.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="text-4xl text-primary">{ikonGoster(kart.ikon)}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{kart.baslik}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{kart.aciklama}</p>
            {kart.link && (
              <a
                href={kart.link}
                className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {kart.butonMetni || cevir('site.detaylariGor', 'Detayları Gör')} →
              </a>
            )}
          </article>
        ))}
      </div>
    </WidgetKabuk>
  );
}
