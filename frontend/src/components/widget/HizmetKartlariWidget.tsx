import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetKartOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { CizgiIkon } from './CizgiIkonlari';

function HizmetIkon({ kart, boyut = 22 }: { kart: WidgetKartOgesi; boyut?: number }) {
  return <CizgiIkon deger={kart.ikon} yedek="proje" boyut={boyut} />;
}

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || 'var(--widget-baslik-renk, #111827)',
    metin: g.metinRengi || 'var(--widget-metin-renk, #4b5563)',
    vurgu: g.vurguRengi || '#111827',
  };
}

function Baslik({ widget, cfg, ortala = true }: { widget: Widget; cfg: WidgetConfig; ortala?: boolean }) {
  const renk = renkler(cfg);
  if (!widget.baslik && !widget.altBaslik && !widget.aciklama) return null;
  return (
    <div className={ortala ? 'hk-baslik hk-baslik-orta' : 'hk-baslik'}>
      {widget.altBaslik && (
        <p className="hk-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} hk-baslik-metin`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="hk-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function KartButon({
  kart,
  cevir,
  sinif = 'hk-kart-cta',
  vurgu,
  metinBaglantisi = false,
}: {
  kart: WidgetKartOgesi;
  cevir: (k: string, f: string) => string;
  sinif?: string;
  vurgu?: string;
  metinBaglantisi?: boolean;
}) {
  if (!kart.link) return null;
  const metin = kart.butonMetni || cevir('site.detaylariGor', 'Detayları Gör');
  const stil: CSSProperties | undefined = vurgu
    ? metinBaglantisi
      ? { color: vurgu }
      : { backgroundColor: vurgu }
    : undefined;
  const icerik = (
    <>
      <span>{metin}</span>
      {metinBaglantisi ? <IconArrowRight aria-hidden size={15} stroke={2} /> : <span aria-hidden> →</span>}
    </>
  );
  if (kart.link.startsWith('/')) {
    return (
      <Link to={kart.link} className={sinif} style={stil}>
        {icerik}
      </Link>
    );
  }
  return (
    <a href={kart.link} className={sinif} style={stil}>
      {icerik}
    </a>
  );
}

function KartGovde({
  kart,
  cfg,
  cevir,
  kompakt,
}: {
  kart: WidgetKartOgesi;
  cfg: WidgetConfig;
  cevir: (k: string, f: string) => string;
  kompakt?: boolean;
}) {
  const renk = renkler(cfg);
  return (
    <>
      <span className="hk-kart-ikon" style={{ color: renk.vurgu }}>
        <HizmetIkon kart={kart} />
      </span>
      <h3 className="hk-kart-baslik" style={{ color: renk.baslik }}>
        {kart.baslik}
      </h3>
      {!kompakt && kart.aciklama && (
        <p className="hk-kart-aciklama" style={{ color: renk.metin }}>
          {kart.aciklama}
        </p>
      )}
      <KartButon kart={kart} cevir={cevir} vurgu={renk.vurgu} />
    </>
  );
}

function gridKolon(cfg: WidgetConfig) {
  return Math.min(Math.max(Number(cfg.gorunum?.kolonSayisi) || 3, 1), 6);
}

function gridAralik(cfg: WidgetConfig) {
  const aralik = cfg.gorunum?.kartAraligi;
  if (aralik === 'dar') return '0.85rem';
  if (aralik === 'genis') return '2.1rem';
  return '1.55rem';
}

function MasonryDuvar({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div
        className="hk-dengeli-grid"
        style={
          {
            '--hk-dengeli-vurgu': renk.vurgu,
            '--hk-kolon': String(gridKolon(cfg)),
            '--hk-gap': gridAralik(cfg),
          } as CSSProperties
        }
      >
        {kartlar.map((kart) => (
          <article key={kart.id} className="hk-dengeli-kart">
            <span className="hk-dengeli-ikon" style={{ color: renk.vurgu }}>
              <HizmetIkon kart={kart} boyut={25} />
            </span>
            <h3 className="hk-dengeli-baslik" style={{ color: renk.baslik }}>
              {kart.baslik}
            </h3>
            {kart.aciklama && (
              <p className="hk-dengeli-aciklama" style={{ color: renk.metin }}>
                {kart.aciklama}
              </p>
            )}
            <KartButon
              kart={kart}
              cevir={cevir}
              sinif="hk-dengeli-cta"
              vurgu={renk.vurgu}
              metinBaglantisi
            />
          </article>
        ))}
      </div>
    </>
  );
}

function HoverFlip({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  const renk = renkler(cfg);
  const kolon = gridKolon(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div
        className={`hk-flip-grid hk-flip-grid-${kolon}`}
        style={{ '--hk-gap': gridAralik(cfg) } as CSSProperties}
      >
        {kartlar.map((kart) => (
          <article key={kart.id} className="hk-flip-kart">
            <div className="hk-flip-ic">
              <div
                className="hk-flip-on"
                style={{ background: `linear-gradient(145deg, ${renk.vurgu}12, ${renk.vurgu}28)` }}
              >
                <span className="hk-flip-ikon" style={{ color: renk.vurgu }}>
                  <HizmetIkon kart={kart} boyut={28} />
                </span>
                <h3 style={{ color: renk.baslik }}>{kart.baslik}</h3>
              </div>
              <div className="hk-flip-arka" style={{ background: renk.vurgu }}>
                <p>{kart.aciklama}</p>
                <KartButon kart={kart} cevir={cevir} sinif="hk-kart-cta hk-kart-cta-acik" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function SekmeliPanel({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);
  const secili = kartlar[aktif] ?? kartlar[0];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="hk-sekme-wrap">
        <div className="hk-sekme-liste" role="tablist">
          {kartlar.map((kart, i) => (
            <button
              key={kart.id}
              type="button"
              role="tab"
              aria-selected={i === aktif}
              className={`hk-sekme-tus${i === aktif ? ' hk-sekme-tus-aktif' : ''}`}
              style={
                i === aktif
                  ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` }
                  : undefined
              }
              onClick={() => setAktif(i)}
            >
              <span><HizmetIkon kart={kart} boyut={16} /></span>
              <span>{kart.baslik}</span>
            </button>
          ))}
        </div>
        {secili && (
          <div
            className="hk-sekme-panel"
            role="tabpanel"
            style={{ borderColor: `${renk.vurgu}33` }}
          >
            <span className="hk-sekme-panel-ikon" style={{ color: renk.vurgu }}>
              <HizmetIkon kart={secili} boyut={28} />
            </span>
            <h3 style={{ color: renk.baslik }}>{secili.baslik}</h3>
            <p style={{ color: renk.metin }}>{secili.aciklama}</p>
            <KartButon kart={secili} cevir={cevir} vurgu={renk.vurgu} />
          </div>
        )}
      </div>
    </>
  );
}

function OrbitDuzen({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  const renk = renkler(cfg);
  const n = kartlar.length;

  return (
    <>
      <div className="hk-orbit-alan">
        <div className="hk-orbit-merkez">
          <Baslik widget={widget} cfg={cfg} ortala />
        </div>
        <div className="hk-orbit-halka" style={{ '--hk-orbit-n': n } as CSSProperties}>
          {kartlar.map((kart, i) => (
            <article
              key={kart.id}
              className="hk-orbit-oge"
              style={{ '--hk-orbit-i': i } as CSSProperties}
            >
              <div className="hk-orbit-kart" style={{ borderColor: `${renk.vurgu}44` }}>
                <span style={{ color: renk.vurgu }}><HizmetIkon kart={kart} /></span>
                <h3 style={{ color: renk.baslik }}>{kart.baslik}</h3>
                <p style={{ color: renk.metin }}>{kart.aciklama}</p>
                <KartButon kart={kart} cevir={cevir} sinif="hk-kart-cta hk-kart-cta-kucuk" vurgu={renk.vurgu} />
              </div>
            </article>
          ))}
        </div>
        <div className="hk-orbit-mobil-liste">
          {kartlar.map((kart) => (
            <article key={kart.id} className="hk-orbit-mobil-kart" style={{ borderColor: `${renk.vurgu}33` }}>
              <KartGovde kart={kart} cfg={cfg} cevir={cevir} />
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function HeroMiniGrid({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  const renk = renkler(cfg);
  const [hero, ...mini] = kartlar;
  const kolon = Math.min(cfg.gorunum?.kolonSayisi ?? 3, 4);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="hk-hero-grid">
        <article
          className="hk-hero-kart"
          style={{ background: `linear-gradient(135deg, ${renk.vurgu}18, ${renk.vurgu}08)` }}
        >
          <span className="hk-hero-ikon" style={{ color: renk.vurgu }}>
            <HizmetIkon kart={hero} boyut={32} />
          </span>
          <h3 className="hk-hero-baslik" style={{ color: renk.baslik }}>
            {hero.baslik}
          </h3>
          <p className="hk-hero-aciklama" style={{ color: renk.metin }}>
            {hero.aciklama}
          </p>
          <KartButon kart={hero} cevir={cevir} sinif="hk-kart-cta hk-kart-cta-buyuk" vurgu={renk.vurgu} />
        </article>
        {mini.length > 0 && (
          <div className={`hk-mini-grid hk-mini-grid-${kolon}`}>
            {mini.map((kart) => (
              <article key={kart.id} className="hk-mini-kart" style={{ borderColor: `${renk.vurgu}22` }}>
                <span style={{ color: renk.vurgu }}><HizmetIkon kart={kart} boyut={20} /></span>
                <h4 style={{ color: renk.baslik }}>{kart.baslik}</h4>
                <p style={{ color: renk.metin }}>{kart.aciklama}</p>
                <KartButon kart={kart} cevir={cevir} sinif="hk-kart-cta hk-kart-cta-kucuk" vurgu={renk.vurgu} />
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function YataySerit({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetKartOgesi[];
  cevir: (k: string, f: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const renk = renkler(cfg);

  function kaydir(yon: 'sol' | 'sag') {
    const el = scrollRef.current;
    if (!el) return;
    const miktar = Math.min(el.clientWidth * 0.85, 360);
    el.scrollBy({ left: yon === 'sol' ? -miktar : miktar, behavior: 'smooth' });
  }

  return (
    <>
      <div className="hk-serit-baslik">
        <Baslik widget={widget} cfg={cfg} ortala={false} />
        {kartlar.length > 1 && (
          <div className="hk-serit-nav">
            <button type="button" className="hk-serit-ok" onClick={() => kaydir('sol')} aria-label="Önceki">
              ‹
            </button>
            <button type="button" className="hk-serit-ok" onClick={() => kaydir('sag')} aria-label="Sonraki">
              ›
            </button>
          </div>
        )}
      </div>
      <div ref={scrollRef} className="hk-serit-scroll">
        {kartlar.map((kart) => (
          <article
            key={kart.id}
            className="hk-serit-kart"
            style={{ borderColor: `${renk.vurgu}33`, boxShadow: `0 12px 32px ${renk.vurgu}14` }}
          >
            <KartGovde kart={kart} cfg={cfg} cevir={cevir} />
          </article>
        ))}
      </div>
    </>
  );
}

interface HizmetKartlariWidgetProps {
  widget: Widget;
}

export function HizmetKartlariWidget({ widget }: HizmetKartlariWidgetProps) {
  const { cevir } = useSiteDil();
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.kartlar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (kartlar.length === 0) return null;

  const ortak = { widget, cfg, kartlar, cevir };
  let icerik: ReactNode;

  switch (gt) {
    case 'masonry-duvar':
      icerik = <MasonryDuvar {...ortak} />;
      break;
    case 'hover-flip':
      icerik = <HoverFlip {...ortak} />;
      break;
    case 'sekmeli-panel':
      icerik = <SekmeliPanel {...ortak} />;
      break;
    case 'orbit-duzen':
      icerik = <OrbitDuzen {...ortak} />;
      break;
    case 'hero-mini-grid':
      icerik = <HeroMiniGrid {...ortak} />;
      break;
    case 'yatay-serit':
      icerik = <YataySerit {...ortak} />;
      break;
    default:
      icerik = <MasonryDuvar {...ortak} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
