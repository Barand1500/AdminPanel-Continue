import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';

interface ReferanslarWidgetProps {
  widget: Widget;
}

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  if (!widget.baslik) return null;
  return <h2 className={`${baslikSinifi(cfg)} text-center font-bold`}>{widget.baslik}</h2>;
}

function LogoGrid({
  widget,
  cfg,
  referanslar,
  kolon,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  referanslar: string[];
  kolon: number;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {referanslar.map((referans) => (
          <div
            key={referans}
            className="flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600"
          >
            {referans}
          </div>
        ))}
      </div>
    </>
  );
}

function KayanSerit({ widget, cfg, referanslar }: { widget: Widget; cfg: WidgetConfig; referanslar: string[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
        {referanslar.map((referans) => (
          <div
            key={referans}
            className="flex h-24 min-w-[160px] shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sm font-semibold text-sky-800"
          >
            {referans}
          </div>
        ))}
      </div>
    </>
  );
}

function BuyukAlinti({ referanslar }: { referanslar: string[] }) {
  if (!referanslar[0]) return null;
  return (
    <blockquote className="mx-auto max-w-3xl text-center">
      <p className="text-2xl font-medium italic leading-relaxed text-slate-700 md:text-3xl">
        &ldquo;{referanslar[0]}&rdquo;
      </p>
    </blockquote>
  );
}

function KoyuBand({ widget, cfg, referanslar, kolon }: { widget: Widget; cfg: WidgetConfig; referanslar: string[]; kolon: number }) {
  return (
    <div className="rounded-2xl bg-slate-900 px-6 py-12">
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {referanslar.map((referans) => (
          <div
            key={referans}
            className="flex h-20 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-200"
          >
            {referans}
          </div>
        ))}
      </div>
    </div>
  );
}

function CerceveliKutu({ widget, cfg, referanslar, kolon }: { widget: Widget; cfg: WidgetConfig; referanslar: string[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {referanslar.map((referans) => (
          <div
            key={referans}
            className="flex h-24 items-center justify-center rounded-xl border-2 border-amber-400 bg-amber-50 text-sm font-bold text-amber-900"
          >
            {referans}
          </div>
        ))}
      </div>
    </>
  );
}

function YesilMinimal({ widget, cfg, referanslar, kolon }: { widget: Widget; cfg: WidgetConfig; referanslar: string[]; kolon: number }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {referanslar.map((referans) => (
          <div
            key={referans}
            className="flex h-16 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-800"
          >
            {referans}
          </div>
        ))}
      </div>
    </>
  );
}

export function ReferanslarWidget({ widget }: ReferanslarWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const referanslar = cfg.referanslar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;
  const gt = widgetGorunumTipiAl(widget);

  if (referanslar.length === 0) return null;

  const ortak = { widget, cfg, referanslar, kolon };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'buyuk-alinti' && <BuyukAlinti referanslar={referanslar} />}
      {gt === 'kayan-serit' && <KayanSerit widget={widget} cfg={cfg} referanslar={referanslar} />}
      {gt === 'koyu-band' && <KoyuBand {...ortak} />}
      {gt === 'cerceveli-kutu' && <CerceveliKutu {...ortak} />}
      {gt === 'yesil-minimal' && <YesilMinimal {...ortak} />}
      {gt === 'logo-grid' && <LogoGrid {...ortak} />}
    </WidgetKabuk>
  );
}
