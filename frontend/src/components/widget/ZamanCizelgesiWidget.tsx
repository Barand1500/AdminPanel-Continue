import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { YatayKaydirmaCubugu } from './YatayKaydirmaCubugu';

type ZamanOgesi = { id: string; tarih: string; baslik: string; aciklama?: string };

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || '#7c3aed',
    radius: g.borderRadius ?? 14,
  };
}

function BaslikBolumu({ widget, cfg, sinif = '' }: { widget: Widget; cfg: WidgetConfig; sinif?: string }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${sinif}`}>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
      {widget.aciklama && <p className="mt-3 text-slate-600">{widget.aciklama}</p>}
    </div>
  );
}

function DikeyCizgi({ widget, cfg, ogeler }: { widget: Widget; cfg: WidgetConfig; ogeler: ZamanOgesi[] }) {
  return (
    <>
      <BaslikBolumu widget={widget} cfg={cfg} />
      <ol className="relative mx-auto mt-12 max-w-2xl border-l-2 border-primary/30 pl-8">
        {ogeler.map((o, i) => (
          <li key={o.id} className={`relative ${i < ogeler.length - 1 ? 'pb-10' : ''}`}>
            <span className="absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md">
              {i + 1}
            </span>
            <time className="text-sm font-bold text-primary">{o.tarih}</time>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{o.baslik}</h3>
            {o.aciklama && <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.aciklama}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}

function YatayAdim({ widget, cfg, ogeler }: { widget: Widget; cfg: WidgetConfig; ogeler: ZamanOgesi[] }) {
  const renk = renkler(cfg);
  return (
    <div className="zc-yatay">
      <div className="zc-yatay-baslik">
        {widget.altBaslik && (
          <p className="zc-yatay-etiket" style={{ color: renk.vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} zc-yatay-baslik-metin`} style={{ color: renk.baslik }}>
            {widget.baslik}
          </h2>
        )}
        {widget.aciklama && (
          <p className="zc-yatay-aciklama" style={{ color: renk.metin }}>
            {widget.aciklama}
          </p>
        )}
      </div>
      <YatayKaydirmaCubugu sinif="zc-yatay-serit" vurguRenk={renk.vurgu}>
        {ogeler.map((o, i) => (
          <article
            key={o.id}
            className="zc-yatay-kart"
            style={{ borderRadius: renk.radius, borderColor: `${renk.vurgu}22` }}
          >
            <span
              className="zc-yatay-numara"
              style={{ backgroundColor: renk.vurgu, borderRadius: renk.radius >= 12 ? 9999 : renk.radius }}
            >
              {i + 1}
            </span>
            {o.tarih && (
              <time className="zc-yatay-tarih" style={{ color: renk.vurgu }}>
                {o.tarih}
              </time>
            )}
            <h3 className="zc-yatay-kart-baslik" style={{ color: renk.baslik }}>
              {o.baslik}
            </h3>
            {o.aciklama && (
              <p className="zc-yatay-kart-aciklama" style={{ color: renk.metin }}>
                {o.aciklama}
              </p>
            )}
          </article>
        ))}
      </YatayKaydirmaCubugu>
    </div>
  );
}

function KartZaman({ widget, cfg, ogeler }: { widget: Widget; cfg: WidgetConfig; ogeler: ZamanOgesi[] }) {
  return (
    <>
      <BaslikBolumu widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ogeler.map((o, i) => (
          <article key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-primary">{o.tarih}</span>
            <h3 className="mt-1 font-semibold text-slate-900">{o.baslik}</h3>
            {o.aciklama && <p className="mt-2 text-sm text-slate-600">{o.aciklama}</p>}
            <span className="mt-3 inline-block text-xs text-slate-400">#{i + 1}</span>
          </article>
        ))}
      </div>
    </>
  );
}

function KoyuMilestone({ widget, cfg, ogeler }: { widget: Widget; cfg: WidgetConfig; ogeler: ZamanOgesi[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-12 md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        {widget.altBaslik && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{widget.altBaslik}</p>
        )}
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>
        )}
      </div>
      <div className="relative mt-14">
        <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-slate-700 md:block" aria-hidden />
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {ogeler.map((o, i) => (
            <div key={o.id} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-900 shadow-lg shadow-sky-400/30">
                {i + 1}
              </div>
              <time className="mt-4 block text-xs font-semibold uppercase tracking-wide text-sky-300">{o.tarih}</time>
              <h3 className="mt-2 font-semibold text-white">{o.baslik}</h3>
              {o.aciklama && <p className="mt-2 text-sm text-slate-400">{o.aciklama}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TuruncuNokta({ widget, cfg, ogeler }: { widget: Widget; cfg: WidgetConfig; ogeler: ZamanOgesi[] }) {
  return (
    <>
      <BaslikBolumu widget={widget} cfg={cfg} />
      <ol className="relative mx-auto mt-12 max-w-2xl border-l-2 border-orange-200 pl-8">
        {ogeler.map((o, i) => (
          <li key={o.id} className={`relative ${i < ogeler.length - 1 ? 'pb-10' : ''}`}>
            <span className="absolute -left-[2.35rem] flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-orange-500 shadow-md ring-2 ring-orange-200" />
            <time className="text-sm font-bold text-orange-600">{o.tarih}</time>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{o.baslik}</h3>
            {o.aciklama && <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.aciklama}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}

function YesilAkis({ widget, cfg, ogeler }: { widget: Widget; cfg: WidgetConfig; ogeler: ZamanOgesi[] }) {
  return (
    <>
      <BaslikBolumu widget={widget} cfg={cfg} />
      <div className="relative mx-auto mt-12 max-w-3xl">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-emerald-200 md:block" aria-hidden />
        <div className="space-y-10">
          {ogeler.map((o, i) => {
            const sol = i % 2 === 0;
            return (
              <div
                key={o.id}
                className={`relative flex flex-col md:flex-row ${sol ? 'md:justify-start' : 'md:justify-end'}`}
              >
                <article
                  className={`relative w-full rounded-xl border border-emerald-200 bg-emerald-50 p-5 md:w-[calc(50%-2rem)] ${
                    sol ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'
                  }`}
                >
                  <span className="absolute top-5 hidden h-3 w-3 rounded-full bg-emerald-500 md:block" style={sol ? { right: '-2.35rem' } : { left: '-2.35rem' }} />
                  <time className="text-xs font-bold uppercase tracking-wide text-emerald-700">{o.tarih}</time>
                  <h3 className="mt-1 font-semibold text-emerald-950">{o.baslik}</h3>
                  {o.aciklama && <p className="mt-2 text-sm text-emerald-800">{o.aciklama}</p>}
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function ZamanCizelgesiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const ogeler = cfg.timeline ?? [];
  if (ogeler.length === 0) return null;

  const gt = widgetGorunumTipiAl(widget);

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'yatay-adim' && <YatayAdim widget={widget} cfg={cfg} ogeler={ogeler} />}
      {gt === 'kart-zaman' && <KartZaman widget={widget} cfg={cfg} ogeler={ogeler} />}
      {gt === 'koyu-milestone' && <KoyuMilestone widget={widget} cfg={cfg} ogeler={ogeler} />}
      {gt === 'turuncu-nokta' && <TuruncuNokta widget={widget} cfg={cfg} ogeler={ogeler} />}
      {gt === 'yesil-akış' && <YesilAkis widget={widget} cfg={cfg} ogeler={ogeler} />}
      {gt === 'dikey-cizgi' && <DikeyCizgi widget={widget} cfg={cfg} ogeler={ogeler} />}
    </WidgetKabuk>
  );
}
