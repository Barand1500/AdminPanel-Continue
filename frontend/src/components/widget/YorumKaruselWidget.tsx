import { useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

export function YorumKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const yorumlar = cfg.yorumlar ?? [];
  const [aktif, setAktif] = useState(0);
  if (yorumlar.length === 0) return null;

  const y = yorumlar[aktif];

  return (
    <WidgetKabuk widget={widget}>
      <div className="mb-8 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
      </div>
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
        <p className="text-lg leading-relaxed text-slate-600">&ldquo;{y.metin}&rdquo;</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {y.gorselUrl && (
            <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className="h-12 w-12 rounded-full object-cover" />
          )}
          <div className="text-left">
            <p className="font-semibold text-slate-900">{y.ad}</p>
            <p className="text-sm text-slate-500">{y.firma}</p>
          </div>
        </div>
      </div>
      {yorumlar.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {yorumlar.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAktif(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === aktif ? 'bg-primary' : 'bg-slate-300'}`}
              aria-label={`Yorum ${i + 1}`}
            />
          ))}
        </div>
      )}
    </WidgetKabuk>
  );
}
