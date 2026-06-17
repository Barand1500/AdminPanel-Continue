import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function SurecAdimlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const adimlar = cfg.surecAdimlari ?? [];
  if (adimlar.length === 0) return null;

  return (
    <WidgetKabuk widget={widget}>
      <div className="mx-auto max-w-2xl text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adimlar.map((a, i) => (
          <article key={a.id} className="surec-adim-kart group relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <span className="surec-adim-numara">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-4 block text-3xl">{a.ikon || '📌'}</span>
            <h3 className="mt-3 font-semibold text-slate-900">{a.baslik}</h3>
            {a.aciklama && <p className="mt-2 text-sm text-slate-600">{a.aciklama}</p>}
          </article>
        ))}
      </div>
    </WidgetKabuk>
  );
}
