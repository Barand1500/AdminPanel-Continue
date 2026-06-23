import { Link } from 'react-router-dom';
import { useState, type CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetSlide } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import { WidgetSayfalama } from './haber/haberWidgetOrtak';

interface SliderWidgetProps {
  widget: Widget;
}

const ORBIT_IKONLAR = ['📦', '🛒', '👤', '🏷️', '📊', '🧩', '⚡', '🔗'];

function sliderRenkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || '#ea580c',
    radius: g.borderRadius ?? 16,
    arkaplan: '#ffffff',
  };
}

function useSliderState(slides: WidgetSlide[]) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const onceki = () => setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  const sonraki = () => setIndex((i) => (i >= slides.length - 1 ? 0 : i + 1));
  return { index, setIndex, slide, onceki, sonraki };
}

function SliderOklar({
  cok,
  onceki,
  sonraki,
  sinif = 'sl-ok',
}: {
  cok: boolean;
  onceki: () => void;
  sonraki: () => void;
  sinif?: string;
}) {
  if (!cok) return null;
  return (
    <>
      <button type="button" onClick={onceki} className={`${sinif} sl-ok--sol`} aria-label="Önceki">
        ‹
      </button>
      <button type="button" onClick={sonraki} className={`${sinif} sl-ok--sag`} aria-label="Sonraki">
        ›
      </button>
    </>
  );
}

function SliderSayfalama({
  slides,
  index,
  setIndex,
  onceki,
  sonraki,
  stil,
  vurgu,
}: {
  slides: WidgetSlide[];
  index: number;
  setIndex: (i: number) => void;
  onceki: () => void;
  sonraki: () => void;
  stil: string;
  vurgu: string;
}) {
  if (slides.length <= 1) return null;
  return (
    <WidgetSayfalama
      toplam={slides.length}
      aktif={index}
      stil={stil as 'numara'}
      vurguRenk={vurgu}
      onSec={setIndex}
      onOnceki={onceki}
      onSonraki={sonraki}
    />
  );
}

function SlCta({
  slide,
  widget,
  sinif = 'sl-cta',
  vurgu,
}: {
  slide: WidgetSlide;
  widget: Widget;
  sinif?: string;
  vurgu?: string;
}) {
  const metin = slide.butonMetni || widget.butonMetni;
  const link = slide.butonLink || widget.butonLink;
  if (!metin || !link) return null;
  return (
    <Link to={link} className={sinif} style={vurgu ? { backgroundColor: vurgu } : undefined}>
      {metin}
    </Link>
  );
}

function SlOzellikChips({ filtreler, vurgu }: { filtreler: string[]; vurgu: string }) {
  const chips = filtreler.filter(Boolean).slice(0, 3);
  if (chips.length === 0) return null;
  return (
    <div className="sl-ozellik-chips">
      {chips.map((f, i) => (
        <div key={f + i} className="sl-ozellik-chip">
          <span className="sl-ozellik-chip-ikon" style={{ color: vurgu }}>
            {ORBIT_IKONLAR[i % ORBIT_IKONLAR.length]}
          </span>
          <span className="sl-ozellik-chip-metin">{f}</span>
        </div>
      ))}
    </div>
  );
}

function SlOrbitGorsel({
  slide,
  filtreler,
  vurgu,
  radius,
}: {
  slide: WidgetSlide;
  filtreler: string[];
  vurgu: string;
  radius: number;
}) {
  const orbitOgeler = filtreler.filter(Boolean).slice(0, 6);
  const n = Math.max(orbitOgeler.length, 1);

  return (
    <div className="sl-orbit-alan">
      <div className="sl-orbit-halka-cizgi" style={{ borderColor: `${vurgu}33` }} aria-hidden />
      {orbitOgeler.length > 0 && (
        <div className="sl-orbit-halka" style={{ '--sl-orbit-n': n } as CSSProperties}>
          {orbitOgeler.map((f, i) => (
            <div key={f + i} className="sl-orbit-oge" style={{ '--sl-orbit-i': i } as CSSProperties}>
              <span className="sl-orbit-oge-kart" style={{ borderColor: `${vurgu}33` }}>
                <span className="sl-orbit-oge-ikon">{ORBIT_IKONLAR[i % ORBIT_IKONLAR.length]}</span>
                <span className="sl-orbit-oge-metin">{f}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="sl-orbit-merkez" style={{ borderRadius: radius }}>
        {slide.gorselUrl ? (
          <img src={medyaUrl(slide.gorselUrl)} alt="" className="sl-orbit-merkez-img" />
        ) : (
          <div className="sl-orbit-merkez-bos" style={{ color: vurgu }}>
            {slide.baslik?.slice(0, 2).toUpperCase() || 'SL'}
          </div>
        )}
      </div>
    </div>
  );
}

type SliderOrtak = ReturnType<typeof useSliderState> & {
  widget: Widget;
  cfg: WidgetConfig;
  slides: WidgetSlide[];
  renk: ReturnType<typeof sliderRenkler>;
  filtreler: string[];
  sayfalamaStili: string;
};

function SplitOzellikVitrin({ widget, slides, slide, index, setIndex, onceki, sonraki, renk, filtreler, sayfalamaStili }: SliderOrtak) {
  const aciklama = slide?.aciklama || widget.aciklama;
  const baslik = slide?.baslik || widget.baslik;
  const badge = slide?.altBaslik || widget.altBaslik;

  return (
    <div className="sl-split-vitrin" style={{ borderRadius: renk.radius, background: renk.arkaplan }}>
      <div className="sl-split-vitrin-grid">
        <div className="sl-split-vitrin-metin">
          {badge && (
            <span className="sl-badge" style={{ backgroundColor: `${renk.vurgu}18`, color: renk.vurgu }}>
              {badge}
            </span>
          )}
          {baslik && (
            <h2 className="sl-baslik" style={{ color: renk.baslik }}>
              {baslik}
            </h2>
          )}
          {aciklama && (
            <p className="sl-aciklama" style={{ color: renk.metin }}>
              {aciklama}
            </p>
          )}
          <SlOzellikChips filtreler={filtreler} vurgu={renk.vurgu} />
          <SlCta slide={slide} widget={widget} vurgu={renk.vurgu} />
        </div>
        <div className="sl-split-vitrin-gorsel">
          <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} />
          <SlOrbitGorsel slide={slide} filtreler={filtreler} vurgu={renk.vurgu} radius={renk.radius} />
        </div>
      </div>
      <SliderSayfalama slides={slides} index={index} setIndex={setIndex} onceki={onceki} sonraki={sonraki} stil={sayfalamaStili} vurgu={renk.vurgu} />
    </div>
  );
}

function CamHeroBeyaz({ widget, slides, slide, index, setIndex, onceki, sonraki, renk, sayfalamaStili }: SliderOrtak) {
  if (!slide?.gorselUrl) return null;
  const aciklama = slide.aciklama || widget.aciklama;

  return (
    <div className="sl-cam-hero" style={{ borderRadius: renk.radius }}>
      <div className="sl-cam-hero-gorsel">
        <img src={medyaUrl(slide.gorselUrl)} alt="" />
        <div className="sl-cam-hero-overlay" />
      </div>
      <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} sinif="sl-ok sl-ok--cam" />
      <div className="sl-cam-hero-panel" style={{ borderRadius: Math.max(12, renk.radius - 4) }}>
        {slide.altBaslik && <span className="sl-cam-alt" style={{ color: renk.vurgu }}>{slide.altBaslik}</span>}
        <h2 className="sl-cam-baslik" style={{ color: renk.baslik }}>{slide.baslik || widget.baslik}</h2>
        {aciklama && <p className="sl-cam-aciklama" style={{ color: renk.metin }}>{aciklama}</p>}
        <SlCta slide={slide} widget={widget} sinif="sl-cta sl-cta--cam" vurgu={renk.vurgu} />
      </div>
      <SliderSayfalama slides={slides} index={index} setIndex={setIndex} onceki={onceki} sonraki={sonraki} stil={sayfalamaStili} vurgu={renk.vurgu} />
    </div>
  );
}

function OrbitMerkez({ widget, slides, slide, index, setIndex, onceki, sonraki, renk, filtreler, sayfalamaStili }: SliderOrtak) {
  return (
    <div className="sl-orbit-merkez-blok" style={{ borderRadius: renk.radius, background: renk.arkaplan }}>
      <div className="sl-orbit-ust-metin">
        {slide?.altBaslik && (
          <span className="sl-badge sl-badge--ince" style={{ color: renk.vurgu }}>
            {slide.altBaslik}
          </span>
        )}
        <h2 className="sl-baslik sl-baslik--orta" style={{ color: renk.baslik }}>
          {slide?.baslik || widget.baslik}
        </h2>
      </div>
      <div className="sl-orbit-merkez-wrap">
        <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} sinif="sl-ok sl-ok--orbit" />
        <SlOrbitGorsel slide={slide} filtreler={filtreler} vurgu={renk.vurgu} radius={9999} />
      </div>
      <SliderSayfalama slides={slides} index={index} setIndex={setIndex} onceki={onceki} sonraki={sonraki} stil={sayfalamaStili} vurgu={renk.vurgu} />
    </div>
  );
}

function BadgeModern({ widget, slides, slide, index, setIndex, onceki, sonraki, renk, filtreler, sayfalamaStili }: SliderOrtak) {
  const aciklama = slide?.aciklama || widget.aciklama;
  const chips = filtreler.filter(Boolean).slice(0, 3);

  return (
    <div className="sl-badge-modern" style={{ borderRadius: renk.radius, background: renk.arkaplan }}>
      <div className="sl-badge-modern-ust">
        <div className="sl-badge-modern-metin">
          {(slide?.altBaslik || widget.altBaslik) && (
            <span className="sl-badge" style={{ backgroundColor: `${renk.vurgu}18`, color: renk.vurgu }}>
              {slide?.altBaslik || widget.altBaslik}
            </span>
          )}
          <h2 className="sl-baslik" style={{ color: renk.baslik }}>
            {slide?.baslik || widget.baslik}
          </h2>
          {aciklama && (
            <p className="sl-aciklama" style={{ color: renk.metin }}>
              {aciklama}
            </p>
          )}
          <SlCta slide={slide} widget={widget} vurgu={renk.vurgu} />
        </div>
        {slide?.gorselUrl && (
          <div className="sl-badge-modern-gorsel" style={{ borderRadius: renk.radius }}>
            <img src={medyaUrl(slide.gorselUrl)} alt="" />
            <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} sinif="sl-ok sl-ok--kucuk" />
          </div>
        )}
      </div>
      {chips.length > 0 && (
        <div className="sl-badge-kartlar">
          {chips.map((f, i) => (
            <div key={f + i} className="sl-badge-kart" style={{ borderColor: `${renk.vurgu}22` }}>
              <span className="sl-badge-kart-ikon" style={{ background: `${renk.vurgu}14`, color: renk.vurgu }}>
                {ORBIT_IKONLAR[i % ORBIT_IKONLAR.length]}
              </span>
              <span className="sl-badge-kart-metin" style={{ color: renk.baslik }}>
                {f}
              </span>
            </div>
          ))}
        </div>
      )}
      <SliderSayfalama slides={slides} index={index} setIndex={setIndex} onceki={onceki} sonraki={sonraki} stil={sayfalamaStili} vurgu={renk.vurgu} />
    </div>
  );
}

function SinematikAcik({ widget, slides, slide, index, setIndex, onceki, sonraki, renk, sayfalamaStili }: SliderOrtak) {
  if (!slide?.gorselUrl) return null;
  const aciklama = slide.aciklama || widget.aciklama;

  return (
    <div className="sl-sinematik-acik" style={{ borderRadius: renk.radius }}>
      <div className="sl-sinematik-acik-grid">
        <div className="sl-sinematik-acik-gorsel">
          <img src={medyaUrl(slide.gorselUrl)} alt="" />
          <div className="sl-sinematik-acik-gorsel-overlay" />
          <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} sinif="sl-ok sl-ok--acik" />
        </div>
        <div className="sl-sinematik-acik-metin" style={{ background: renk.arkaplan }}>
          {slide.altBaslik && (
            <span className="sl-badge sl-badge--ince" style={{ color: renk.vurgu }}>
              {slide.altBaslik}
            </span>
          )}
          <h2 className="sl-baslik" style={{ color: renk.baslik }}>
            {slide.baslik || widget.baslik}
          </h2>
          {aciklama && (
            <p className="sl-aciklama" style={{ color: renk.metin }}>
              {aciklama}
            </p>
          )}
          <SlCta slide={slide} widget={widget} sinif="sl-cta sl-cta--outline" vurgu={renk.vurgu} />
        </div>
      </div>
      <SliderSayfalama slides={slides} index={index} setIndex={setIndex} onceki={onceki} sonraki={sonraki} stil={sayfalamaStili} vurgu={renk.vurgu} />
    </div>
  );
}

function GradientSplit({ widget, cfg, slides, slide, index, setIndex, onceki, sonraki, renk, sayfalamaStili }: SliderOrtak) {
  const aciklama = slide?.aciklama || widget.aciklama;
  const heroMetin = (cfg.gorunum?.tipEk?.heroBannerMetin as string) || '';

  return (
    <div
      className="sl-gradient-split"
      style={{
        borderRadius: renk.radius,
        background: `linear-gradient(135deg, ${renk.vurgu} 0%, ${renk.baslik} 55%, #1e1b4b 100%)`,
      }}
    >
      <div className="sl-gradient-split-grid">
        <div className="sl-gradient-split-metin">
          {(slide?.altBaslik || widget.altBaslik) && (
            <span className="sl-badge sl-badge--cam">{slide?.altBaslik || widget.altBaslik}</span>
          )}
          <h2 className="sl-baslik sl-baslik--beyaz">{slide?.baslik || widget.baslik}</h2>
          {aciklama && <p className="sl-aciklama sl-aciklama--beyaz">{aciklama}</p>}
          {heroMetin && <p className="sl-hero-banner-metin">{heroMetin}</p>}
          <SlCta slide={slide} widget={widget} sinif="sl-cta sl-cta--beyaz" />
        </div>
        <div className="sl-gradient-split-gorsel">
          {slide?.gorselUrl ? (
            <div className="sl-gradient-split-img-wrap" style={{ borderRadius: renk.radius }}>
              <img src={medyaUrl(slide.gorselUrl)} alt="" />
            </div>
          ) : (
            <div className="sl-gradient-split-dekor" aria-hidden />
          )}
          <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} sinif="sl-ok sl-ok--gradient" />
        </div>
      </div>
      <SliderSayfalama slides={slides} index={index} setIndex={setIndex} onceki={onceki} sonraki={sonraki} stil={sayfalamaStili} vurgu="#ffffff" />
    </div>
  );
}

function SliderGovde({
  gt,
  ortak,
}: {
  gt: string;
  ortak: SliderOrtak;
}) {
  switch (gt) {
    case 'cam-hero-beyaz':
      return <CamHeroBeyaz {...ortak} />;
    case 'orbit-merkez':
      return <OrbitMerkez {...ortak} />;
    case 'badge-modern':
      return <BadgeModern {...ortak} />;
    case 'sinematik-acik':
      return <SinematikAcik {...ortak} />;
    case 'gradient-split':
      return <GradientSplit {...ortak} />;
    default:
      return <SplitOzellikVitrin {...ortak} />;
  }
}

export function SliderWidget({ widget }: SliderWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const g = cfg.gorunum ?? {};
  const slides = (cfg.slides ?? []).filter((s) => s.aktif !== false);
  const state = useSliderState(slides);
  const gt = widgetGorunumTipiAl(widget);
  const renk = sliderRenkler(cfg);
  const filtreler = cfg.filtreler ?? [];
  const sayfalamaStili = g.sayfalamaStili ?? 'numara';

  if (slides.length === 0 && gt !== 'gradient-split') return null;

  const bosSlide: WidgetSlide = {
    id: '_bos',
    gorselUrl: '',
    baslik: '',
    altBaslik: '',
    butonMetni: '',
    butonLink: '',
    aktif: true,
  };

  const ortak: SliderOrtak = {
    widget,
    cfg,
    slides,
    renk,
    filtreler,
    sayfalamaStili,
    ...state,
    slide: state.slide ?? bosSlide,
  };

  const icerik = <SliderGovde gt={gt} ortak={ortak} />;

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
