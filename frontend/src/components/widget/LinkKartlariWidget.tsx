import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetLinkOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle, linkKartIkonu } from './widgetHelpers';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  if (!widget.baslik) return null;
  const g = cfg.gorunum ?? {};
  return (
    <h2
      className={`${baslikSinifi(cfg)} mb-6 font-bold`}
      style={{ color: g.baslikRengi || widget.yaziRenk || undefined }}
    >
      {widget.baslik}
    </h2>
  );
}

function LinkOge({
  l,
  cfg,
  sinif,
  ikonSinif,
}: {
  l: WidgetLinkOgesi;
  cfg: WidgetConfig;
  sinif: string;
  ikonSinif: string;
}) {
  const g = cfg.gorunum ?? {};
  return (
    <a key={l.id} href={l.link || '#'} className={sinif}>
      <span className={ikonSinif} aria-hidden>
        {linkKartIkonu(l.ikon)}
      </span>
      <span
        className="min-w-0 flex-1 text-sm font-medium"
        style={{ color: g.metinRengi || undefined }}
      >
        {l.metin}
      </span>
      <span className="shrink-0 text-slate-400">→</span>
    </a>
  );
}

function IkonGrid({ widget, cfg, linkler, kolon }: { widget: Widget; cfg: WidgetConfig; linkler: WidgetLinkOgesi[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {linkler.map((l) => (
          <LinkOge
            key={l.id}
            l={l}
            cfg={cfg}
            sinif="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
            ikonSinif="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg"
          />
        ))}
      </div>
    </>
  );
}

function CamPanel({ widget, cfg, linkler, kolon }: { widget: Widget; cfg: WidgetConfig; linkler: WidgetLinkOgesi[]; kolon: number }) {
  return (
    <div className="rounded-3xl border border-white/50 bg-gradient-to-br from-sky-50 to-blue-100 p-6 shadow-lg backdrop-blur-sm md:p-8">
      <Baslik widget={widget} cfg={cfg} />
      <div
        className="grid gap-3 rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-md"
        style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}
      >
        {linkler.map((l) => (
          <LinkOge
            key={l.id}
            l={l}
            cfg={cfg}
            sinif="flex items-center gap-3 rounded-xl bg-white/70 p-4 transition hover:bg-white"
            ikonSinif="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg"
          />
        ))}
      </div>
    </div>
  );
}

function DikeyListe({ widget, cfg, linkler }: { widget: Widget; cfg: WidgetConfig; linkler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-xl divide-y divide-teal-100 rounded-2xl border border-teal-100 bg-white">
        {linkler.map((l) => (
          <LinkOge
            key={l.id}
            l={l}
            cfg={cfg}
            sinif="flex items-center gap-4 px-5 py-4 transition hover:bg-teal-50/50"
            ikonSinif="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-base"
          />
        ))}
      </div>
    </>
  );
}

function MorKare({ widget, cfg, linkler, kolon }: { widget: Widget; cfg: WidgetConfig; linkler: WidgetLinkOgesi[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {linkler.map((l) => (
          <a
            key={l.id}
            href={l.link || '#'}
            className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-violet-300 bg-violet-50 p-4 text-center transition hover:border-violet-500 hover:bg-violet-100"
          >
            <span className="text-2xl">{linkKartIkonu(l.ikon)}</span>
            <span className="text-sm font-semibold text-violet-900">{l.metin}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function KoyuIkon({ widget, cfg, linkler, kolon }: { widget: Widget; cfg: WidgetConfig; linkler: WidgetLinkOgesi[]; kolon: number }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 md:p-8">
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {linkler.map((l) => (
          <a
            key={l.id}
            href={l.link || '#'}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 p-5 text-center transition hover:border-sky-500"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-xl text-sky-400">
              {linkKartIkonu(l.ikon)}
            </span>
            <span className="text-sm font-medium text-slate-200">{l.metin}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function AltinCizgi({ widget, cfg, linkler }: { widget: Widget; cfg: WidgetConfig; linkler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-2xl">
        {linkler.map((l) => (
          <a
            key={l.id}
            href={l.link || '#'}
            className="group flex items-center gap-4 border-b-2 border-amber-200 py-4 transition hover:border-amber-500"
          >
            <span className="text-lg text-amber-600">{linkKartIkonu(l.ikon)}</span>
            <span className="flex-1 text-sm font-semibold text-slate-800 group-hover:text-amber-700">{l.metin}</span>
            <span className="text-amber-400 opacity-0 transition group-hover:opacity-100">→</span>
          </a>
        ))}
      </div>
    </>
  );
}

export function LinkKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const linkler = cfg.linkler ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 5;
  const gt = widgetGorunumTipiAl(widget);

  if (linkler.length === 0) return null;

  const ortak = { widget, cfg, linkler, kolon };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'cam-panel' && <CamPanel {...ortak} />}
      {gt === 'dikey-liste' && <DikeyListe widget={widget} cfg={cfg} linkler={linkler} />}
      {gt === 'mor-kare' && <MorKare {...ortak} />}
      {gt === 'koyu-ikon' && <KoyuIkon {...ortak} />}
      {gt === 'altin-cizgi' && <AltinCizgi widget={widget} cfg={cfg} linkler={linkler} />}
      {gt === 'ikon-grid' && <IkonGrid {...ortak} />}
    </WidgetKabuk>
  );
}
