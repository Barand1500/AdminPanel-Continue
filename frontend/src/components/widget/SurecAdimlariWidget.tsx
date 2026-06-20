import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetSurecAdimi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
    </>
  );
}

function KartGrid({ widget, cfg, adimlar }: { widget: Widget; cfg: WidgetConfig; adimlar: WidgetSurecAdimi[] }) {
  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <Baslik widget={widget} cfg={cfg} />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adimlar.map((a, i) => (
          <article
            key={a.id}
            className="surec-adim-kart group relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="surec-adim-numara">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-4 block text-3xl">{a.ikon || '📌'}</span>
            <h3 className="mt-3 font-semibold text-slate-900">{a.baslik}</h3>
            {a.aciklama && <p className="mt-2 text-sm text-slate-600">{a.aciklama}</p>}
          </article>
        ))}
      </div>
    </>
  );
}

function KoyuYatayAdim({ widget, cfg, adimlar }: { widget: Widget; cfg: WidgetConfig; adimlar: WidgetSurecAdimi[] }) {
  const vurgu = cfg.gorunum?.vurguRengi || widget.arkaPlanRenk || '#f97316';
  return (
    <div className="surec-adim-koyu relative overflow-hidden rounded-2xl px-6 py-16 md:px-12">
      {widget.baslik && (
        <p className="surec-adim-koyu-watermark" aria-hidden>
          {widget.baslik.split(' ')[0]?.toUpperCase() ?? 'BAŞLA'}
        </p>
      )}
      <div className="relative z-10 text-center">
        {widget.altBaslik && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{widget.altBaslik}</p>
        )}
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>
        )}
      </div>
      <div className="relative z-10 mt-14 grid gap-8 md:grid-cols-3">
        {adimlar.slice(0, 3).map((a, i) => (
          <div key={a.id} className="surec-adim-koyu-oge text-center">
            <div
              className="surec-adim-koyu-ikon mx-auto flex h-14 w-14 items-center justify-center rounded-full text-xl text-white"
              style={{ backgroundColor: vurgu }}
            >
              {a.ikon || String(i + 1)}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{a.baslik}</h3>
            {a.aciklama && <p className="mt-2 text-sm text-slate-400">{a.aciklama}</p>}
          </div>
        ))}
      </div>
      <div className="surec-adim-koyu-cizgi" aria-hidden />
    </div>
  );
}

function DikeyZaman({ widget, cfg, adimlar }: { widget: Widget; cfg: WidgetConfig; adimlar: WidgetSurecAdimi[] }) {
  return (
    <>
      <div className="mx-auto max-w-xl text-center">
        <Baslik widget={widget} cfg={cfg} />
      </div>
      <div className="surec-adim-dikey mx-auto mt-12 max-w-2xl">
        {adimlar.map((a, i) => (
          <div key={a.id} className="surec-adim-dikey-oge">
            <div className="surec-adim-dikey-nokta">{String(i + 1).padStart(2, '0')}</div>
            <div className="surec-adim-dikey-icerik">
              <h3 className="font-semibold text-slate-900">{a.baslik}</h3>
              {a.aciklama && <p className="mt-1 text-sm text-slate-600">{a.aciklama}</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function SurecAdimlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const adimlar = cfg.surecAdimlari ?? [];
  if (adimlar.length === 0) return null;

  const gorunumTipi = widgetGorunumTipiAl(widget);

  return (
    <WidgetKabuk widget={widget}>
      {gorunumTipi === 'koyu-yatay-adim' && (
        <KoyuYatayAdim widget={widget} cfg={cfg} adimlar={adimlar} />
      )}
      {gorunumTipi === 'dikey-zaman' && <DikeyZaman widget={widget} cfg={cfg} adimlar={adimlar} />}
      {(gorunumTipi === 'kart-grid' || !['koyu-yatay-adim', 'dikey-zaman'].includes(gorunumTipi)) && (
        <KartGrid widget={widget} cfg={cfg} adimlar={adimlar} />
      )}
    </WidgetKabuk>
  );
}
