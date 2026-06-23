import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetGorselGridKart } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || '#7c3aed',
    radius: g.borderRadius ?? 14,
  };
}

function kartlariFiltrele(kartlar: WidgetGorselGridKart[], filtreler: string[], seciliIndeks: number) {
  if (filtreler.length === 0 || seciliIndeks === 0) return kartlar;
  const seciliKategori = filtreler[seciliIndeks];
  return kartlar.filter((k) => !k.filtreEtiketi || k.filtreEtiketi === seciliKategori);
}

function KartLink({
  href,
  className,
  style,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  );
}

function BolumBaslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const renk = renkler(cfg);
  if (!widget.baslik && !widget.altBaslik && !widget.aciklama) return null;
  return (
    <div className="ggb-bolum-baslik">
      {widget.altBaslik && (
        <p className="ggb-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} ggb-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="ggb-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function SolPanel({
  cfg,
  filtreler,
  seciliIndeks,
  setSeciliIndeks,
}: {
  cfg: WidgetConfig;
  filtreler: string[];
  seciliIndeks: number;
  setSeciliIndeks: (i: number) => void;
}) {
  const renk = renkler(cfg);
  const [acik, setAcik] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acik) return;
    function disari(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAcik(false);
    }
    document.addEventListener('mousedown', disari);
    return () => document.removeEventListener('mousedown', disari);
  }, [acik]);

  if (!cfg.solBaslik && !cfg.solAciklama && filtreler.length === 0) return null;

  return (
    <div className="ggb-sol-panel-kart" style={{ borderRadius: `${renk.radius}px` }}>
      {cfg.solBaslik && (
        <h3 className="ggb-sol-baslik" style={{ color: renk.baslik }}>
          {cfg.solBaslik}
        </h3>
      )}
      {cfg.solAciklama && (
        <p className="ggb-sol-aciklama" style={{ color: renk.metin }}>
          {cfg.solAciklama}
        </p>
      )}
      {filtreler.length > 0 && (
        <div ref={ref} className="ggb-filtre-dropdown">
          <button type="button" className="ggb-filtre-tus" onClick={() => setAcik((o) => !o)}>
            {filtreler[seciliIndeks] ?? filtreler[0]}
            <span>▾</span>
          </button>
          {acik && (
            <ul className="ggb-filtre-liste">
              {filtreler.map((f, i) => (
                <li key={f}>
                  <button
                    type="button"
                    className={i === seciliIndeks ? 'ggb-filtre-aktif' : ''}
                    onClick={() => {
                      setSeciliIndeks(i);
                      setAcik(false);
                    }}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function OverlayKart({ k, cfg, sinif = '' }: { k: WidgetGorselGridKart; cfg: WidgetConfig; sinif?: string }) {
  const renk = renkler(cfg);
  return (
    <KartLink href={k.link || '#'} className={`ggb-overlay-kart ${sinif}`.trim()} style={{ borderRadius: `${renk.radius}px` }}>
      {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className="ggb-kart-gorsel" />}
      <div className="ggb-overlay-gradient" />
      <span className="ggb-overlay-etiket">{k.etiket}</span>
    </KartLink>
  );
}

function FlipKart({ k, cfg }: { k: WidgetGorselGridKart; cfg: WidgetConfig }) {
  const renk = renkler(cfg);
  return (
    <div className="ggb-flip-kapsul" style={{ borderRadius: `${renk.radius}px` }}>
      <div className="ggb-flip-inner">
        <div className="ggb-flip-on" style={{ borderRadius: `${renk.radius}px` }}>
          {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className="ggb-flip-gorsel" />}
          <span className="ggb-flip-on-etiket">{k.etiket}</span>
        </div>
        <div className="ggb-flip-arka" style={{ borderRadius: `${renk.radius}px`, background: renk.vurgu }}>
          <span className="ggb-flip-arka-etiket">{k.etiket}</span>
          {k.aciklama && <p className="ggb-flip-arka-metin">{k.aciklama}</p>}
          {k.link && <span className="ggb-flip-git">Git →</span>}
        </div>
      </div>
    </div>
  );
}

function ZoomKart({ k, cfg }: { k: WidgetGorselGridKart; cfg: WidgetConfig }) {
  const renk = renkler(cfg);
  return (
    <KartLink href={k.link || '#'} className="ggb-zoom-kart" style={{ borderRadius: `${renk.radius}px` }}>
      {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className="ggb-zoom-gorsel" />}
      <div className="ggb-zoom-etiket">
        <span>{k.etiket}</span>
      </div>
    </KartLink>
  );
}

function BentoGrid({
  widget,
  cfg,
  kartlar,
  filtreler,
  seciliIndeks,
  setSeciliIndeks,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetGorselGridKart[];
  filtreler: string[];
  seciliIndeks: number;
  setSeciliIndeks: (i: number) => void;
}) {
  const renk = renkler(cfg);
  const [hero, ...mini] = kartlar;

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="ggb-bento-wrap">
        <SolPanel cfg={cfg} filtreler={filtreler} seciliIndeks={seciliIndeks} setSeciliIndeks={setSeciliIndeks} />
        <div className="ggb-bento-grid">
          {hero && (
            <KartLink href={hero.link || '#'} className="ggb-bento-hero" style={{ borderRadius: `${renk.radius}px` }}>
              {hero.gorselUrl && <img src={medyaUrl(hero.gorselUrl)} alt={hero.etiket} className="ggb-kart-gorsel" />}
              <div className="ggb-overlay-gradient" />
              <span className="ggb-overlay-etiket">{hero.etiket}</span>
            </KartLink>
          )}
          {mini.map((k, i) => (
            <OverlayKart key={k.id} k={k} cfg={cfg} sinif={`ggb-bento-hucre ggb-bento-hucre-${(i % 4) + 1}`} />
          ))}
        </div>
      </div>
    </>
  );
}

function SnapSerit({
  widget,
  cfg,
  kartlar,
  filtreler,
  seciliIndeks,
  setSeciliIndeks,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetGorselGridKart[];
  filtreler: string[];
  seciliIndeks: number;
  setSeciliIndeks: (i: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function kaydir(yon: 'sol' | 'sag') {
    scrollRef.current?.scrollBy({ left: yon === 'sol' ? -280 : 280, behavior: 'smooth' });
  }

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="ggb-snap-wrap">
        <SolPanel cfg={cfg} filtreler={filtreler} seciliIndeks={seciliIndeks} setSeciliIndeks={setSeciliIndeks} />
        <div className="ggb-snap-sag">
          {kartlar.length > 2 && (
            <div className="ggb-snap-nav">
              <button type="button" className="ggb-snap-ok" onClick={() => kaydir('sol')} aria-label="Önceki">‹</button>
              <button type="button" className="ggb-snap-ok" onClick={() => kaydir('sag')} aria-label="Sonraki">›</button>
            </div>
          )}
          <div className="ggb-snap-scroll" ref={scrollRef}>
            {kartlar.map((k) => (
              <OverlayKart key={k.id} k={k} cfg={cfg} sinif="ggb-snap-kart" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function HoverZoom({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetGorselGridKart[] }) {
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;
  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="ggb-zoom-grid" style={{ gridTemplateColumns: `repeat(${Math.min(kolon, 6)}, minmax(0, 1fr))` }}>
        {kartlar.map((k) => (
          <ZoomKart key={k.id} k={k} cfg={cfg} />
        ))}
      </div>
    </>
  );
}

function SekmeliPanel({
  widget,
  cfg,
  kartlar,
  filtreler,
  seciliIndeks,
  setSeciliIndeks,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetGorselGridKart[];
  filtreler: string[];
  seciliIndeks: number;
  setSeciliIndeks: (i: number) => void;
}) {
  const renk = renkler(cfg);
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      {(cfg.solBaslik || cfg.solAciklama) && (
        <div className="ggb-sekme-ust-metin">
          {cfg.solBaslik && <h3 style={{ color: renk.baslik }}>{cfg.solBaslik}</h3>}
          {cfg.solAciklama && <p style={{ color: renk.metin }}>{cfg.solAciklama}</p>}
        </div>
      )}
      {filtreler.length > 0 && (
        <div className="ggb-sekme-liste">
          {filtreler.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`ggb-sekme${i === seciliIndeks ? ' ggb-sekme-aktif' : ''}`}
              style={i === seciliIndeks ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` } : undefined}
              onClick={() => setSeciliIndeks(i)}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <div className="ggb-sekme-grid" style={{ gridTemplateColumns: `repeat(${Math.min(kolon, 4)}, minmax(0, 1fr))` }}>
        {kartlar.map((k) => (
          <OverlayKart key={k.id} k={k} cfg={cfg} />
        ))}
      </div>
    </>
  );
}

function HeroBannerGrid({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetGorselGridKart[] }) {
  const renk = renkler(cfg);
  const [hero, ...alt] = kartlar;
  const heroMetin =
    (cfg.gorunum?.tipEk?.heroBannerMetin as string) || cfg.solAciklama || widget.aciklama || '';

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      {hero && (
        <KartLink href={hero.link || '#'} className="ggb-hero-banner" style={{ borderRadius: `${renk.radius}px` }}>
          {hero.gorselUrl && <img src={medyaUrl(hero.gorselUrl)} alt={hero.etiket} className="ggb-hero-banner-gorsel" />}
          <div className="ggb-hero-banner-overlay" />
          <div className="ggb-hero-banner-metin">
            <span className="ggb-hero-banner-etiket">{hero.etiket}</span>
            {heroMetin && <p>{heroMetin}</p>}
          </div>
        </KartLink>
      )}
      <div className="ggb-hero-alt-grid">
        {alt.map((k) => (
          <OverlayKart key={k.id} k={k} cfg={cfg} sinif="ggb-hero-alt-kart" />
        ))}
      </div>
    </>
  );
}

function FlipKartGrid({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetGorselGridKart[] }) {
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;
  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="ggb-flip-grid" style={{ gridTemplateColumns: `repeat(${Math.min(kolon, 4)}, minmax(0, 1fr))` }}>
        {kartlar.map((k) => (
          <FlipKart key={k.id} k={k} cfg={cfg} />
        ))}
      </div>
    </>
  );
}

export function GorselGridBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.gridKartlar ?? [];
  const filtreler = cfg.filtreler ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const [seciliIndeks, setSeciliIndeks] = useState(0);

  if (kartlar.length === 0) return null;

  const gosterilen = kartlariFiltrele(kartlar, filtreler, seciliIndeks);
  const filtreOrtak = { filtreler, seciliIndeks, setSeciliIndeks };
  const ortak = { widget, cfg, kartlar: gosterilen, ...filtreOrtak };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'snap-serit' && <SnapSerit {...ortak} />}
      {gt === 'hover-zoom' && <HoverZoom widget={widget} cfg={cfg} kartlar={gosterilen} />}
      {gt === 'sekmeli-panel' && <SekmeliPanel {...ortak} />}
      {gt === 'hero-banner-grid' && <HeroBannerGrid widget={widget} cfg={cfg} kartlar={gosterilen} />}
      {gt === 'flip-kart' && <FlipKartGrid widget={widget} cfg={cfg} kartlar={gosterilen} />}
      {(gt === 'bento-grid' || !gt) && <BentoGrid {...ortak} />}
    </WidgetKabuk>
  );
}
