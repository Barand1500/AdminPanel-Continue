import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetLinkOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  if (!widget.baslik) return null;
  return <h2 className={`${baslikSinifi(cfg)} section-title mb-6`}>{widget.baslik}</h2>;
}

function GridIkon({ widget, cfg, kategoriler }: { widget: Widget; cfg: WidgetConfig; kategoriler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {kategoriler.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-primary"
          >
            {k.ikon} {k.metin}
          </a>
        ))}
      </div>
    </>
  );
}

function PillRenkli({ widget, cfg, kategoriler }: { widget: Widget; cfg: WidgetConfig; kategoriler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="flex flex-wrap gap-2">
        {kategoriler.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 transition hover:border-orange-400 hover:bg-orange-100"
          >
            {k.ikon} {k.metin}
          </a>
        ))}
      </div>
    </>
  );
}

function BuyukGorsel({ widget, cfg, kategoriler }: { widget: Widget; cfg: WidgetConfig; kategoriler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kategoriler.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="flex flex-col items-center rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-8 text-center shadow-sm transition hover:border-sky-400"
          >
            <span className="text-4xl">{k.ikon}</span>
            <span className="mt-3 text-lg font-semibold text-sky-900">{k.metin}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function KoyuEtiket({ widget, cfg, kategoriler }: { widget: Widget; cfg: WidgetConfig; kategoriler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {kategoriler.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-500"
          >
            <span className="text-lg">{k.ikon}</span>
            {k.metin}
          </a>
        ))}
      </div>
    </>
  );
}

function CizgiliMinimal({ widget, cfg, kategoriler }: { widget: Widget; cfg: WidgetConfig; kategoriler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid max-w-xl">
        {kategoriler.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="flex items-center gap-3 border-b border-violet-200 py-3 text-sm font-medium text-slate-700 transition hover:text-violet-700"
          >
            <span>{k.ikon}</span>
            <span className="flex-1">{k.metin}</span>
            <span className="text-violet-300">→</span>
          </a>
        ))}
      </div>
    </>
  );
}

function KorallVurgu({ widget, cfg, kategoriler }: { widget: Widget; cfg: WidgetConfig; kategoriler: WidgetLinkOgesi[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {kategoriler.map((k) => (
          <a
            key={k.id}
            href={k.link || '#'}
            className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-900 transition hover:border-rose-400 hover:shadow-md"
          >
            <span className="text-xl">{k.ikon}</span>
            {k.metin}
          </a>
        ))}
      </div>
    </>
  );
}

export function KategoriWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kategoriler = cfg.kategoriler ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (kategoriler.length === 0) return null;

  const ortak = { widget, cfg, kategoriler };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'pill-renkli' && <PillRenkli {...ortak} />}
      {gt === 'buyuk-gorsel' && <BuyukGorsel {...ortak} />}
      {gt === 'koyu-etiket' && <KoyuEtiket {...ortak} />}
      {gt === 'cizgili-minimal' && <CizgiliMinimal {...ortak} />}
      {gt === 'korall-vurgu' && <KorallVurgu {...ortak} />}
      {gt === 'grid-ikon' && <GridIkon {...ortak} />}
    </WidgetKabuk>
  );
}
