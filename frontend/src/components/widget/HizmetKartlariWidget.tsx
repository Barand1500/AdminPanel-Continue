import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetKartOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle } from './widgetHelpers';
import { useSiteDil } from '@/contexts/SiteDilContext';

const eskiIkonHaritasi: Record<string, string> = {
  globe: '🌐',
  settings: '⚙️',
  search: '🔍',
  users: '👥',
  monitor: '🖥️',
  headset: '🎧',
  wrench: '🔧',
};

function ikonGoster(ikon: string): string {
  if (!ikon.trim()) return '📦';
  return eskiIkonHaritasi[ikon] ?? ikon;
}

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: cfg.gorunum?.baslikRengi }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="mt-3 text-slate-600" style={{ color: cfg.gorunum?.metinRengi }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function KartButon({ kart, cevir }: { kart: WidgetKartOgesi; cevir: (k: string, f: string) => string }) {
  if (!kart.link) return null;
  return (
    <a
      href={kart.link}
      className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {kart.butonMetni || cevir('site.detaylariGor', 'Detayları Gör')} →
    </a>
  );
}

function BeyazGrid({
  widget,
  cfg,
  kartlar,
  kolon,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  kolon: number;
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-6" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((kart) => (
          <article key={kart.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="text-4xl text-primary">{ikonGoster(kart.ikon)}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{kart.baslik}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{kart.aciklama}</p>
            <KartButon kart={kart} cevir={cevir} />
          </article>
        ))}
      </div>
    </>
  );
}

function CamYuzey({
  widget,
  cfg,
  kartlar,
  kolon,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  kolon: number;
  cevir: (k: string, f: string) => string;
}) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-6 md:p-10">
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-5" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((kart) => (
          <article
            key={kart.id}
            className="flex flex-col rounded-2xl border border-white/60 bg-white/50 p-6 text-center shadow-lg backdrop-blur-md"
          >
            <span className="text-4xl">{ikonGoster(kart.ikon)}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{kart.baslik}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{kart.aciklama}</p>
            <KartButon kart={kart} cevir={cevir} />
          </article>
        ))}
      </div>
    </div>
  );
}

function KoyuPremium({
  widget,
  cfg,
  kartlar,
  kolon,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  kolon: number;
  cevir: (k: string, f: string) => string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 px-6 py-12 md:px-10">
      <div className="mx-auto max-w-2xl text-center">
        {widget.altBaslik && (
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-400">{widget.altBaslik}</p>
        )}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mt-3 text-slate-400">{widget.aciklama}</p>}
      </div>
      <div className="mt-10 grid gap-5" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((kart) => (
          <article
            key={kart.id}
            className="flex flex-col rounded-xl border border-slate-700 bg-slate-800/80 p-6 text-center"
          >
            <span className="text-4xl drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]">{ikonGoster(kart.ikon)}</span>
            <h3 className="mt-4 text-lg font-semibold text-white">{kart.baslik}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{kart.aciklama}</p>
            {kart.link && (
              <a
                href={kart.link}
                className="mt-5 inline-block rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                {kart.butonMetni || cevir('site.detaylariGor', 'Detayları Gör')} →
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function YesilCizgi({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 flex flex-col gap-4">
        {kartlar.map((kart) => (
          <article
            key={kart.id}
            className="flex flex-col rounded-r-xl border border-l-4 border-l-emerald-500 border-slate-200 bg-white p-5 text-left shadow-sm sm:flex-row sm:items-center sm:gap-5"
          >
            <span className="text-3xl text-emerald-600">{ikonGoster(kart.ikon)}</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{kart.baslik}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{kart.aciklama}</p>
            </div>
            {kart.link && (
              <a
                href={kart.link}
                className="shrink-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {kart.butonMetni || cevir('site.detaylariGor', 'Detayları Gör')} →
              </a>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

const GRADIENT_KART_RENK = [
  'from-violet-50 to-purple-100 border-violet-200',
  'from-indigo-50 to-blue-100 border-indigo-200',
  'from-fuchsia-50 to-pink-100 border-fuchsia-200',
  'from-violet-50 to-indigo-100 border-violet-200',
];

function GradientKart({
  widget,
  cfg,
  kartlar,
  kolon,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  kolon: number;
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mt-10 grid gap-5" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
        {kartlar.map((kart, i) => (
          <article
            key={kart.id}
            className={`flex flex-col rounded-2xl border bg-gradient-to-br p-6 text-center ${GRADIENT_KART_RENK[i % GRADIENT_KART_RENK.length]}`}
          >
            <span className="text-4xl">{ikonGoster(kart.ikon)}</span>
            <h3 className="mt-4 text-lg font-semibold text-violet-900">{kart.baslik}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-violet-700/80">{kart.aciklama}</p>
            <KartButon kart={kart} cevir={cevir} />
          </article>
        ))}
      </div>
    </>
  );
}

function YatayListe({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {kartlar.map((kart) => (
          <article key={kart.id} className="flex items-start gap-4 p-5 text-left sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              {ikonGoster(kart.ikon)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">{kart.baslik}</h3>
              <p className="mt-1 text-sm text-slate-600">{kart.aciklama}</p>
            </div>
            {kart.link && (
              <a href={kart.link} className="shrink-0 text-sm font-medium text-teal-600 hover:underline">
                {kart.butonMetni || cevir('site.detaylariGor', 'Detay')} →
              </a>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

interface HizmetKartlariWidgetProps {
  widget: Widget;
}

export function HizmetKartlariWidget({ widget }: HizmetKartlariWidgetProps) {
  const { cevir } = useSiteDil();
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.kartlar ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;
  const gt = widgetGorunumTipiAl(widget);

  if (kartlar.length === 0) return null;

  const ortak = { widget, cfg, kartlar, cevir };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'cam-yuzey' && <CamYuzey {...ortak} kolon={kolon} />}
      {gt === 'koyu-premium' && <KoyuPremium {...ortak} kolon={kolon} />}
      {gt === 'yesil-cizgi' && <YesilCizgi {...ortak} />}
      {gt === 'gradient-kart' && <GradientKart {...ortak} kolon={kolon} />}
      {gt === 'yatay-liste' && <YatayListe {...ortak} />}
      {gt === 'beyaz-grid' && <BeyazGrid {...ortak} kolon={kolon} />}
    </WidgetKabuk>
  );
}
