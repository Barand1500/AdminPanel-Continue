import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetSayac } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { sayacDegerGoster } from '@/utils/sayacYardimci';
import { CizgiIkon, type CizgiIkonYedegi } from './CizgiIkonlari';

const SAYAC_YEDEKLERI: readonly CizgiIkonYedegi[] = ['memnuniyet', 'proje', 'grafik', 'kalite', 'ekip'];

function renkler(cfg: WidgetConfig) {
  const gorunum = cfg.gorunum ?? {};
  return {
    baslik: gorunum.baslikRengi || '#111827',
    metin: gorunum.metinRengi || '#4b5563',
    vurgu: gorunum.vurguRengi || gorunum.baslikRengi || '#111827',
  };
}

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  if (!widget.baslik && !widget.altBaslik) return null;
  const renk = renkler(cfg);
  const cizgiGoster = cfg.gorunum?.baslikCizgi !== false;
  return (
    <div className="sb-baslik mb-8 text-center sm:mb-10">
      {widget.altBaslik && (
        <div className="inline-flex flex-col items-center">
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: renk.vurgu }}>{widget.altBaslik}</p>
          {cizgiGoster && (
            <span
              className="mt-2 h-px w-12 opacity-35"
              style={{ backgroundColor: renk.vurgu }}
              aria-hidden
            />
          )}
        </div>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold`} style={{ color: renk.baslik }}>{widget.baslik}</h2>
      )}
    </div>
  );
}

function SayacHucre({
  s,
  sinif,
  renk,
  yedek = 'grafik',
}: {
  s: WidgetSayac;
  sinif?: string;
  renk?: ReturnType<typeof renkler>;
  yedek?: CizgiIkonYedegi;
}) {
  const palet = renk ?? { baslik: '#111827', metin: '#4b5563', vurgu: '#111827' };
  return (
    <div className={sinif}>
      <span className="inline-flex text-2xl" style={{ color: palet.vurgu }} aria-hidden>
        <CizgiIkon deger={s.ikon || s.etiket} yedek={yedek} boyut={27} />
      </span>
      <p className="text-3xl font-bold md:text-4xl" style={{ color: palet.baslik }}>
        {sayacDegerGoster(s.deger)}
        {s.sonEk}
      </p>
      {s.etiket?.trim() ? <p className="mt-1 text-sm" style={{ color: palet.metin }}>{s.etiket}</p> : null}
    </div>
  );
}

function BuyukRakam({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s, i) => (
          <SayacHucre
            key={s.id}
            s={s}
            sinif="text-center"
            renk={renk}
            yedek={SAYAC_YEDEKLERI[i % SAYAC_YEDEKLERI.length]}
          />
        ))}
      </div>
    </>
  );
}

function PillSerit({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap items-stretch overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg">
          {sayaclar.map((s, i) => (
            <div
              key={s.id}
              className={`px-6 py-4 text-center ${i < sayaclar.length - 1 ? 'border-r border-slate-100' : ''}`}
            >
              <SayacHucre s={s} renk={renk} yedek={SAYAC_YEDEKLERI[i % SAYAC_YEDEKLERI.length]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CamKartlar({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  const renk = renkler(cfg);
  return (
    <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-100 p-8">
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s, i) => (
          <div
            key={s.id}
            className="rounded-2xl border border-white/60 bg-white/50 p-6 text-center shadow-md backdrop-blur-md"
          >
            <SayacHucre s={s} renk={renk} yedek={SAYAC_YEDEKLERI[i % SAYAC_YEDEKLERI.length]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function KoyuNeon({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  return (
    <div className="rounded-2xl bg-slate-950 px-6 py-12">
      <div className="mb-8 text-center sm:mb-10">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s, i) => (
          <div key={s.id} className="text-center">
            <span className="inline-flex text-cyan-300" aria-hidden>
              <CizgiIkon deger={s.ikon || s.etiket} yedek={SAYAC_YEDEKLERI[i % SAYAC_YEDEKLERI.length]} boyut={27} />
            </span>
            <p className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.5)] md:text-5xl">
              {sayacDegerGoster(s.deger)}
              {s.sonEk}
            </p>
            {s.etiket?.trim() ? <p className="mt-2 text-sm text-slate-400">{s.etiket}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function YesilArtis({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s, i) => (
          <div key={s.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start justify-between">
              <span className="inline-flex text-emerald-700" aria-hidden>
                <CizgiIkon deger={s.ikon || s.etiket} yedek={SAYAC_YEDEKLERI[i % SAYAC_YEDEKLERI.length]} boyut={23} />
              </span>
              <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800">↑</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-emerald-800">
              {sayacDegerGoster(s.deger)}
              {s.sonEk}
            </p>
            {s.etiket?.trim() ? <p className="mt-1 text-sm text-emerald-600">{s.etiket}</p> : null}
          </div>
        ))}
      </div>
    </>
  );
}

function AltinPremium({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  const vurgu = cfg.gorunum?.vurguRengi || cfg.gorunum?.baslikRengi || '#111827';
  return (
    <div className="sb-halka" style={{ '--sb-halka-vurgu': vurgu } as CSSProperties}>
      <Baslik widget={widget} cfg={cfg} />
      <div className="sb-halka-grid" style={{ '--sb-halka-kolon': Math.min(Math.max(cfg.gorunum?.kolonSayisi ?? 4, 2), 5) } as CSSProperties}>
        {sayaclar.map((s, i) => (
          <article key={s.id} className="sb-halka-kart">
            <span className="sb-halka-ikon">
              <CizgiIkon deger={s.ikon || s.etiket} yedek={SAYAC_YEDEKLERI[i % SAYAC_YEDEKLERI.length]} boyut={28} />
            </span>
            <p className="sb-halka-deger">
              {sayacDegerGoster(s.deger)}
              {s.sonEk}
            </p>
            {s.etiket?.trim() ? <p className="sb-halka-etiket">{s.etiket}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export function SayacBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const sayaclar = cfg.sayaclar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (sayaclar.length === 0) return null;

  const ortak = { widget, cfg, sayaclar };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'pill-serit' && <PillSerit {...ortak} />}
      {gt === 'cam-kartlar' && <CamKartlar {...ortak} />}
      {gt === 'koyu-neon' && <KoyuNeon {...ortak} />}
      {gt === 'yesil-artis' && <YesilArtis {...ortak} />}
      {gt === 'altin-premium' && <AltinPremium {...ortak} />}
      {gt === 'buyuk-rakam' && <BuyukRakam {...ortak} />}
    </WidgetKabuk>
  );
}
