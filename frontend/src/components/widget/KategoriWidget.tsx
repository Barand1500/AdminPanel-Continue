import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function KategoriWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kategoriler = cfg.kategoriler ?? [];
  const gt = widgetGorunumTipiAl(widget);

  const gridSinif =
    gt === 'buyuk-kart'
      ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : gt === 'pill'
        ? 'flex flex-wrap gap-2'
        : 'grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  const linkSinif =
    gt === 'buyuk-kart'
      ? 'flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:border-primary'
      : gt === 'pill'
        ? 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary'
        : 'flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-primary';

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} section-title mb-6`}>{widget.baslik}</h2>
      )}
      <div className={gridSinif}>
        {kategoriler.map((k) => (
          <a key={k.id} href={k.link || '#'} className={linkSinif}>
            {gt === 'buyuk-kart' ? (
              <>
                <span className="text-3xl">{k.ikon}</span>
                <span className="mt-2 font-semibold">{k.metin}</span>
              </>
            ) : (
              <>
                {k.ikon} {k.metin}
              </>
            )}
          </a>
        ))}
      </div>
    </WidgetKabuk>
  );
}
