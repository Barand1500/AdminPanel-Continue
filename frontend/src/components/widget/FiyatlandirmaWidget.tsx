import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

export function FiyatlandirmaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const paketler = cfg.paketler ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mb-10 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {paketler.map((p) => (
          <article
            key={p.id}
            className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
              p.oneCikan ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900">{p.ad}</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{p.fiyat}</p>
            {p.aciklama && <p className="mt-2 text-sm text-slate-500">{p.aciklama}</p>}
            <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
              {(p.ozellikler ?? []).map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>{o.dahil ? '✔' : '✖'}</span>
                  <span>{o.metin}</span>
                </li>
              ))}
            </ul>
            {p.butonLink && (
              <a
                href={p.butonLink}
                className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                  p.oneCikan
                    ? 'bg-primary text-white hover:opacity-90'
                    : 'border border-primary text-primary hover:bg-primary/5'
                }`}
              >
                {p.butonMetni || 'Satın Al'}
              </a>
            )}
          </article>
        ))}
      </div>
    </WidgetKabuk>
  );
}
