import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetSayac } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { sayacDegerGoster } from '@/utils/sayacYardimci';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  if (!widget.baslik && !widget.altBaslik) return null;
  return (
    <div className="mb-8 text-center sm:mb-10">
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
    </div>
  );
}

function SayacHucre({ s, sinif }: { s: WidgetSayac; sinif?: string }) {
  return (
    <div className={sinif}>
      {s.ikon?.trim() ? (
        <span className="text-2xl" aria-hidden>
          {s.ikon}
        </span>
      ) : null}
      <p className="text-3xl font-bold md:text-4xl">
        {sayacDegerGoster(s.deger)}
        {s.sonEk}
      </p>
      {s.etiket?.trim() ? <p className="mt-1 text-sm text-slate-500">{s.etiket}</p> : null}
    </div>
  );
}

function BuyukRakam({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s) => (
          <SayacHucre
            key={s.id}
            s={s}
            sinif="text-center"
          />
        ))}
      </div>
    </>
  );
}

function PillSerit({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
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
              <SayacHucre s={s} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CamKartlar({ widget, cfg, sayaclar }: { widget: Widget; cfg: WidgetConfig; sayaclar: WidgetSayac[] }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-100 p-8">
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-white/60 bg-white/50 p-6 text-center shadow-md backdrop-blur-md"
          >
            <SayacHucre s={s} />
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
        {sayaclar.map((s) => (
          <div key={s.id} className="text-center">
            {s.ikon?.trim() ? <span className="text-2xl" aria-hidden>{s.ikon}</span> : null}
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
        {sayaclar.map((s) => (
          <div key={s.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start justify-between">
              {s.ikon?.trim() ? <span className="text-xl" aria-hidden>{s.ikon}</span> : <span />}
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
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sayaclar.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-6 text-center shadow-sm"
          >
            {s.ikon?.trim() ? <span className="text-2xl text-amber-600" aria-hidden>{s.ikon}</span> : null}
            <p className="mt-2 text-3xl font-bold text-amber-800 md:text-4xl">
              {sayacDegerGoster(s.deger)}
              {s.sonEk}
            </p>
            {s.etiket?.trim() ? <p className="mt-1 text-sm font-medium text-amber-700">{s.etiket}</p> : null}
          </div>
        ))}
      </div>
    </>
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
