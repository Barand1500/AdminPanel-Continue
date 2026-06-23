import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetIkonKart } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function renkler(cfg: Cfg) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || 'var(--widget-baslik-renk, #0f172a)',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || 'var(--color-primary, #7c3aed)',
  };
}

function CtaButon({
  widget,
  sinif = 'bmg-cta',
  acik = false,
}: {
  widget: Widget;
  sinif?: string;
  acik?: boolean;
}) {
  if (!widget.butonLink || !widget.butonMetni) return null;
  const cls = `${sinif}${acik ? ' bmg-cta-acik' : ''}`;
  const icerik = (
    <>
      {widget.butonMetni}
      <span aria-hidden>→</span>
    </>
  );
  if (widget.butonLink.startsWith('/')) {
    return (
      <Link to={widget.butonLink} className={cls}>
        {icerik}
      </Link>
    );
  }
  return (
    <a href={widget.butonLink} className={cls}>
      {icerik}
    </a>
  );
}

function IkonKartlar({
  kartlar,
  varyant = 'pill',
  renk,
}: {
  kartlar: WidgetIkonKart[];
  varyant?: 'pill' | 'timeline' | 'bento' | 'kutu';
  renk: ReturnType<typeof renkler>;
}) {
  if (kartlar.length === 0) return null;

  if (varyant === 'timeline') {
    return (
      <ol className="bmg-timeline-liste">
        {kartlar.map((k, i) => (
          <li key={k.id} className="bmg-timeline-oge">
            <span className="bmg-timeline-nokta" style={{ borderColor: renk.vurgu, color: renk.vurgu }}>
              {k.ikon || i + 1}
            </span>
            <span className="bmg-timeline-metin" style={{ color: renk.metin }}>
              {k.metin}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (varyant === 'bento') {
    return (
      <div className="bmg-bento-ikonlar">
        {kartlar.map((k) => (
          <div key={k.id} className="bmg-bento-ikon-kart">
            <span className="bmg-bento-ikon-emoji" style={{ color: renk.vurgu }}>
              {k.ikon}
            </span>
            <span className="bmg-bento-ikon-metin">{k.metin}</span>
          </div>
        ))}
      </div>
    );
  }

  if (varyant === 'kutu') {
    return (
      <div className="bmg-ikon-kutular">
        {kartlar.map((k) => (
          <div key={k.id} className="bmg-ikon-kutu">
            <span style={{ color: renk.vurgu }}>{k.ikon}</span>
            <span>{k.metin}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bmg-ikon-pills">
      {kartlar.map((k) => (
        <span key={k.id} className="bmg-ikon-pill" style={{ borderColor: `${renk.vurgu}33`, color: renk.metin }}>
          <span style={{ color: renk.vurgu }}>{k.ikon}</span>
          {k.metin}
        </span>
      ))}
    </div>
  );
}

function BaslikAlani({
  widget,
  cfg,
  renk,
  acik = false,
  buyuk = false,
}: {
  widget: Widget;
  cfg: Cfg;
  renk: ReturnType<typeof renkler>;
  acik?: boolean;
  buyuk?: boolean;
}) {
  return (
    <>
      {widget.altBaslik && (
        <p
          className="bmg-alt-baslik"
          style={{ color: acik ? 'rgba(255,255,255,0.85)' : renk.vurgu }}
        >
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2
          className={`${baslikSinifi(cfg)} bmg-baslik${buyuk ? ' bmg-baslik-buyuk' : ''}`}
          style={{ color: acik ? '#fff' : renk.baslik }}
        >
          {widget.baslik}
        </h2>
      )}
    </>
  );
}

function MetinParagraf({ cfg, renk, acik }: { cfg: Cfg; renk: ReturnType<typeof renkler>; acik?: boolean }) {
  if (!cfg.metin) return null;
  return (
    <p className="bmg-metin" style={{ color: acik ? 'rgba(255,255,255,0.88)' : renk.metin }}>
      {cfg.metin}
    </p>
  );
}

function SinematikHero({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl: string }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];
  return (
    <div className="bmg-sinematik-hero">
      <div className="bmg-sinematik-gorsel-wrap">
        <img src={medyaUrl(gorselUrl)} alt="" className="bmg-sinematik-gorsel" />
        <div className="bmg-sinematik-overlay" />
      </div>
      <div className="bmg-sinematik-serit">
        <div className="bmg-sinematik-serit-icerik">
          <div className="bmg-sinematik-metin">
            <BaslikAlani widget={widget} cfg={cfg} renk={renk} acik buyuk />
            <MetinParagraf cfg={cfg} renk={renk} acik />
            <CtaButon widget={widget} acik />
          </div>
          {ikonKartlar.length > 0 && <IkonKartlar kartlar={ikonKartlar} renk={renk} />}
        </div>
      </div>
    </div>
  );
}

function BentoGrid({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];
  const konum = cfg.gorunum?.gorselKonumu ?? 'sag';

  return (
    <div className={`bmg-bento${konum === 'sol' ? ' bmg-bento-gorsel-sol' : ''}`}>
      <div className="bmg-bento-metin-kutu">
        <BaslikAlani widget={widget} cfg={cfg} renk={renk} />
        <MetinParagraf cfg={cfg} renk={renk} />
        <CtaButon widget={widget} />
      </div>
      {gorselUrl ? (
        <div className="bmg-bento-gorsel-kutu">
          <img src={medyaUrl(gorselUrl)} alt="" className="bmg-bento-gorsel" />
        </div>
      ) : (
        <div className="bmg-bento-gorsel-kutu bmg-bento-gorsel-bos">Görsel</div>
      )}
      {ikonKartlar.length > 0 && <IkonKartlar kartlar={ikonKartlar} varyant="bento" renk={renk} />}
    </div>
  );
}

function CaprazSplit({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];
  const konum = cfg.gorunum?.gorselKonumu ?? 'sag';

  return (
    <div className={`bmg-capraz${konum === 'sol' ? ' bmg-capraz-ters' : ''}`}>
      <div className="bmg-capraz-metin" style={{ background: `linear-gradient(135deg, ${renk.vurgu}18, ${renk.vurgu}08)` }}>
        <div className="bmg-capraz-metin-icerik">
          <BaslikAlani widget={widget} cfg={cfg} renk={renk} />
          <MetinParagraf cfg={cfg} renk={renk} />
          {ikonKartlar.length > 0 && <IkonKartlar kartlar={ikonKartlar} varyant="kutu" renk={renk} />}
          <CtaButon widget={widget} />
        </div>
      </div>
      <div className="bmg-capraz-gorsel">
        {gorselUrl ? (
          <img src={medyaUrl(gorselUrl)} alt="" />
        ) : (
          <div className="bmg-capraz-gorsel-bos">Görsel</div>
        )}
      </div>
    </div>
  );
}

function DergiEditorial({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];

  return (
    <div className="bmg-dergi">
      <div className="bmg-dergi-gorsel-alan">
        {gorselUrl ? (
          <img src={medyaUrl(gorselUrl)} alt="" className="bmg-dergi-gorsel" />
        ) : (
          <div className="bmg-dergi-gorsel-bos">Görsel</div>
        )}
        {widget.baslik && (
          <h2
            className={`${baslikSinifi(cfg)} bmg-dergi-baslik-overlay`}
            style={{ color: renk.baslik }}
          >
            {widget.baslik}
          </h2>
        )}
      </div>
      <div className="bmg-dergi-metin-alan">
        {widget.altBaslik && (
          <p className="bmg-alt-baslik" style={{ color: renk.vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        <MetinParagraf cfg={cfg} renk={renk} />
        {ikonKartlar.length > 0 && <IkonKartlar kartlar={ikonKartlar} varyant="kutu" renk={renk} />}
        <CtaButon widget={widget} />
      </div>
    </div>
  );
}

function TimelineGorsel({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];

  return (
    <div className="bmg-timeline-wrap">
      <div className="bmg-timeline-sol">
        <BaslikAlani widget={widget} cfg={cfg} renk={renk} />
        <MetinParagraf cfg={cfg} renk={renk} />
        <IkonKartlar kartlar={ikonKartlar} varyant="timeline" renk={renk} />
        <CtaButon widget={widget} />
      </div>
      <div className="bmg-timeline-sag">
        {gorselUrl ? (
          <img src={medyaUrl(gorselUrl)} alt="" className="bmg-timeline-gorsel" />
        ) : (
          <div className="bmg-timeline-gorsel-bos">Görsel</div>
        )}
      </div>
    </div>
  );
}

function PolaroidKolaj({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];
  const konum = cfg.gorunum?.gorselKonumu ?? 'sol';

  return (
    <div className={`bmg-polaroid${konum === 'sag' ? ' bmg-polaroid-ters' : ''}`}>
      <div className="bmg-polaroid-foto-alan">
        {gorselUrl ? (
          <figure className="bmg-polaroid-cerceve">
            <img src={medyaUrl(gorselUrl)} alt="" />
          </figure>
        ) : (
          <figure className="bmg-polaroid-cerceve bmg-polaroid-bos">Görsel</figure>
        )}
      </div>
      <div className="bmg-polaroid-not">
        <BaslikAlani widget={widget} cfg={cfg} renk={renk} />
        <MetinParagraf cfg={cfg} renk={renk} />
        {ikonKartlar.length > 0 && <IkonKartlar kartlar={ikonKartlar} varyant="pill" renk={renk} />}
        <CtaButon widget={widget} sinif="bmg-cta bmg-cta-damga" />
      </div>
    </div>
  );
}

export function BaslikMetinGorselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);
  const gorselUrl = widget.gorselUrl;

  let icerik: ReactNode;

  switch (gt) {
    case 'sinematik-hero':
      icerik = gorselUrl ? (
        <SinematikHero widget={widget} cfg={cfg} gorselUrl={gorselUrl} />
      ) : (
        <BentoGrid widget={widget} cfg={cfg} gorselUrl={gorselUrl} />
      );
      break;
    case 'bento-grid':
      icerik = <BentoGrid widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'capraz-split':
      icerik = <CaprazSplit widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'dergi-editorial':
      icerik = <DergiEditorial widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'timeline-gorsel':
      icerik = <TimelineGorsel widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'polaroid-kolaj':
      icerik = <PolaroidKolaj widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    default:
      icerik = <BentoGrid widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
