import { useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

export function BlogKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.blogKartlari ?? [];
  const [aktif, setAktif] = useState(0);
  if (kartlar.length === 0) return null;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mb-6 flex items-center justify-between gap-4">
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-slate-900`}>{widget.baslik}</h2>}
        {cfg.tumunuGorLink && (
          <a href={cfg.tumunuGorLink} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">
            {cfg.tumunuGorMetin ?? 'Tümünü Gör'} —
          </a>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {kartlar.slice(aktif, aktif + 3).map((k) => (
          <article key={k.id} className="overflow-hidden rounded-2xl bg-white shadow-md">
            {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt="" className={`h-44 w-full ${gorselSinifi(cfg)}`} />}
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{k.baslik}</h3>
              {k.link && (
                <a href={k.link} className="mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">
                  — {k.butonMetni || 'Daha Fazla Oku'}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {kartlar.length > 3 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(kartlar.length / 3) }).map((_, i) => (
            <button key={i} type="button" onClick={() => setAktif(i * 3)} className={`h-2.5 w-2.5 rounded-full ${i === Math.floor(aktif / 3) ? 'bg-teal-500' : 'bg-slate-300'}`} aria-label={`Sayfa ${i + 1}`} />
          ))}
        </div>
      )}
    </WidgetKabuk>
  );
}
