import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetYorum } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function gorunumRenk(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi ?? '#0f172a',
    metin: g.metinRengi ?? '#475569',
    vurgu: g.vurguRengi ?? '#2563eb',
    yildiz: g.yildizRengi ?? '#facc15',
    footer: g.kartFooterArkaPlan ?? '#f1f5f9',
    yildizAcik: g.yildizGoster !== false,
  };
}

function yildizGoster(puan: number, renk: string, boyut = 'yk-yildiz-normal') {
  const p = Math.min(5, Math.max(0, Math.round(puan)));
  return (
    <div className={`yk-yildiz ${boyut}`} aria-label={`${p} / 5 yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < p ? renk : '#e2e8f0' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function BaslikAlani({ widget, cfg, ortala = true }: { widget: Widget; cfg: WidgetConfig; ortala?: boolean }) {
  const g = cfg.gorunum ?? {};
  const hizalama =
    !ortala && g.hizalama === 'sol'
      ? 'text-left'
      : !ortala && g.hizalama === 'sag'
        ? 'text-right'
        : ortala
          ? 'text-center'
          : g.hizalama === 'sol'
            ? 'text-left'
            : g.hizalama === 'sag'
              ? 'text-right'
              : 'text-center';

  return (
    <div className={`yk-baslik ${hizalama}`}>
      {widget.altBaslik && (
        <p className="yk-alt-baslik" style={{ color: g.vurguRengi ?? '#2563eb' }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} yk-baslik-metin`} style={{ color: g.baslikRengi ?? '#0f172a' }}>
          {widget.baslik}
        </h2>
      )}
    </div>
  );
}

function YazarAvatar({ y, boyut = 'md' }: { y: WidgetYorum; boyut?: 'sm' | 'md' | 'lg' }) {
  const sinif = boyut === 'sm' ? 'yk-avatar-sm' : boyut === 'lg' ? 'yk-avatar-lg' : 'yk-avatar-md';
  if (y.gorselUrl) {
    return <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className={`yk-avatar ${sinif}`} />;
  }
  return (
    <div className={`yk-avatar yk-avatar-bos ${sinif}`}>
      {y.ad.charAt(0) || '?'}
    </div>
  );
}

function YazarBilgi({ y, renk }: { y: WidgetYorum; renk: string }) {
  return (
    <div className="yk-yazar">
      <p className="yk-yazar-ad" style={{ color: renk }}>
        {y.ad}
      </p>
      {y.firma && <p className="yk-yazar-firma">{y.firma}</p>}
    </div>
  );
}

function BuyukAlintiHero({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const renk = gorunumRenk(cfg);
  const secili = yorumlar[aktif] ?? yorumlar[0];

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className="yk-hero-alinti" style={{ borderColor: `${renk.vurgu}33` }}>
        {renk.yildizAcik && (
          <div className="yk-hero-yildiz">{yildizGoster(secili.yildiz ?? 5, renk.yildiz, 'yk-yildiz-buyuk')}</div>
        )}
        <blockquote className="yk-hero-metin" style={{ color: renk.metin }}>
          “{secili.metin}”
        </blockquote>
        <div className="yk-hero-yazar">
          <YazarAvatar y={secili} boyut="lg" />
          <YazarBilgi y={secili} renk={renk.baslik} />
        </div>
      </div>
      {yorumlar.length > 1 && (
        <div className="yk-hero-secici">
          {yorumlar.map((y, i) => (
            <button
              key={y.id}
              type="button"
              className={`yk-hero-nokta${i === aktif ? ' yk-hero-nokta-aktif' : ''}`}
              style={i === aktif ? { borderColor: renk.vurgu, background: `${renk.vurgu}15` } : undefined}
              onClick={() => setAktif(i)}
              aria-label={`${y.ad} yorumunu göster`}
            >
              <YazarAvatar y={y} boyut="sm" />
              <span className="yk-hero-nokta-ad">{y.ad}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function YataySerit({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const renk = gorunumRenk(cfg);
  const radius = cfg.gorunum?.borderRadius ?? 16;

  function kaydir(yon: 'sol' | 'sag') {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: yon === 'sol' ? -320 : 320, behavior: 'smooth' });
  }

  return (
    <>
      <div className="yk-serit-baslik">
        <BaslikAlani widget={widget} cfg={cfg} ortala={false} />
        {yorumlar.length > 1 && (
          <div className="yk-serit-nav">
            <button type="button" className="yk-serit-ok" onClick={() => kaydir('sol')} aria-label="Önceki">
              ‹
            </button>
            <button type="button" className="yk-serit-ok" onClick={() => kaydir('sag')} aria-label="Sonraki">
              ›
            </button>
          </div>
        )}
      </div>
      <div ref={scrollRef} className="yk-serit-scroll">
        {yorumlar.map((y) => (
          <article
            key={y.id}
            className="yk-serit-kart"
            style={{
              borderRadius: `${radius}px`,
              borderColor: `${renk.vurgu}33`,
              boxShadow: `0 12px 32px ${renk.vurgu}12`,
            }}
          >
            {renk.yildizAcik && <div className="mb-3">{yildizGoster(y.yildiz ?? 5, renk.yildiz)}</div>}
            <p className="yk-kart-metin" style={{ color: renk.metin }}>
              {y.metin}
            </p>
            <div className="yk-serit-footer" style={{ background: renk.footer }}>
              <YazarAvatar y={y} />
              <YazarBilgi y={y} renk={renk.baslik} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function KonusmaBalonu({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const renk = gorunumRenk(cfg);

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className="yk-chat-liste">
        {yorumlar.map((y, i) => {
          const sag = i % 2 === 1;
          return (
            <article key={y.id} className={`yk-chat-satir${sag ? ' yk-chat-sag' : ''}`}>
              {!sag && <YazarAvatar y={y} />}
              <div
                className="yk-chat-balon"
                style={{
                  background: sag ? `${renk.vurgu}12` : '#fff',
                  borderColor: sag ? `${renk.vurgu}33` : 'rgba(15,23,42,0.08)',
                }}
              >
                {renk.yildizAcik && <div className="mb-2">{yildizGoster(y.yildiz ?? 5, renk.yildiz, 'yk-yildiz-kucuk')}</div>}
                <p style={{ color: renk.metin }}>{y.metin}</p>
                <p className="yk-chat-imza" style={{ color: renk.baslik }}>
                  {y.ad}
                  {y.firma ? ` · ${y.firma}` : ''}
                </p>
              </div>
              {sag && <YazarAvatar y={y} />}
            </article>
          );
        })}
      </div>
    </>
  );
}

function SplitTestimonial({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const renk = gorunumRenk(cfg);
  const secili = yorumlar[aktif] ?? yorumlar[0];

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} ortala={false} />
      <div className="yk-split">
        <div className="yk-split-buyuk" style={{ borderColor: `${renk.vurgu}33`, background: `${renk.vurgu}08` }}>
          {renk.yildizAcik && yildizGoster(secili.yildiz ?? 5, renk.yildiz, 'yk-yildiz-buyuk')}
          <blockquote className="yk-split-metin" style={{ color: renk.metin }}>
            {secili.metin}
          </blockquote>
          <div className="yk-split-yazar">
            <YazarAvatar y={secili} boyut="lg" />
            <YazarBilgi y={secili} renk={renk.baslik} />
          </div>
        </div>
        <div className="yk-split-liste">
          {yorumlar.map((y, i) => (
            <button
              key={y.id}
              type="button"
              className={`yk-split-tus${i === aktif ? ' yk-split-tus-aktif' : ''}`}
              style={
                i === aktif
                  ? { borderColor: renk.vurgu, background: `${renk.vurgu}10` }
                  : undefined
              }
              onClick={() => setAktif(i)}
            >
              <YazarAvatar y={y} boyut="sm" />
              <div className="min-w-0 text-left">
                <p className="yk-split-tus-ad" style={{ color: renk.baslik }}>
                  {y.ad}
                </p>
                <p className="yk-split-tus-ozet" style={{ color: renk.metin }}>
                  {y.metin.slice(0, 72)}
                  {y.metin.length > 72 ? '…' : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function KartDestesi({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const renk = gorunumRenk(cfg);

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className="yk-deste-wrap">
        <div className="yk-deste" style={{ '--yk-deste-n': yorumlar.length } as CSSProperties}>
          {yorumlar.map((y, i) => (
            <article
              key={y.id}
              className="yk-deste-kart"
              style={
                {
                  '--yk-deste-i': i,
                  borderColor: `${renk.vurgu}33`,
                  zIndex: yorumlar.length - i,
                } as CSSProperties
              }
            >
              {renk.yildizAcik && yildizGoster(y.yildiz ?? 5, renk.yildiz)}
              <p className="yk-kart-metin" style={{ color: renk.metin }}>
                {y.metin}
              </p>
              <div className="yk-deste-footer">
                <YazarAvatar y={y} boyut="sm" />
                <YazarBilgi y={y} renk={renk.baslik} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function QuoteStil({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const renk = gorunumRenk(cfg);

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className="yk-quote-grid">
        {yorumlar.map((y) => (
          <article key={y.id} className="yk-quote-kart" style={{ borderColor: `${renk.vurgu}22` }}>
            <span className="yk-quote-isaret" style={{ color: `${renk.vurgu}44` }} aria-hidden>
              “
            </span>
            {renk.yildizAcik && (
              <div className="yk-quote-yildiz">{yildizGoster(y.yildiz ?? 5, renk.yildiz)}</div>
            )}
            <p className="yk-quote-metin" style={{ color: renk.metin }}>
              {y.metin}
            </p>
            <div className="yk-quote-alt">
              <YazarAvatar y={y} />
              <YazarBilgi y={y} renk={renk.baslik} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function YorumKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const yorumlar = cfg.yorumlar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (yorumlar.length === 0) return null;

  const ortak = { widget, cfg, yorumlar };
  let icerik: ReactNode;

  switch (gt) {
    case 'buyuk-alinti-hero':
      icerik = <BuyukAlintiHero {...ortak} />;
      break;
    case 'yatay-serit':
      icerik = <YataySerit {...ortak} />;
      break;
    case 'konusma-balonu':
      icerik = <KonusmaBalonu {...ortak} />;
      break;
    case 'split-testimonial':
      icerik = <SplitTestimonial {...ortak} />;
      break;
    case 'kart-destesi':
      icerik = <KartDestesi {...ortak} />;
      break;
    case 'quote-stil':
      icerik = <QuoteStil {...ortak} />;
      break;
    default:
      icerik = <BuyukAlintiHero {...ortak} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
