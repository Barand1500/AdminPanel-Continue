import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

export function LinkKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const linkler = cfg.linkler ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 5;

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mb-6 font-bold text-slate-900`}>{widget.baslik}</h2>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {linkler.map((l) => (
          <a key={l.id} href={l.link || '#'} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-lg">{l.ikon || '👤'}</span>
            <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{l.metin}</span>
            <span className="text-slate-400">→</span>
          </a>
        ))}
      </div>
    </WidgetKabuk>
  );
}
