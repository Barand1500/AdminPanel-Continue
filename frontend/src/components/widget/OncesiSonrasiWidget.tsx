import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || '#7c3aed',
    radius: g.borderRadius ?? 16,
    cizgi: g.vurguRengi || '#ffffff',
  };
}

function SurukleSlider({
  once,
  sonra,
  renk,
  sinif = '',
  tamGenis = false,
}: {
  once: string;
  sonra: string;
  renk: ReturnType<typeof renkler>;
  sinif?: string;
  tamGenis?: boolean;
}) {
  const [oran, setOran] = useState(50);
  const [genislik, setGenislik] = useState(0);
  const kapsayiciRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = kapsayiciRef.current;
    if (!el) return;
    const guncelle = () => setGenislik(el.offsetWidth);
    guncelle();
    const ro = new ResizeObserver(guncelle);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const surukle = useCallback((clientX: number) => {
    const el = kapsayiciRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const yuzde = ((clientX - rect.left) / rect.width) * 100;
    setOran(Math.min(98, Math.max(2, yuzde)));
  }, []);

  return (
    <div
      ref={kapsayiciRef}
      className={`oss-slider ${tamGenis ? 'oss-slider--tam' : ''} ${sinif}`}
      style={{ borderRadius: renk.radius }}
      onPointerDown={(e) => {
        surukle(e.clientX);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) surukle(e.clientX);
      }}
    >
      <img src={medyaUrl(sonra)} alt="Sonra" className="oss-slider-img" draggable={false} />
      <div className="oss-slider-once" style={{ width: `${oran}%` }}>
        <img
          src={medyaUrl(once)}
          alt="Önce"
          className="oss-slider-once-img"
          style={{ width: genislik || '100%' }}
          draggable={false}
        />
      </div>
      <div className="oss-slider-cizgi" style={{ left: `${oran}%`, background: renk.cizgi }}>
        <span className="oss-slider-tutamac" style={{ borderColor: renk.vurgu, color: renk.vurgu }}>
          ⟷
        </span>
      </div>
      <span className="oss-etiket oss-etiket-sol" style={{ backgroundColor: renk.vurgu }}>
        Önce
      </span>
      <span className="oss-etiket oss-etiket-sag">Sonra</span>
    </div>
  );
}

function BaslikBlok({
  widget,
  cfg,
  renk,
  ortala = false,
}: {
  widget: Widget;
  cfg: ReturnType<typeof configOkuFromWidget>;
  renk: ReturnType<typeof renkler>;
  ortala?: boolean;
}) {
  if (!widget.baslik && !widget.altBaslik && !widget.aciklama) return null;
  return (
    <header className={`oss-baslik ${ortala ? 'oss-baslik--ortala' : ''}`}>
      {widget.altBaslik && (
        <p className="oss-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} oss-baslik-metin`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="oss-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </header>
  );
}

function ToggleGecis({
  once,
  sonra,
  renk,
}: {
  once: string;
  sonra: string;
  renk: ReturnType<typeof renkler>;
}) {
  const [sonraGoster, setSonraGoster] = useState(false);
  return (
    <div className="oss-toggle">
      <div className="oss-toggle-btns" style={{ borderRadius: renk.radius }}>
        <button
          type="button"
          className={!sonraGoster ? 'oss-toggle-btn oss-toggle-btn--aktif' : 'oss-toggle-btn'}
          style={!sonraGoster ? { backgroundColor: renk.vurgu } : undefined}
          onClick={() => setSonraGoster(false)}
        >
          Önce
        </button>
        <button
          type="button"
          className={sonraGoster ? 'oss-toggle-btn oss-toggle-btn--aktif' : 'oss-toggle-btn'}
          style={sonraGoster ? { backgroundColor: renk.vurgu } : undefined}
          onClick={() => setSonraGoster(true)}
        >
          Sonra
        </button>
      </div>
      <div className="oss-toggle-gorsel" style={{ borderRadius: renk.radius }}>
        <img
          src={medyaUrl(sonraGoster ? sonra : once)}
          alt={sonraGoster ? 'Sonra' : 'Önce'}
          className="oss-toggle-img"
        />
      </div>
    </div>
  );
}

export function OncesiSonrasiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const once = cfg.onceGorsel ?? widget.gorselUrl ?? '';
  const sonra = cfg.sonraGorsel ?? '';
  const gt = widgetGorunumTipiAl(widget);
  const r = renkler(cfg);

  if (!once || !sonra) return null;

  if (gt === 'yan-yana-split') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="oss-yan-yana">
          <BaslikBlok widget={widget} cfg={cfg} renk={r} ortala />
          <div className="oss-yan-yana-grid">
            <figure className="oss-yan-kart" style={{ borderRadius: r.radius }}>
              <img src={medyaUrl(once)} alt="Önce" className="oss-yan-img" />
              <figcaption className="oss-yan-etiket" style={{ backgroundColor: r.vurgu }}>
                Önce
              </figcaption>
            </figure>
            <figure className="oss-yan-kart" style={{ borderRadius: r.radius }}>
              <img src={medyaUrl(sonra)} alt="Sonra" className="oss-yan-img" />
              <figcaption className="oss-yan-etiket oss-yan-etiket--sonra">Sonra</figcaption>
            </figure>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'ust-alt-dizilim') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="oss-ust-alt">
          <BaslikBlok widget={widget} cfg={cfg} renk={r} />
          <figure className="oss-ust-kart" style={{ borderRadius: r.radius }}>
            <img src={medyaUrl(once)} alt="Önce" className="oss-ust-img" />
            <span className="oss-ust-badge" style={{ backgroundColor: r.vurgu }}>
              Önce
            </span>
          </figure>
          <div className="oss-ust-ok" style={{ color: r.vurgu }}>
            ↓
          </div>
          <figure className="oss-ust-kart" style={{ borderRadius: r.radius }}>
            <img src={medyaUrl(sonra)} alt="Sonra" className="oss-ust-img" />
            <span className="oss-ust-badge oss-ust-badge--sonra">Sonra</span>
          </figure>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'toggle-gecis') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="oss-toggle-wrap">
          <BaslikBlok widget={widget} cfg={cfg} renk={r} ortala />
          <ToggleGecis once={once} sonra={sonra} renk={r} />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'tam-genis-band') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="oss-tam-band">
          <BaslikBlok widget={widget} cfg={cfg} renk={r} ortala />
          <SurukleSlider once={once} sonra={sonra} renk={r} tamGenis sinif="oss-slider--band" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cerceveli-ikili') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="oss-cerceve" style={{ borderColor: r.vurgu, borderRadius: r.radius }}>
          <BaslikBlok widget={widget} cfg={cfg} renk={r} ortala />
          <SurukleSlider once={once} sonra={sonra} renk={r} />
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="oss-varsayilan">
        <BaslikBlok widget={widget} cfg={cfg} renk={r} ortala />
        <SurukleSlider once={once} sonra={sonra} renk={r} />
      </div>
    </WidgetKabuk>
  );
}
