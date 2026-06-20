import { useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetBlogKart, WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';
import { useSiteDil } from '@/contexts/SiteDilContext';

function BaslikSatir({
  widget,
  cfg,
  tumunuGorLink,
  tumunuGorMetin,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  tumunuGorLink?: string;
  tumunuGorMetin?: string;
  cevir: (k: string, f: string) => string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-slate-900`}>{widget.baslik}</h2>}
      {tumunuGorLink && (
        <a href={tumunuGorLink} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">
          {tumunuGorMetin ?? cevir('site.tumunuGor', 'Tümünü Gör')} —
        </a>
      )}
    </div>
  );
}

function BlogKartIcerik({
  k,
  cfg,
  cevir,
  sinif,
  butonSinif,
}: {
  k: WidgetBlogKart;
  cfg: WidgetConfig;
  cevir: (k: string, f: string) => string;
  sinif?: string;
  butonSinif?: string;
}) {
  return (
    <article className={sinif}>
      {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt="" className={`w-full ${gorselSinifi(cfg)}`} />}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{k.baslik}</h3>
        {k.link && (
          <a href={k.link} className={butonSinif ?? 'mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700'}>
            — {k.butonMetni || cevir('site.dahaFazlaOku', 'Daha Fazla Oku')}
          </a>
        )}
      </div>
    </article>
  );
}

function YatayKart({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const [aktif, setAktif] = useState(0);

  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="grid gap-4 md:grid-cols-3">
        {kartlar.slice(aktif, aktif + 3).map((k) => (
          <BlogKartIcerik
            key={k.id}
            k={k}
            cfg={cfg}
            cevir={cevir}
            sinif="overflow-hidden rounded-2xl bg-white shadow-md"
          />
        ))}
      </div>
      {kartlar.length > 3 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(kartlar.length / 3) }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAktif(i * 3)}
              className={`h-2.5 w-2.5 rounded-full ${i === Math.floor(aktif / 3) ? 'bg-teal-500' : 'bg-slate-300'}`}
              aria-label={`Sayfa ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

function BuyukOnizleme({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const [hero, ...diger] = kartlar;

  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
        {hero && (
          <article className="overflow-hidden rounded-2xl bg-white shadow-lg md:col-span-2 md:row-span-2">
            {hero.gorselUrl && <img src={medyaUrl(hero.gorselUrl)} alt="" className="h-64 w-full object-cover md:h-full" />}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{hero.baslik}</h3>
              {hero.link && (
                <a href={hero.link} className="mt-4 inline-block text-sm font-semibold text-sky-600 hover:underline">
                  {hero.butonMetni || cevir('site.dahaFazlaOku', 'Daha Fazla Oku')} →
                </a>
              )}
            </div>
          </article>
        )}
        {diger.slice(0, 2).map((k) => (
          <BlogKartIcerik key={k.id} k={k} cfg={cfg} cevir={cevir} sinif="overflow-hidden rounded-xl bg-white shadow-sm" />
        ))}
      </div>
    </>
  );
}

function KompaktListe({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="divide-y divide-violet-100 rounded-xl border border-violet-100">
        {kartlar.map((k) => (
          <a key={k.id} href={k.link || '#'} className="flex items-center gap-4 p-4 transition hover:bg-violet-50/50">
            {k.gorselUrl && (
              <img src={medyaUrl(k.gorselUrl)} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-900">{k.baslik}</h3>
              <span className="text-xs text-violet-600">{k.butonMetni || cevir('site.dahaFazlaOku', 'Oku')} →</span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

function KoyuKart({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <div className="mb-6">
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-white`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {kartlar.slice(0, 3).map((k) => (
          <article key={k.id} className="overflow-hidden rounded-xl bg-slate-800">
            {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt="" className="h-40 w-full object-cover opacity-90" />}
            <div className="p-4">
              <h3 className="font-semibold text-white">{k.baslik}</h3>
              {k.link && (
                <a href={k.link} className="mt-3 inline-block text-sm text-sky-400 hover:underline">
                  {k.butonMetni || cevir('site.dahaFazlaOku', 'Oku')} →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TuruncuVurgu({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="grid gap-4 md:grid-cols-3">
        {kartlar.slice(0, 3).map((k) => (
          <BlogKartIcerik
            key={k.id}
            k={k}
            cfg={cfg}
            cevir={cevir}
            sinif="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm"
            butonSinif="mt-4 inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
          />
        ))}
      </div>
    </>
  );
}

function YesilMinimal({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="space-y-3">
        {kartlar.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="flex items-center justify-between rounded-lg border border-emerald-100 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50/50"
          >
            <span className="font-medium text-slate-800">{k.baslik}</span>
            <span className="text-sm text-emerald-600">→</span>
          </a>
        ))}
      </div>
    </>
  );
}

export function BlogKaruselWidget({ widget }: { widget: Widget }) {
  const { cevir } = useSiteDil();
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.blogKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (kartlar.length === 0) return null;

  const ortak = { widget, cfg, kartlar, cevir };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'buyuk-onizleme' && <BuyukOnizleme {...ortak} />}
      {gt === 'kompakt-liste' && <KompaktListe {...ortak} />}
      {gt === 'koyu-kart' && <KoyuKart {...ortak} />}
      {gt === 'turuncu-vurgu' && <TuruncuVurgu {...ortak} />}
      {gt === 'yesil-minimal' && <YesilMinimal {...ortak} />}
      {gt === 'yatay-kart' && <YatayKart {...ortak} />}
    </WidgetKabuk>
  );
}
