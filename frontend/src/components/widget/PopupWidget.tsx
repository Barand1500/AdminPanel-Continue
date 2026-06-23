import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { configOkuFromWidget } from './widgetHelpers';

interface PopupWidgetProps {
  widget: Widget;
  onizleme?: boolean;
}

function popupRenkler(cfg: WidgetConfig, widget: Widget) {
  const g = cfg.gorunum ?? {};
  return {
    panel: widget.arkaPlanRenk || '#ffffff',
    baslik: g.baslikRengi || widget.yaziRenk || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || 'var(--color-primary, #7c3aed)',
    radius: g.borderRadius ?? 16,
  };
}

function KapatTusu({ kapat, renk }: { kapat: () => void; renk?: string }) {
  return (
    <button
      type="button"
      onClick={kapat}
      className="pp-kapat"
      style={{ color: renk ?? '#94a3b8' }}
      aria-label="Kapat"
    >
      ✕
    </button>
  );
}

function PopupGovde({
  widget,
  cfg,
  kapat,
  stil,
  className,
  baslikSinif = 'pp-baslik',
  metinSinif = 'pp-metin',
  yatay,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kapat: () => void;
  stil?: CSSProperties;
  className?: string;
  baslikSinif?: string;
  metinSinif?: string;
  yatay?: boolean;
}) {
  const renk = popupRenkler(cfg, widget);
  const link = widget.butonLink?.trim();

  const cta = widget.butonMetni ? (
    link?.startsWith('/') ? (
      <Link to={link} className="pp-cta" style={{ backgroundColor: renk.vurgu, borderRadius: renk.radius }}>
        {widget.butonMetni}
      </Link>
    ) : link ? (
      <a
        href={link.startsWith('http') ? link : `https://${link}`}
        className="pp-cta"
        style={{ backgroundColor: renk.vurgu, borderRadius: renk.radius }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {widget.butonMetni}
      </a>
    ) : (
      <span className="pp-cta" style={{ backgroundColor: renk.vurgu, borderRadius: renk.radius }}>
        {widget.butonMetni}
      </span>
    )
  ) : null;

  return (
    <div className={`pp-govde ${yatay ? 'pp-govde-yatay' : ''} ${className ?? ''}`} style={{ ...stil, borderRadius: renk.radius, backgroundColor: renk.panel }}>
      <KapatTusu kapat={kapat} renk={renk.metin} />
      <div className="pp-icerik">
        {widget.baslik && (
          <h3 className={baslikSinif} style={{ color: renk.baslik }}>
            {widget.baslik}
          </h3>
        )}
        {widget.aciklama && (
          <p className={metinSinif} style={{ color: renk.metin }}>
            {widget.aciklama}
          </p>
        )}
        {cta}
      </div>
    </div>
  );
}

function Overlay({ kapat, children }: { kapat: () => void; children: ReactNode }) {
  return (
    <div className="pp-overlay-wrap">
      <button type="button" className="pp-overlay" aria-label="Kapat" onClick={kapat} />
      {children}
    </div>
  );
}

export function PopupWidget({ widget, onizleme }: PopupWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const gecikme = (cfg.popupGecikme ?? 3) * 1000;
  const [acik, setAcik] = useState(onizleme ?? false);
  const gt = widgetGorunumTipiAl(widget);
  const renk = popupRenkler(cfg, widget);
  const kapat = () => setAcik(false);

  useEffect(() => {
    if (onizleme) {
      setAcik(true);
      return;
    }
    const zamanlayici = window.setTimeout(() => setAcik(true), gecikme);
    return () => window.clearTimeout(zamanlayici);
  }, [gecikme, onizleme]);

  if (!acik) return null;

  if (gt === 'alt-kaydirma') {
    return (
      <div className="pp-alt-kaydirma">
        <button type="button" className="pp-overlay" aria-label="Kapat" onClick={kapat} />
        <PopupGovde widget={widget} cfg={cfg} kapat={kapat} className="pp-alt-panel" />
      </div>
    );
  }

  if (gt === 'sag-kose') {
    return (
      <div className="pp-sag-kose">
        <PopupGovde
          widget={widget}
          cfg={cfg}
          kapat={kapat}
          className="pp-kose-kart"
          baslikSinif="pp-baslik pp-baslik-kucuk"
          metinSinif="pp-metin pp-metin-kucuk"
        />
      </div>
    );
  }

  if (gt === 'cam-kart') {
    return (
      <Overlay kapat={kapat}>
        <PopupGovde
          widget={widget}
          cfg={cfg}
          kapat={kapat}
          className="pp-cam-kart"
          stil={{
            background: `linear-gradient(145deg, ${renk.panel}f5, ${renk.vurgu}18)`,
            border: `1px solid ${renk.vurgu}44`,
            boxShadow: `0 24px 64px ${renk.vurgu}33`,
          }}
        />
      </Overlay>
    );
  }

  if (gt === 'ust-serit') {
    return (
      <div className="pp-ust-serit" style={{ background: `linear-gradient(135deg, ${renk.vurgu}, ${renk.vurgu}cc)` }}>
        <KapatTusu kapat={kapat} renk="rgba(255,255,255,0.85)" />
        <div className="pp-ust-icerik">
          {widget.baslik && <p className="pp-ust-baslik">{widget.baslik}</p>}
          {widget.aciklama && <p className="pp-ust-metin">{widget.aciklama}</p>}
          {widget.butonMetni && widget.butonLink && (
            <a
              href={widget.butonLink}
              className="pp-ust-cta"
              style={{ color: renk.vurgu, borderRadius: renk.radius }}
            >
              {widget.butonMetni}
            </a>
          )}
        </div>
      </div>
    );
  }

  if (gt === 'pill-bildirim') {
    return (
      <div className="pp-pill-wrap">
        <PopupGovde
          widget={widget}
          cfg={cfg}
          kapat={kapat}
          className="pp-pill"
          yatay
          baslikSinif="pp-baslik pp-baslik-kucuk"
          metinSinif="pp-metin pp-metin-kucuk"
          stil={{ border: `1px solid ${renk.vurgu}33`, boxShadow: `0 8px 32px ${renk.vurgu}22` }}
        />
      </div>
    );
  }

  return (
    <Overlay kapat={kapat}>
      <PopupGovde
        widget={widget}
        cfg={cfg}
        kapat={kapat}
        className="pp-modal"
        stil={{ boxShadow: '0 24px 64px rgba(15, 23, 42, 0.2)' }}
      />
    </Overlay>
  );
}
