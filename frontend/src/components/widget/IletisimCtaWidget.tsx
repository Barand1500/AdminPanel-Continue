import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

interface IletisimCtaWidgetProps {
  widget: Widget;
}

function tipEkOku(cfg: WidgetConfig) {
  const ek = cfg.gorunum?.tipEk ?? {};
  return {
    rozetMetni: (ek.rozetMetni as string) || 'Hazır Mısınız?',
    ikinciButonMetni: (ek.ikinciButonMetni as string) || 'Tüm Özellikler',
    ikinciButonLink: (ek.ikinciButonLink as string) || '#',
  };
}

function CtaArkaPlanGorseli({ cfg, koyu = false }: { cfg: WidgetConfig; koyu?: boolean }) {
  const gorselUrl = cfg.gorunum?.ctaArkaPlanGorselUrl?.trim();
  if (!gorselUrl) return null;

  return (
    <>
      <img
        src={medyaUrl(gorselUrl)}
        alt=""
        aria-hidden="true"
        className="iletisim-cta-arka-gorsel"
      />
      <span
        aria-hidden="true"
        className={`iletisim-cta-arka-katman${koyu ? ' iletisim-cta-arka-katman-koyu' : ''}`}
      />
    </>
  );
}

function BirincilCta({
  widget,
  cfg,
  className,
  sonOk = false,
  style,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  className: string;
  sonOk?: boolean;
  style?: CSSProperties;
}) {
  if (!widget.butonMetni || !widget.butonLink) return null;
  const ikon = cfg.gorunum?.ctaButonIkon?.trim();

  return (
    <Link to={widget.butonLink} className={className} style={style}>
      {ikon && <span className="iletisim-cta-btn-ikon" aria-hidden="true">{ikon}</span>}
      <span>{widget.butonMetni}</span>
      {sonOk && <span aria-hidden="true">→</span>}
    </Link>
  );
}

function MerkezBasit({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="relative overflow-hidden text-center">
      <CtaArkaPlanGorseli cfg={cfg} />
      <div className="relative z-10">
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mx-auto mt-3 max-w-2xl opacity-90">{widget.aciklama}</p>}
        <BirincilCta
          widget={widget}
          cfg={cfg}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        />
      </div>
    </div>
  );
}

function GradientBanner({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const { rozetMetni, ikinciButonMetni, ikinciButonLink } = tipEkOku(cfg);
  const vurgu = widget.arkaPlanRenk || cfg.gorunum?.vurguRengi || '#111827';

  return (
    <div
      className="iletisim-cta-gradient relative overflow-hidden rounded-3xl px-8 py-10 md:px-12 md:py-12"
      style={{
        background: `radial-gradient(ellipse at 30% 50%, ${vurgu}ee, ${vurgu} 70%)`,
        color: widget.yaziRenk || '#ffffff',
      }}
    >
      <CtaArkaPlanGorseli cfg={cfg} koyu />
      <div className="iletisim-cta-gradient-dekor" aria-hidden />
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="iletisim-cta-rozet">{rozetMetni}</span>
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} mt-4 font-bold text-white`}>{widget.baslik}</h2>
          )}
          {widget.aciklama && <p className="mt-3 text-white/90">{widget.aciklama}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <BirincilCta widget={widget} cfg={cfg} className="iletisim-cta-btn-birincil" sonOk />
          <Link to={ikinciButonLink} className="iletisim-cta-btn-ikincil">
            {ikinciButonMetni}
          </Link>
        </div>
      </div>
    </div>
  );
}

function BolSplit({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const { ikinciButonMetni, ikinciButonLink } = tipEkOku(cfg);
  const vurgu = cfg.gorunum?.vurguRengi || widget.yaziRenk || '#111827';

  return (
    <div className="iletisim-cta-split relative flex flex-col gap-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
      <CtaArkaPlanGorseli cfg={cfg} />
      <div className="relative z-10 max-w-lg">
        {widget.altBaslik && (
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mt-3 text-slate-600">{widget.aciklama}</p>}
      </div>
      <div className="relative z-10 flex flex-wrap gap-3">
        <BirincilCta
          widget={widget}
          cfg={cfg}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: vurgu }}
        />
        <Link
          to={ikinciButonLink}
          className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {ikinciButonMetni}
        </Link>
      </div>
    </div>
  );
}

function KoyuCam({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const { rozetMetni, ikinciButonMetni, ikinciButonLink } = tipEkOku(cfg);
  const vurgu = cfg.gorunum?.vurguRengi || '#111827';
  return (
    <div className="iletisim-cta-koyu-cam relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 px-8 py-10 text-white backdrop-blur-md md:px-12">
      <CtaArkaPlanGorseli cfg={cfg} koyu />
      <div className="relative z-10">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{rozetMetni}</span>
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-4 font-bold`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mt-3 text-slate-300">{widget.aciklama}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <BirincilCta
            widget={widget}
            cfg={cfg}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: vurgu }}
          />
          <Link to={ikinciButonLink} className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
            {ikinciButonMetni}
          </Link>
        </div>
      </div>
    </div>
  );
}

function MorSerit({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const { ikinciButonMetni, ikinciButonLink } = tipEkOku(cfg);
  return (
    <div className="iletisim-cta-mor-serit relative -mx-4 overflow-hidden rounded-none bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-10 text-white sm:-mx-6 md:rounded-2xl">
      <CtaArkaPlanGorseli cfg={cfg} koyu />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`}>{widget.baslik}</h2>}
          {widget.aciklama && <p className="mt-2 text-purple-100">{widget.aciklama}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <BirincilCta
            widget={widget}
            cfg={cfg}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-purple-700"
          />
          <Link to={ikinciButonLink} className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold">
            {ikinciButonMetni}
          </Link>
        </div>
      </div>
    </div>
  );
}

function YesilCerceve({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-8 text-center md:p-10">
      <CtaArkaPlanGorseli cfg={cfg} />
      <div className="relative z-10">
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-emerald-950`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mx-auto mt-3 max-w-xl text-emerald-800">{widget.aciklama}</p>}
        <BirincilCta
          widget={widget}
          cfg={cfg}
          className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 bg-white px-8 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white"
        />
      </div>
    </div>
  );
}

export function IletisimCtaWidget({ widget }: IletisimCtaWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'gradient-banner' && <GradientBanner widget={widget} cfg={cfg} />}
      {gt === 'bol-split' && <BolSplit widget={widget} cfg={cfg} />}
      {gt === 'koyu-cam' && <KoyuCam widget={widget} cfg={cfg} />}
      {gt === 'mor-serit' && <MorSerit widget={widget} cfg={cfg} />}
      {gt === 'yesil-cerceve' && <YesilCerceve widget={widget} cfg={cfg} />}
      {gt === 'merkez-basit' && <MerkezBasit widget={widget} cfg={cfg} />}
    </WidgetKabuk>
  );
}
