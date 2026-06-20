import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function MetinBlok({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  const ikonKartlar = cfg.ikonKartlar ?? [];
  return (
    <div>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: 'var(--widget-baslik-renk)' }}>
          {widget.baslik}
        </h2>
      )}
      {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
      {ikonKartlar.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ikonKartlar.map((k) => (
            <div key={k.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-2xl text-primary">{k.ikon}</span>
              <span className="text-sm font-semibold text-slate-800">{k.metin}</span>
            </div>
          ))}
        </div>
      )}
      {widget.butonLink && widget.butonMetni && (
        <a
          href={widget.butonLink}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          ▶ {widget.butonMetni}
        </a>
      )}
    </div>
  );
}

export function BaslikMetinGorselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);
  const gorselUrl = widget.gorselUrl;
  const gorsel = gorselUrl ? (
    <img src={medyaUrl(gorselUrl)} alt="" className={`rounded-2xl ${gorselSinifi(cfg)}`} />
  ) : null;
  const metin = <MetinBlok widget={widget} cfg={cfg} />;

  if (gt === 'overlay-koyu' && gorsel) {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bmg-overlay-koyu relative min-h-[420px] overflow-hidden rounded-2xl">
          <img src={medyaUrl(gorselUrl!)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="relative z-10 flex max-w-xl flex-col justify-center p-8 text-white md:p-12">{metin}</div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'kart-mor') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bmg-kart-mor rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-100 p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {gorsel && <div>{gorsel}</div>}
            <div>{metin}</div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'gradient-arkaplan') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bmg-gradient-arkaplan overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>{metin}</div>
            {gorsel && <div className="rounded-2xl ring-4 ring-white/30">{gorsel}</div>}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'mint-cerceve') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bmg-mint-cerceve rounded-2xl border-4 border-teal-400 bg-teal-50/50 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {gorsel && <div className="flex-1">{gorsel}</div>}
            <div className="flex-1">{metin}</div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'okyanus-split') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bmg-okyanus-split grid overflow-hidden rounded-2xl shadow-lg md:grid-cols-2">
          <div className="flex flex-col justify-center bg-gradient-to-br from-sky-600 to-blue-700 p-8 text-white md:p-10">
            {metin}
          </div>
          <div className="relative min-h-[280px] bg-sky-100">
            {gorsel ? (
              <img src={medyaUrl(gorselUrl!)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sky-400">Görsel</div>
            )}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  const duzen = cfg.gorunum?.icerikDuzeni ?? 'sol';
  const flexClass =
    duzen === 'ust'
      ? 'flex flex-col gap-6'
      : duzen === 'alt'
        ? 'flex flex-col-reverse gap-6'
        : duzen === 'sag'
          ? 'flex flex-col gap-6 md:flex-row-reverse md:items-center'
          : 'flex flex-col gap-6 md:flex-row md:items-center';

  return (
    <WidgetKabuk widget={widget}>
      <div className={`bmg-yan-yana ${flexClass}`}>
        {gorsel && <div className="min-w-0 flex-1">{gorsel}</div>}
        <div className="min-w-0 flex-1">{metin}</div>
      </div>
    </WidgetKabuk>
  );
}
