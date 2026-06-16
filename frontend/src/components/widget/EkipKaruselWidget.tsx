import { useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

export function EkipKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const uyeler = cfg.uyeler ?? [];
  const [baslangic, setBaslangic] = useState(0);
  const gorunen = 4;
  if (uyeler.length === 0) return null;

  const sayfaSayisi = Math.ceil(uyeler.length / gorunen);

  return (
    <WidgetKabuk widget={widget}>
      <div className="mb-8 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="group relative overflow-hidden rounded-xl">
            {u.gorselUrl && (
              <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className={`aspect-[3/4] w-full ${gorselSinifi(cfg)}`} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-lg font-bold text-white">{u.ad}</h3>
              <p className="text-sm text-slate-200">{u.unvan}</p>
            </div>
          </article>
        ))}
      </div>
      {sayfaSayisi > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
            onClick={() => setBaslangic((b) => Math.max(0, b - gorunen))}
            disabled={baslangic === 0}
          >
            ←
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
            onClick={() => setBaslangic((b) => Math.min(uyeler.length - gorunen, b + gorunen))}
            disabled={baslangic + gorunen >= uyeler.length}
          >
            →
          </button>
        </div>
      )}
    </WidgetKabuk>
  );
}
