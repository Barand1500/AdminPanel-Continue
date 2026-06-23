import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetLinkOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, linkKartIkonu } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || 'var(--widget-baslik-renk, #0f172a)',
    metin: g.metinRengi || '#334155',
    vurgu: g.vurguRengi || g.baslikRengi || 'var(--color-primary, #7c3aed)',
  };
}

function Baslik({ widget, cfg, sinif = '' }: { widget: Widget; cfg: WidgetConfig; sinif?: string }) {
  if (!widget.baslik) return null;
  const renk = renkler(cfg);
  return (
    <h2 className={`${baslikSinifi(cfg)} lk-baslik ${sinif}`.trim()} style={{ color: renk.baslik }}>
      {widget.baslik}
    </h2>
  );
}

function LinkHref({
  l,
  className,
  style,
  children,
}: {
  l: WidgetLinkOgesi;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const href = l.link || '#';
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

const METRO_BOYUT: Record<number, string> = {
  0: 'lk-metro-buyuk',
  3: 'lk-metro-genis',
  5: 'lk-metro-yuksek',
};

function metroRenk(vurgu: string, i: number) {
  const tonlar = [vurgu, '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899'];
  return tonlar[i % tonlar.length];
}

function MetroTile({
  widget,
  cfg,
  linkler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  linkler: WidgetLinkOgesi[];
}) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="lk-metro-grid">
        {linkler.map((l, i) => (
          <LinkHref
            key={l.id}
            l={l}
            className={`lk-metro-kutu ${METRO_BOYUT[i] ?? ''}`}
            style={{
              background: `linear-gradient(145deg, ${metroRenk(renk.vurgu, i)}ee, ${metroRenk(renk.vurgu, i)}bb)`,
            }}
          >
            <span className="lk-metro-ikon">{linkKartIkonu(l.ikon)}</span>
            <span className="lk-metro-metin">{l.metin}</span>
          </LinkHref>
        ))}
      </div>
    </>
  );
}

function ChipSerit({
  widget,
  cfg,
  linkler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  linkler: WidgetLinkOgesi[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const renk = renkler(cfg);

  function kaydir(yon: 'sol' | 'sag') {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: yon === 'sol' ? -240 : 240, behavior: 'smooth' });
  }

  return (
    <>
      <div className="lk-chip-baslik">
        <Baslik widget={widget} cfg={cfg} />
        {linkler.length > 2 && (
          <div className="lk-chip-nav">
            <button type="button" className="lk-chip-ok" onClick={() => kaydir('sol')} aria-label="Önceki">
              ‹
            </button>
            <button type="button" className="lk-chip-ok" onClick={() => kaydir('sag')} aria-label="Sonraki">
              ›
            </button>
          </div>
        )}
      </div>
      <div ref={scrollRef} className="lk-chip-scroll">
        {linkler.map((l) => (
          <LinkHref
            key={l.id}
            l={l}
            className="lk-chip"
            style={{
              borderColor: `${renk.vurgu}44`,
              color: renk.metin,
              background: `${renk.vurgu}10`,
            }}
          >
            <span style={{ color: renk.vurgu }}>{linkKartIkonu(l.ikon)}</span>
            {l.metin}
          </LinkHref>
        ))}
      </div>
    </>
  );
}

function SidebarNav({
  widget,
  cfg,
  linkler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  linkler: WidgetLinkOgesi[];
}) {
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);
  const secili = linkler[aktif] ?? linkler[0];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="lk-sidebar">
        <nav className="lk-sidebar-nav" aria-label="Hızlı linkler">
          {linkler.map((l, i) => (
            <button
              key={l.id}
              type="button"
              className={`lk-sidebar-tus${i === aktif ? ' lk-sidebar-tus-aktif' : ''}`}
              style={
                i === aktif
                  ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}10` }
                  : { color: renk.metin }
              }
              onClick={() => setAktif(i)}
            >
              <span className="lk-sidebar-cizgi" style={{ background: renk.vurgu }} />
              <span>{linkKartIkonu(l.ikon)}</span>
              <span>{l.metin}</span>
            </button>
          ))}
        </nav>
        {secili && (
          <div className="lk-sidebar-panel" style={{ borderColor: `${renk.vurgu}33` }}>
            <span className="lk-sidebar-panel-ikon" style={{ color: renk.vurgu }}>
              {linkKartIkonu(secili.ikon)}
            </span>
            <h3 style={{ color: renk.baslik }}>{secili.metin}</h3>
            <p className="lk-sidebar-panel-yol" style={{ color: renk.metin }}>
              {secili.link || '/'}
            </p>
            <LinkHref l={secili} className="lk-sidebar-git" style={{ background: renk.vurgu }}>
              Sayfaya git →
            </LinkHref>
          </div>
        )}
      </div>
    </>
  );
}

function OrbitIkon({
  widget,
  cfg,
  linkler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  linkler: WidgetLinkOgesi[];
}) {
  const renk = renkler(cfg);
  const n = linkler.length;

  return (
    <div className="lk-orbit-alan">
      <div className="lk-orbit-merkez">
        <Baslik widget={widget} cfg={cfg} sinif="lk-baslik-orta" />
      </div>
      <div className="lk-orbit-halka" style={{ '--lk-orbit-n': n } as CSSProperties}>
        {linkler.map((l, i) => (
          <LinkHref
            key={l.id}
            l={l}
            className="lk-orbit-oge"
            style={{ '--lk-orbit-i': i } as CSSProperties}
          >
            <span className="lk-orbit-kart" style={{ borderColor: `${renk.vurgu}44`, color: renk.metin }}>
              <span className="lk-orbit-ikon" style={{ color: renk.vurgu }}>
                {linkKartIkonu(l.ikon)}
              </span>
              <span className="lk-orbit-metin">{l.metin}</span>
            </span>
          </LinkHref>
        ))}
      </div>
      <div className="lk-orbit-mobil">
        {linkler.map((l) => (
          <LinkHref
            key={l.id}
            l={l}
            className="lk-orbit-mobil-oge"
            style={{ borderColor: `${renk.vurgu}33`, color: renk.metin }}
          >
            <span style={{ color: renk.vurgu }}>{linkKartIkonu(l.ikon)}</span>
            {l.metin}
            <span className="lk-ok">→</span>
          </LinkHref>
        ))}
      </div>
    </div>
  );
}

function KartDestesi({
  widget,
  cfg,
  linkler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  linkler: WidgetLinkOgesi[];
}) {
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} sinif="lk-baslik-orta" />
      <div className="lk-deste-wrap">
        <div className="lk-deste" style={{ '--lk-deste-n': linkler.length } as CSSProperties}>
          {linkler.map((l, i) => (
            <LinkHref
              key={l.id}
              l={l}
              className="lk-deste-kart"
              style={
                {
                  '--lk-deste-i': i,
                  borderColor: `${renk.vurgu}44`,
                  zIndex: linkler.length - i,
                } as CSSProperties
              }
            >
              <span className="lk-deste-ikon" style={{ color: renk.vurgu }}>
                {linkKartIkonu(l.ikon)}
              </span>
              <span className="lk-deste-metin" style={{ color: renk.baslik }}>
                {l.metin}
              </span>
              <span className="lk-ok" style={{ color: renk.vurgu }}>
                →
              </span>
            </LinkHref>
          ))}
        </div>
      </div>
    </>
  );
}

function AccordionListe({
  widget,
  cfg,
  linkler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  linkler: WidgetLinkOgesi[];
}) {
  const [acikId, setAcikId] = useState<string | null>(linkler[0]?.id ?? null);
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="lk-accordion">
        {linkler.map((l) => {
          const acik = acikId === l.id;
          return (
            <div
              key={l.id}
              className={`lk-accordion-oge${acik ? ' lk-accordion-oge-acik' : ''}`}
              style={{ borderColor: acik ? renk.vurgu : 'rgba(15,23,42,0.1)' }}
            >
              <button
                type="button"
                className="lk-accordion-tus"
                aria-expanded={acik}
                onClick={() => setAcikId(acik ? null : l.id)}
              >
                <span className="lk-accordion-ikon" style={{ color: renk.vurgu }}>
                  {linkKartIkonu(l.ikon)}
                </span>
                <span className="lk-accordion-baslik" style={{ color: renk.baslik }}>
                  {l.metin}
                </span>
                <span className="lk-accordion-ok" style={{ color: renk.vurgu }}>
                  {acik ? '−' : '+'}
                </span>
              </button>
              {acik && (
                <div className="lk-accordion-icerik">
                  <p style={{ color: renk.metin }}>Hedef: {l.link || '/'}</p>
                  <LinkHref l={l} className="lk-accordion-git" style={{ color: renk.vurgu }}>
                    {l.metin} sayfasına git →
                  </LinkHref>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function LinkKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const linkler = cfg.linkler ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (linkler.length === 0) return null;

  const ortak = { widget, cfg, linkler };
  let icerik: ReactNode;

  switch (gt) {
    case 'metro-tile':
      icerik = <MetroTile {...ortak} />;
      break;
    case 'chip-serit':
      icerik = <ChipSerit {...ortak} />;
      break;
    case 'sidebar-nav':
      icerik = <SidebarNav {...ortak} />;
      break;
    case 'orbit-ikon':
      icerik = <OrbitIkon {...ortak} />;
      break;
    case 'kart-destesi':
      icerik = <KartDestesi {...ortak} />;
      break;
    case 'accordion-liste':
      icerik = <AccordionListe {...ortak} />;
      break;
    default:
      icerik = <MetroTile {...ortak} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
