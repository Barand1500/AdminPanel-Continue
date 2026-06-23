import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetEtiketKarti } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || 'var(--color-primary, #7c3aed)',
  };
}

function Baslik({ widget, cfg, ortala = true }: { widget: Widget; cfg: WidgetConfig; ortala?: boolean }) {
  if (!widget.baslik) return null;
  const renk = renkler(cfg);
  return (
    <h2
      className={`${baslikSinifi(cfg)} gek-baslik${ortala ? ' gek-baslik-orta' : ''}`}
      style={{ color: renk.baslik }}
    >
      {widget.baslik}
    </h2>
  );
}

function KartLink({
  k,
  className,
  style,
  children,
}: {
  k: WidgetEtiketKarti;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const href = k.link || '#';
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

function GorselImg({ k, cfg, sinif = '' }: { k: WidgetEtiketKarti; cfg: WidgetConfig; sinif?: string }) {
  if (!k.gorselUrl) return null;
  return (
    <img
      src={medyaUrl(k.gorselUrl)}
      alt={k.etiket}
      className={`gek-gorsel ${gorselSinifi(cfg)} ${sinif}`.trim()}
    />
  );
}

function MasonryGaleri({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="gek-masonry">
        {kartlar.map((k, i) => (
          <KartLink
            key={k.id}
            k={k}
            className={`gek-masonry-kart gek-masonry-kart-${(i % 3) + 1}`}
          >
            <div className="gek-masonry-gorsel-wrap">
              {k.gorselUrl ? (
                <GorselImg k={k} cfg={cfg} />
              ) : (
                <div className="gek-gorsel-bos">Görsel</div>
              )}
              <div className="gek-masonry-overlay">
                <span style={{ color: '#fff' }}>{k.etiket}</span>
                <span className="gek-ok-beyaz">→</span>
              </div>
            </div>
            <span className="gek-masonry-etiket" style={{ color: renk.baslik }}>
              {k.etiket}
            </span>
          </KartLink>
        ))}
      </div>
    </>
  );
}

function HeroMiniGrid({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(cfg);
  const [hero, ...mini] = kartlar;

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="gek-hero-grid">
        <KartLink
          k={hero}
          className="gek-hero-kart"
          style={{ background: `linear-gradient(135deg, ${renk.vurgu}14, ${renk.vurgu}06)` }}
        >
          <div className="gek-hero-gorsel">
            {hero.gorselUrl ? <GorselImg k={hero} cfg={cfg} /> : <div className="gek-gorsel-bos">Görsel</div>}
          </div>
          <div className="gek-hero-metin">
            <h3 style={{ color: renk.baslik }}>{hero.etiket}</h3>
            <span className="gek-hero-git" style={{ color: renk.vurgu }}>
              Keşfet →
            </span>
          </div>
        </KartLink>
        {mini.length > 0 && (
          <div className="gek-mini-grid">
            {mini.map((k) => (
              <KartLink key={k.id} k={k} className="gek-mini-kart" style={{ borderColor: `${renk.vurgu}33` }}>
                <div className="gek-mini-gorsel">
                  {k.gorselUrl ? <GorselImg k={k} cfg={cfg} /> : <div className="gek-gorsel-bos gek-gorsel-bos-kucuk">—</div>}
                </div>
                <span style={{ color: renk.baslik }}>{k.etiket}</span>
              </KartLink>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function HoverZoom({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(cfg);
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className={`gek-zoom-grid gek-zoom-grid-${Math.min(kolon, 4)}`}>
        {kartlar.map((k) => (
          <KartLink key={k.id} k={k} className="gek-zoom-kart group">
            <div className="gek-zoom-gorsel">
              {k.gorselUrl ? (
                <GorselImg k={k} cfg={cfg} sinif="gek-zoom-img" />
              ) : (
                <div className="gek-gorsel-bos">Görsel</div>
              )}
            </div>
            <div className="gek-zoom-reveal" style={{ background: renk.vurgu }}>
              <span>{k.etiket}</span>
              <span>→</span>
            </div>
          </KartLink>
        ))}
      </div>
    </>
  );
}

function PolaroidKolaj({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="gek-polaroid-grid">
        {kartlar.map((k, i) => (
          <KartLink
            key={k.id}
            k={k}
            className={`gek-polaroid-oge${i % 2 === 1 ? ' gek-polaroid-ters' : ''}`}
          >
            <figure className="gek-polaroid-cerceve">
              {k.gorselUrl ? (
                <GorselImg k={k} cfg={cfg} />
              ) : (
                <div className="gek-gorsel-bos gek-polaroid-bos">Görsel</div>
              )}
              <figcaption className="gek-polaroid-etiket" style={{ color: renk.baslik }}>
                {k.etiket}
              </figcaption>
            </figure>
          </KartLink>
        ))}
      </div>
    </>
  );
}

function SplitPanel({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);
  const secili = kartlar[aktif] ?? kartlar[0];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} ortala={false} />
      <div className="gek-split">
        <KartLink k={secili} className="gek-split-buyuk">
          {secili.gorselUrl ? (
            <GorselImg k={secili} cfg={cfg} />
          ) : (
            <div className="gek-gorsel-bos">Görsel</div>
          )}
          <div className="gek-split-buyuk-etiket" style={{ background: `${renk.vurgu}ee` }}>
            <span>{secili.etiket}</span>
            <span>→</span>
          </div>
        </KartLink>
        <div className="gek-split-liste" role="tablist">
          {kartlar.map((k, i) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={i === aktif}
              className={`gek-split-tus${i === aktif ? ' gek-split-tus-aktif' : ''}`}
              style={
                i === aktif
                  ? { borderColor: renk.vurgu, background: `${renk.vurgu}10` }
                  : undefined
              }
              onClick={() => setAktif(i)}
            >
              <span className="gek-split-thumb">
                {k.gorselUrl ? (
                  <img src={medyaUrl(k.gorselUrl)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="gek-thumb-bos">—</span>
                )}
              </span>
              <span style={{ color: renk.baslik }}>{k.etiket}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function FlipKart({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(cfg);
  const kolon = cfg.gorunum?.kolonSayisi ?? 3;

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className={`gek-flip-grid gek-flip-grid-${Math.min(kolon, 4)}`}>
        {kartlar.map((k) => (
          <KartLink key={k.id} k={k} className="gek-flip-kart">
            <div className="gek-flip-ic">
              <div className="gek-flip-on">
                {k.gorselUrl ? (
                  <GorselImg k={k} cfg={cfg} />
                ) : (
                  <div className="gek-gorsel-bos">Görsel</div>
                )}
              </div>
              <div className="gek-flip-arka" style={{ background: renk.vurgu }}>
                <span className="gek-flip-etiket">{k.etiket}</span>
                <span className="gek-flip-git">Görüntüle →</span>
              </div>
            </div>
          </KartLink>
        ))}
      </div>
    </>
  );
}

export function GorselEtiketKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.etiketKartlar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (kartlar.length === 0) return null;

  const ortak = { widget, cfg, kartlar };
  let icerik: ReactNode;

  switch (gt) {
    case 'masonry-galeri':
      icerik = <MasonryGaleri {...ortak} />;
      break;
    case 'hero-mini-grid':
      icerik = <HeroMiniGrid {...ortak} />;
      break;
    case 'hover-zoom':
      icerik = <HoverZoom {...ortak} />;
      break;
    case 'polaroid-kolaj':
      icerik = <PolaroidKolaj {...ortak} />;
      break;
    case 'split-panel':
      icerik = <SplitPanel {...ortak} />;
      break;
    case 'flip-kart':
      icerik = <FlipKart {...ortak} />;
      break;
    default:
      icerik = <MasonryGaleri {...ortak} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
