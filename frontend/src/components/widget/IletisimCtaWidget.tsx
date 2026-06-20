import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

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

function MerkezBasit({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="text-center">
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`}>{widget.baslik}</h2>}
      {widget.aciklama && <p className="mx-auto mt-3 max-w-2xl opacity-90">{widget.aciklama}</p>}
      {widget.butonMetni && widget.butonLink && (
        <Link
          to={widget.butonLink}
          className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {widget.butonMetni}
        </Link>
      )}
    </div>
  );
}

function GradientBanner({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const { rozetMetni, ikinciButonMetni, ikinciButonLink } = tipEkOku(cfg);
  const vurgu = widget.arkaPlanRenk || '#f97316';

  return (
    <div
      className="iletisim-cta-gradient relative overflow-hidden rounded-3xl px-8 py-10 md:px-12 md:py-12"
      style={{
        background: `radial-gradient(ellipse at 30% 50%, ${vurgu}ee, ${vurgu} 70%)`,
        color: widget.yaziRenk || '#ffffff',
      }}
    >
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
          {widget.butonMetni && widget.butonLink && (
            <Link to={widget.butonLink} className="iletisim-cta-btn-birincil">
              {widget.butonMetni}
              <span aria-hidden>→</span>
            </Link>
          )}
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
  const vurgu = cfg.gorunum?.vurguRengi || '#f97316';

  return (
    <div className="iletisim-cta-split flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="max-w-lg">
        {widget.altBaslik && (
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mt-3 text-slate-600">{widget.aciklama}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        {widget.butonMetni && widget.butonLink && (
          <Link
            to={widget.butonLink}
            className="inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: vurgu }}
          >
            {widget.butonMetni}
          </Link>
        )}
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

export function IletisimCtaWidget({ widget }: IletisimCtaWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const gorunumTipi = widgetGorunumTipiAl(widget);

  return (
    <WidgetKabuk widget={widget}>
      {gorunumTipi === 'gradient-banner' && <GradientBanner widget={widget} cfg={cfg} />}
      {gorunumTipi === 'bol-split' && <BolSplit widget={widget} cfg={cfg} />}
      {(gorunumTipi === 'merkez-basit' || !['gradient-banner', 'bol-split'].includes(gorunumTipi)) && (
        <MerkezBasit widget={widget} cfg={cfg} />
      )}
    </WidgetKabuk>
  );
}
