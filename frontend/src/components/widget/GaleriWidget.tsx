import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetGaleriOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle, medyaUrl } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || '#7c3aed',
    radius: g.borderRadius ?? 14,
  };
}

function heroMetin(cfg: WidgetConfig, widget: Widget) {
  return (cfg.gorunum?.tipEk?.heroBannerMetin as string) || widget.aciklama || '';
}

function galeriFiltrele(galeri: WidgetGaleriOgesi[], filtreler: string[], seciliIndeks: number) {
  if (filtreler.length === 0 || seciliIndeks === 0) return galeri;
  const secili = filtreler[seciliIndeks];
  return galeri.filter((g) => !g.kategori || g.kategori === secili);
}

function GorselLink({
  g,
  className,
  style,
  children,
}: {
  g: WidgetGaleriOgesi;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const link = g.link?.trim();
  if (!link) return <div className={className} style={style}>{children}</div>;
  const href = link.startsWith('http') || link.startsWith('/') ? link : `https://${link}`;
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function BolumBaslik({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  const renk = renkler(cfg);
  if (!widget.baslik && !widget.altBaslik && !widget.aciklama) return null;
  return (
    <div className="gl-bolum-baslik">
      {widget.altBaslik && (
        <p className="gl-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} gl-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="gl-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function SnapYataySerit({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="gl-snap-scroll">
        {galeri.map((g) => (
          <GorselLink key={g.id} g={g} className="gl-snap-kart" style={{ borderRadius: renk.radius }}>
            {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className="gl-kart-gorsel" />}
            {g.baslik && <span className="gl-snap-etiket">{g.baslik}</span>}
          </GorselLink>
        ))}
      </div>
    </>
  );
}

function HeroVitrin({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);
  const hero = galeri[aktif] ?? galeri[0];
  const altlar = galeri.filter((_, i) => i !== aktif);
  const metin = heroMetin(cfg, widget);

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="gl-hero-vitrin">
        <GorselLink g={hero} className="gl-hero-ana" style={{ borderRadius: renk.radius }}>
          {hero.gorselUrl && <img src={medyaUrl(hero.gorselUrl)} alt={hero.baslik} className="gl-hero-gorsel" />}
          <div className="gl-hero-overlay" />
          <div className="gl-hero-metin">
            {hero.baslik && <span className="gl-hero-baslik">{hero.baslik}</span>}
            {metin && <p>{metin}</p>}
          </div>
        </GorselLink>
        {altlar.length > 0 && (
          <div className="gl-hero-serit">
            {galeri.map((g, i) => (
              <button
                key={g.id}
                type="button"
                className={`gl-hero-thumb ${i === aktif ? 'gl-hero-thumb-aktif' : ''}`}
                style={{ borderRadius: renk.radius }}
                onClick={() => setAktif(i)}
              >
                {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className="gl-thumb-gorsel" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function LightboxOdak({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  const [acik, setAcik] = useState<WidgetGaleriOgesi | null>(null);
  const [indeks, setIndeks] = useState(0);
  const renk = renkler(cfg);

  function ac(k: WidgetGaleriOgesi, i: number) {
    setAcik(k);
    setIndeks(i);
  }

  function kaydir(yon: 'onceki' | 'sonraki') {
    const yeni = yon === 'onceki' ? (indeks - 1 + galeri.length) % galeri.length : (indeks + 1) % galeri.length;
    setIndeks(yeni);
    setAcik(galeri[yeni]);
  }

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="gl-lightbox-wrap" style={{ borderRadius: renk.radius }}>
        <div className="gl-lightbox-grid" style={gridStyle(cfg)}>
          {galeri.map((g, i) => (
            <button
              key={g.id}
              type="button"
              className="gl-lightbox-tus"
              style={{ borderRadius: renk.radius }}
              onClick={() => ac(g, i)}
            >
              {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className="gl-kart-gorsel" />}
              <div className="gl-lightbox-tus-overlay" />
              {g.baslik && <span className="gl-lightbox-tus-etiket">{g.baslik}</span>}
            </button>
          ))}
        </div>
      </div>
      {acik && (
        <div className="gl-lightbox-modal" onClick={() => setAcik(null)}>
          <button type="button" className="gl-lightbox-kapat" onClick={() => setAcik(null)} aria-label="Kapat">
            ×
          </button>
          {galeri.length > 1 && (
            <>
              <button type="button" className="gl-lightbox-ok gl-lightbox-ok-sol" onClick={(e) => { e.stopPropagation(); kaydir('onceki'); }} aria-label="Önceki">
                ‹
              </button>
              <button type="button" className="gl-lightbox-ok gl-lightbox-ok-sag" onClick={(e) => { e.stopPropagation(); kaydir('sonraki'); }} aria-label="Sonraki">
                ›
              </button>
            </>
          )}
          <figure className="gl-lightbox-icerik" onClick={(e) => e.stopPropagation()}>
            {acik.gorselUrl && <img src={medyaUrl(acik.gorselUrl)} alt={acik.baslik} className="gl-lightbox-buyuk" />}
            {acik.baslik && <figcaption>{acik.baslik}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}

function SekmeliKategori({
  widget,
  cfg,
  galeri,
  filtreler,
}: {
  widget: Widget;
  cfg: Cfg;
  galeri: WidgetGaleriOgesi[];
  filtreler: string[];
}) {
  const [secili, setSecili] = useState(0);
  const renk = renkler(cfg);
  const gorunen = galeriFiltrele(galeri, filtreler, secili);

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      {filtreler.length > 0 && (
        <div className="gl-sekme-liste">
          {filtreler.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`gl-sekme ${i === secili ? 'gl-sekme-aktif' : ''}`}
              style={i === secili ? { backgroundColor: renk.vurgu, borderColor: renk.vurgu } : undefined}
              onClick={() => setSecili(i)}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <div className="gl-sekme-grid" style={gridStyle(cfg)}>
        {gorunen.map((g) => (
          <GorselLink key={g.id} g={g} className="gl-sekme-kart" style={{ borderRadius: renk.radius }}>
            {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className="gl-kart-gorsel" />}
            {g.baslik && <span className="gl-sekme-etiket">{g.baslik}</span>}
          </GorselLink>
        ))}
      </div>
    </>
  );
}

function HoverZoomEtiket({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="gl-zoom-grid" style={gridStyle(cfg)}>
        {galeri.map((g) => (
          <GorselLink key={g.id} g={g} className="gl-zoom-kart" style={{ borderRadius: renk.radius }}>
            {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className="gl-zoom-gorsel" />}
            {g.baslik && <span className="gl-zoom-etiket">{g.baslik}</span>}
          </GorselLink>
        ))}
      </div>
    </>
  );
}

function KaruselMerkez({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);
  const n = galeri.length;

  function kaydir(yon: 'onceki' | 'sonraki') {
    setAktif((i) => (yon === 'onceki' ? (i - 1 + n) % n : (i + 1) % n));
  }

  const onceki = galeri[(aktif - 1 + n) % n];
  const merkez = galeri[aktif];
  const sonraki = galeri[(aktif + 1) % n];

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="gl-karusel-wrap">
        {n > 1 && (
          <button type="button" className="gl-karusel-ok" onClick={() => kaydir('onceki')} aria-label="Önceki">
            ‹
          </button>
        )}
        <div className="gl-karusel-uc">
          {n > 1 && (
            <button type="button" className="gl-karusel-yan gl-karusel-sol" onClick={() => kaydir('onceki')}>
              {onceki.gorselUrl && <img src={medyaUrl(onceki.gorselUrl)} alt={onceki.baslik} />}
            </button>
          )}
          <GorselLink g={merkez} className="gl-karusel-merkez" style={{ borderRadius: renk.radius }}>
            {merkez.gorselUrl && <img src={medyaUrl(merkez.gorselUrl)} alt={merkez.baslik} className="gl-karusel-merkez-gorsel" />}
            {merkez.baslik && <span className="gl-karusel-merkez-etiket">{merkez.baslik}</span>}
          </GorselLink>
          {n > 1 && (
            <button type="button" className="gl-karusel-yan gl-karusel-sag" onClick={() => kaydir('sonraki')}>
              {sonraki.gorselUrl && <img src={medyaUrl(sonraki.gorselUrl)} alt={sonraki.baslik} />}
            </button>
          )}
        </div>
        {n > 1 && (
          <button type="button" className="gl-karusel-ok" onClick={() => kaydir('sonraki')} aria-label="Sonraki">
            ›
          </button>
        )}
      </div>
      {n > 1 && (
        <div className="gl-karusel-noktalar">
          {galeri.map((g, i) => (
            <button
              key={g.id}
              type="button"
              className={`gl-karusel-nokta ${i === aktif ? 'gl-karusel-nokta-aktif' : ''}`}
              style={i === aktif ? { backgroundColor: renk.vurgu } : undefined}
              onClick={() => setAktif(i)}
              aria-label={`Slayt ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function GaleriWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const galeri = cfg.galeri ?? [];
  const filtreler = cfg.filtreler ?? [];
  const gt = widgetGorunumTipiAl(widget);
  if (galeri.length === 0) return null;

  const props = { widget, cfg, galeri };

  let icerik;
  switch (gt) {
    case 'hero-vitrin':
      icerik = <HeroVitrin {...props} />;
      break;
    case 'lightbox-odak':
      icerik = <LightboxOdak {...props} />;
      break;
    case 'sekmeli-kategori':
      icerik = <SekmeliKategori {...props} filtreler={filtreler} />;
      break;
    case 'hover-zoom-etiket':
      icerik = <HoverZoomEtiket {...props} />;
      break;
    case 'karusel-merkez':
      icerik = <KaruselMerkez {...props} />;
      break;
    default:
      icerik = <SnapYataySerit {...props} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
