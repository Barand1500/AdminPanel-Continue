import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

export function BaslikMetinGorselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const duzen = cfg.gorunum?.icerikDuzeni ?? 'sol';
  const ikonKartlar = cfg.ikonKartlar ?? [];
  const gorsel = widget.gorselUrl ? (
    <img src={medyaUrl(widget.gorselUrl)} alt="" className={`rounded-2xl ${gorselSinifi(cfg)}`} />
  ) : null;
  const metin = (
    <div>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: 'var(--widget-baslik-renk)' }}>
          {widget.baslik}
        </h2>
      )}
      {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
      {ikonKartlar.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ikonKartlar.map((k) => (
            <div key={k.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-2xl text-primary">{k.ikon}</span>
              <span className="text-sm font-semibold text-slate-800">{k.metin}</span>
            </div>
          ))}
        </div>
      )}
      {widget.butonLink && widget.butonMetni && (
        <a
          href={widget.butonLink}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          ▶ {widget.butonMetni}
        </a>
      )}
    </div>
  );
  const flexClass =
    duzen === 'ust' ? 'flex flex-col gap-6' :
    duzen === 'alt' ? 'flex flex-col-reverse gap-6' :
    duzen === 'sag' ? 'flex flex-col gap-6 md:flex-row-reverse md:items-center' :
    'flex flex-col gap-6 md:flex-row md:items-center';

  return (
    <WidgetKabuk widget={widget}>
      <div className={flexClass}>
        {gorsel && <div className="min-w-0 flex-1">{gorsel}</div>}
        <div className="min-w-0 flex-1">{metin}</div>
      </div>
    </WidgetKabuk>
  );
}
