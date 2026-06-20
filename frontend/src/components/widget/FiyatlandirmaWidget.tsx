import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetFiyatPaketi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="mb-10 text-center">
      {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
    </div>
  );
}

function OzellikListesi({ paket }: { paket: WidgetFiyatPaketi }) {
  return (
    <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
      {(paket.ozellikler ?? []).map((o, i) => (
        <li key={i} className="flex items-start gap-2">
          <span>{o.dahil ? '✔' : '✖'}</span>
          <span>{o.metin}</span>
        </li>
      ))}
    </ul>
  );
}

function PaketButon({ paket, sinif }: { paket: WidgetFiyatPaketi; sinif: string }) {
  if (!paket.butonLink) return null;
  return (
    <a href={paket.butonLink} className={sinif}>
      {paket.butonMetni || 'Satın Al'}
    </a>
  );
}

function UcKolon({ widget, cfg, paketler, kolon }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
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
            <OzellikListesi paket={p} />
            <PaketButon
              paket={p}
              sinif={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                p.oneCikan ? 'bg-primary text-white hover:opacity-90' : 'border border-primary text-primary hover:bg-primary/5'
              }`}
            />
          </article>
        ))}
      </div>
    </>
  );
}

function OrtaVurgu({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const ortaIndex = Math.floor(paketler.length / 2);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="flex flex-wrap items-end justify-center gap-4 md:gap-6">
        {paketler.map((p, i) => {
          const orta = i === ortaIndex || p.oneCikan;
          return (
            <article
              key={p.id}
              className={`flex w-full max-w-xs flex-col rounded-2xl border bg-white p-6 shadow-sm md:w-auto ${
                orta ? 'scale-105 border-violet-500 bg-violet-50 shadow-lg ring-2 ring-violet-300' : 'border-slate-200'
              }`}
            >
              {orta && <span className="mb-2 self-center rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white">Önerilen</span>}
              <h3 className="text-lg font-bold text-slate-900">{p.ad}</h3>
              <p className={`mt-2 text-3xl font-bold ${orta ? 'text-violet-700' : 'text-primary'}`}>{p.fiyat}</p>
              {p.aciklama && <p className="mt-2 text-sm text-slate-500">{p.aciklama}</p>}
              <OzellikListesi paket={p} />
              <PaketButon
                paket={p}
                sinif={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                  orta ? 'bg-violet-600 text-white hover:bg-violet-500' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}

function TabloSade({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-teal-200">
        {paketler.map((p, i) => (
          <div
            key={p.id}
            className={`flex flex-col gap-3 border-teal-100 p-5 sm:flex-row sm:items-center sm:justify-between ${
              i > 0 ? 'border-t' : ''
            } ${i % 2 === 0 ? 'bg-white' : 'bg-teal-50/40'}`}
          >
            <div>
              <h3 className="font-bold text-slate-900">{p.ad}</h3>
              {p.aciklama && <p className="text-sm text-slate-500">{p.aciklama}</p>}
            </div>
            <p className="text-2xl font-bold text-teal-700">{p.fiyat}</p>
            <PaketButon
              paket={p}
              sinif="rounded-lg border border-teal-300 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function KoyuPremium({ widget, cfg, paketler, kolon }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[]; kolon: number }) {
  return (
    <div className="rounded-2xl bg-slate-900 px-6 py-12">
      <div className="mb-10 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-sky-400">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-5" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {paketler.map((p) => (
          <article key={p.id} className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-6">
            <h3 className="text-lg font-bold text-white">{p.ad}</h3>
            <p className="mt-2 text-3xl font-bold text-sky-400">{p.fiyat}</p>
            {p.aciklama && <p className="mt-2 text-sm text-slate-400">{p.aciklama}</p>}
            <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-300">
              {(p.ozellikler ?? []).map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-400">{o.dahil ? '✔' : '✖'}</span>
                  <span>{o.metin}</span>
                </li>
              ))}
            </ul>
            <PaketButon paket={p} sinif="mt-6 block rounded-lg bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-400" />
          </article>
        ))}
      </div>
    </div>
  );
}

function TuruncuPopuler({ widget, cfg, paketler, kolon }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {paketler.map((p) => (
          <article
            key={p.id}
            className={`relative flex flex-col rounded-2xl border bg-white p-6 pt-8 shadow-sm ${
              p.oneCikan ? 'border-orange-400' : 'border-slate-200'
            }`}
          >
            {p.oneCikan && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white">
                Popüler
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-900">{p.ad}</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{p.fiyat}</p>
            {p.aciklama && <p className="mt-2 text-sm text-slate-500">{p.aciklama}</p>}
            <OzellikListesi paket={p} />
            <PaketButon
              paket={p}
              sinif={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                p.oneCikan ? 'bg-orange-500 text-white hover:bg-orange-400' : 'border border-orange-300 text-orange-700 hover:bg-orange-50'
              }`}
            />
          </article>
        ))}
      </div>
    </>
  );
}

function YesilEkonomik({ widget, cfg, paketler, kolon }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {paketler.map((p, i) => (
          <article
            key={p.id}
            className={`flex flex-col rounded-2xl border p-6 ${
              i === 0 ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
          >
            {i === 0 && <span className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">Ekonomik</span>}
            <h3 className="text-lg font-bold text-slate-900">{p.ad}</h3>
            <p className={`mt-2 text-3xl font-bold ${i === 0 ? 'text-emerald-700' : 'text-slate-800'}`}>{p.fiyat}</p>
            {p.aciklama && <p className="mt-2 text-sm text-slate-500">{p.aciklama}</p>}
            <OzellikListesi paket={p} />
            <PaketButon
              paket={p}
              sinif={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                i === 0 ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            />
          </article>
        ))}
      </div>
    </>
  );
}

export function FiyatlandirmaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const paketler = cfg.paketler ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;
  const gt = widgetGorunumTipiAl(widget);

  if (paketler.length === 0) return null;

  const ortak = { widget, cfg, paketler, kolon };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'orta-vurgu' && <OrtaVurgu widget={widget} cfg={cfg} paketler={paketler} />}
      {gt === 'tablo-sade' && <TabloSade widget={widget} cfg={cfg} paketler={paketler} />}
      {gt === 'koyu-premium' && <KoyuPremium {...ortak} />}
      {gt === 'turuncu-populer' && <TuruncuPopuler {...ortak} />}
      {gt === 'yesil-ekonomik' && <YesilEkonomik {...ortak} />}
      {gt === 'uc-kolon' && <UcKolon {...ortak} />}
    </WidgetKabuk>
  );
}
