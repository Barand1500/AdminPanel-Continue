import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetEtiketKarti } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

function renkler(widget: Widget, cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || 'var(--widget-baslik-renk, #111827)',
    metin: g.metinRengi || widget.yaziRenk || 'var(--widget-metin-renk, #4b5563)',
    // Üst etiket başlıktan bağımsızdır. Eski içeriklerde genel yazı rengi
    // mantıklı bir geri dönüş değeri olur; yeni içeriklerde Vurgu seçicisi kullanılır.
    vurgu: g.vurguRengi || widget.yaziRenk || '#111827',
  };
}

function Baslik({ widget, cfg, ortala = true }: { widget: Widget; cfg: WidgetConfig; ortala?: boolean }) {
  if (!widget.baslik && !widget.altBaslik) return null;
  const renk = renkler(widget, cfg);
  return (
    <div className={`gek-baslik${ortala ? ' gek-baslik-orta' : ''}`}>
      {widget.altBaslik && <p className="gek-alt-baslik" style={{ color: renk.vurgu }}>{widget.altBaslik}</p>}
      {widget.baslik && (
        <h2 className={baslikSinifi(cfg)} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
    </div>
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

function GorselImg({
  k,
  cfg,
  sinif = '',
  kutuIci = false,
}: {
  k: WidgetEtiketKarti;
  cfg: WidgetConfig;
  sinif?: string;
  /** Kartın kendi oranını koruduğu medya alanlarında genel max-height / rounded sınıflarını kullanma. */
  kutuIci?: boolean;
}) {
  if (!k.gorselUrl) return null;
  return (
    <img
      src={medyaUrl(k.gorselUrl)}
      alt={k.etiket}
      className={`gek-gorsel${kutuIci ? '' : ` ${gorselSinifi(cfg)}`} ${sinif}`.trim()}
    />
  );
}

function UrunGrubuKartlari({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(widget, cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="gek-urun-grup-grid">
        {kartlar.slice(0, 3).map((k) => (
          <KartLink key={k.id} k={k} className="gek-urun-grup-kart">
            <div className="gek-urun-grup-gorsel">
              {k.gorselUrl ? (
                <GorselImg k={k} cfg={cfg} kutuIci />
              ) : (
                <div className="gek-gorsel-bos">Görsel</div>
              )}
            </div>
            <div className="gek-urun-grup-footer">
              <h3 className="gek-urun-grup-baslik" style={{ color: renk.metin }}>{k.etiket}</h3>
            </div>
          </KartLink>
        ))}
      </div>
    </>
  );
}

function HeroMiniGrid({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(widget, cfg);
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
  const renk = renkler(widget, cfg);
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
  const renk = renkler(widget, cfg);

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
  const renk = renkler(widget, cfg);
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

type UrunVitrinKarti = WidgetEtiketKarti & {
  rozet?: string;
  aciklama?: string;
  kisaAciklama?: string;
  fiyat?: string;
  eskiFiyat?: string;
};

function OneCikanUrunKaruseli({ widget, cfg, kartlar }: { widget: Widget; cfg: WidgetConfig; kartlar: WidgetEtiketKarti[] }) {
  const renk = renkler(widget, cfg);
  const seritRef = useRef<HTMLDivElement>(null);
  const seritId = `gek-onecikan-urun-${widget.id}`;

  const kaydir = (yon: -1 | 1) => {
    const serit = seritRef.current;
    const kart = serit?.querySelector<HTMLElement>('.gek-onecikan-urun-kart');
    if (!serit || !kart) return;

    const kartGenisligi = kart.getBoundingClientRect().width;
    const aralik = Number.parseFloat(window.getComputedStyle(serit).gap) || 0;
    serit.scrollBy({ left: yon * (kartGenisligi + aralik), behavior: 'smooth' });
  };

  return (
    <>
      <Baslik widget={widget} cfg={cfg} ortala={false} />
      <div
        id={seritId}
        ref={seritRef}
        className="gek-onecikan-urun-serit"
        role="region"
        aria-label={widget.baslik || 'Öne çıkan ürünler'}
        style={{ '--gek-urun-vurgu': renk.vurgu } as CSSProperties}
      >
        {kartlar.map((k) => {
          const urun = k as UrunVitrinKarti;
          const fiyatVar = Boolean(urun.fiyat || urun.eskiFiyat);

          return (
            <KartLink key={k.id} k={k} className="gek-onecikan-urun-kart">
              <div className="gek-onecikan-urun-gorsel">
                {k.gorselUrl ? (
                  <GorselImg k={k} cfg={cfg} kutuIci />
                ) : (
                  <div className="gek-gorsel-bos">Görsel</div>
                )}
                {fiyatVar && (
                  <span className="gek-onecikan-urun-fiyatlar">
                    {urun.eskiFiyat && <del>{urun.eskiFiyat}</del>}
                    {urun.fiyat && <strong>{urun.fiyat}</strong>}
                  </span>
                )}
                {urun.rozet && <span className="gek-onecikan-urun-rozet">{urun.rozet}</span>}
              </div>
              <div className="gek-onecikan-urun-footer">
                <h3 className="gek-onecikan-urun-baslik" style={{ color: renk.metin }}>
                  {k.etiket}
                </h3>
              </div>
            </KartLink>
          );
        })}
      </div>
      {kartlar.length > 1 && (
        <div className="gek-onecikan-urun-gezinme" aria-label="Ürün karuseli kontrolleri">
          <button type="button" onClick={() => kaydir(-1)} aria-controls={seritId} aria-label="Önceki ürünler">
            <IconChevronLeft size={17} stroke={2} />
          </button>
          <button type="button" onClick={() => kaydir(1)} aria-controls={seritId} aria-label="Sonraki ürünler">
            <IconChevronRight size={17} stroke={2} />
          </button>
        </div>
      )}
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
      icerik = <UrunGrubuKartlari {...ortak} />;
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
      icerik = <OneCikanUrunKaruseli {...ortak} />;
      break;
    default:
      icerik = <UrunGrubuKartlari {...ortak} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
