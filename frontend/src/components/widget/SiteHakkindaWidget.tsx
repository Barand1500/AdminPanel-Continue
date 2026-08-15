import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetIkonKart } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import { CizgiIkon, type CizgiIkonYedegi } from './CizgiIkonlari';

type Cfg = ReturnType<typeof configOkuFromWidget>;

const IKON_KARTI_YEDEKLERI: readonly CizgiIkonYedegi[] = [
  'memnuniyet',
  'kalite',
  'basari',
  'whatsapp',
  'ekip',
  'hedef',
];

function renkler(cfg: Cfg) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#111827',
    metin: g.metinRengi || '#4b5563',
    vurgu: g.vurguRengi || g.baslikRengi || '#111827',
  };
}

function BaslikAlani({
  widget,
  cfg,
  renk,
  acik = false,
}: {
  widget: Widget;
  cfg: Cfg;
  renk: ReturnType<typeof renkler>;
  acik?: boolean;
}) {
  return (
    <>
      {widget.altBaslik && (
        <p className="sh-alt-baslik" style={{ color: acik ? 'rgba(255,255,255,0.85)' : renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2
          className={`${baslikSinifi(cfg)} sh-baslik`}
          style={{ color: acik ? '#fff' : renk.baslik }}
        >
          {widget.baslik}
        </h2>
      )}
    </>
  );
}

function MetinParagraf({
  cfg,
  renk,
  acik = false,
}: {
  cfg: Cfg;
  renk: ReturnType<typeof renkler>;
  acik?: boolean;
}) {
  if (!cfg.metin) return null;
  return (
    <p className="sh-metin" style={{ color: acik ? 'rgba(255,255,255,0.9)' : renk.metin }}>
      {cfg.metin}
    </p>
  );
}

type IkonVaryant = 'check' | 'kutu' | 'timeline' | 'pill' | 'yildiz' | 'emoji';

function OzellikListesi({
  kartlar,
  renk,
  varyant = 'check',
}: {
  kartlar: WidgetIkonKart[];
  renk: ReturnType<typeof renkler>;
  varyant?: IkonVaryant;
}) {
  if (kartlar.length === 0) return null;

  if (varyant === 'timeline') {
    return (
      <ol className="sh-ozellik-timeline">
        {kartlar.map((k, i) => (
          <li key={k.id} className="sh-ozellik-timeline-oge">
            <span className="sh-ozellik-timeline-no" style={{ borderColor: renk.vurgu, color: renk.vurgu }}>
              {i + 1}
            </span>
            <span style={{ color: renk.metin }}>{k.metin}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (varyant === 'kutu') {
    return (
      <div className="sh-ozellik-kutular">
        {kartlar.map((k, i) => (
          <div key={k.id} className="sh-ozellik-kutu">
            <span className="sh-ozellik-kutu-ikon" style={{ color: renk.vurgu }}>
              <CizgiIkon deger={k.ikon || k.metin} yedek={IKON_KARTI_YEDEKLERI[i % IKON_KARTI_YEDEKLERI.length]} />
            </span>
            <span>{k.metin}</span>
          </div>
        ))}
      </div>
    );
  }

  if (varyant === 'pill') {
    return (
      <div className="sh-ozellik-pills">
        {kartlar.map((k, i) => (
          <span key={k.id} className="sh-ozellik-pill" style={{ borderColor: `${renk.vurgu}33`, color: renk.metin }}>
            <span className="inline-flex" style={{ color: renk.vurgu }}>
              <CizgiIkon deger={k.ikon || k.metin} yedek={IKON_KARTI_YEDEKLERI[i % IKON_KARTI_YEDEKLERI.length]} boyut={18} />
            </span>
            {k.metin}
          </span>
        ))}
      </div>
    );
  }

  if (varyant === 'yildiz') {
    return (
      <ul className="sh-ozellik-yildiz">
        {kartlar.map((k) => (
          <li key={k.id} className="sh-ozellik-yildiz-oge">
            <span style={{ color: '#facc15' }}>★</span>
            <span style={{ color: renk.metin }}>{k.metin}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (varyant === 'emoji') {
    return (
      <div className="sh-ozellik-emoji-grid">
        {kartlar.map((k, i) => (
          <div key={k.id} className="sh-ozellik-emoji-kart">
            <span className="sh-ozellik-emoji-buyuk" style={{ color: renk.vurgu }}>
              <CizgiIkon deger={k.ikon || k.metin} yedek={IKON_KARTI_YEDEKLERI[i % IKON_KARTI_YEDEKLERI.length]} boyut={32} />
            </span>
            <span className="sh-ozellik-emoji-metin">{k.metin}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="sh-ozellik-check-grid">
      {kartlar.map((k, i) => (
        <li key={k.id} className="sh-ozellik-check">
          <span className="sh-ozellik-check-ikon" style={{ background: renk.vurgu }}>
            <CizgiIkon deger={k.ikon || k.metin} yedek={IKON_KARTI_YEDEKLERI[i % IKON_KARTI_YEDEKLERI.length]} boyut={17} />
          </span>
          <span style={{ color: renk.metin }}>{k.metin}</span>
        </li>
      ))}
    </ul>
  );
}

function CtaButon({
  widget,
  sinif = 'sh-cta',
  play = false,
}: {
  widget: Widget;
  sinif?: string;
  play?: boolean;
}) {
  if (!widget.butonLink || !widget.butonMetni) return null;
  const icerik = play ? (
    <>
      <span className="sh-cta-play" aria-hidden>
        ▶
      </span>
      {widget.butonMetni}
    </>
  ) : (
    <>
      {widget.butonMetni}
      <span aria-hidden>→</span>
    </>
  );

  if (widget.butonLink.startsWith('/')) {
    return (
      <Link to={widget.butonLink} className={sinif}>
        {icerik}
      </Link>
    );
  }
  return (
    <a href={widget.butonLink} className={sinif}>
      {icerik}
    </a>
  );
}

function GorselAlani({
  gorselUrl,
  widget,
  sinif = '',
  playCta = false,
}: {
  gorselUrl?: string | null;
  widget: Widget;
  sinif?: string;
  playCta?: boolean;
}) {
  return (
    <div className={`sh-gorsel-wrap ${sinif}`.trim()}>
      {gorselUrl ? (
        <img src={medyaUrl(gorselUrl)} alt="" className="sh-gorsel-img" />
      ) : (
        <div className="sh-gorsel-bos">Görsel</div>
      )}
      {playCta && widget.butonMetni && widget.butonLink && (
        <CtaButon widget={widget} sinif="sh-cta sh-cta-play-overlay" play />
      )}
    </div>
  );
}

function IcerikBlok({
  widget,
  cfg,
  renk,
  ikonVaryant,
  cta = false,
  acik = false,
}: {
  widget: Widget;
  cfg: Cfg;
  renk: ReturnType<typeof renkler>;
  ikonVaryant: IkonVaryant;
  cta?: boolean;
  acik?: boolean;
}) {
  const ikonKartlar = cfg.ikonKartlar ?? [];
  return (
    <div className="sh-icerik">
      <BaslikAlani widget={widget} cfg={cfg} renk={renk} acik={acik} />
      <MetinParagraf cfg={cfg} renk={renk} acik={acik} />
      <OzellikListesi kartlar={ikonKartlar} renk={renk} varyant={ikonVaryant} />
      {cta && <CtaButon widget={widget} />}
    </div>
  );
}

function SplitKlasik({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  return (
    <div className="sh-split-klasik">
      <IcerikBlok widget={widget} cfg={cfg} renk={renk} ikonVaryant="check" />
      <GorselAlani gorselUrl={gorselUrl} widget={widget} sinif="sh-gorsel-sol-alt-yuvarlak" playCta />
    </div>
  );
}

function SplitTers({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  return (
    <div className="sh-split-ters">
      <GorselAlani gorselUrl={gorselUrl} widget={widget} sinif="sh-gorsel-sag-alt-yuvarlak" />
      <IcerikBlok widget={widget} cfg={cfg} renk={renk} ikonVaryant="kutu" cta />
    </div>
  );
}

function UstAltGenis({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  return (
    <div className="sh-ust-alt">
      <IcerikBlok widget={widget} cfg={cfg} renk={renk} ikonVaryant="timeline" />
      <div className="sh-ust-alt-alt">
        <GorselAlani gorselUrl={gorselUrl} widget={widget} sinif="sh-gorsel-ust-yuvarlak" />
        {widget.butonMetni && widget.butonLink && (
          <div className="sh-ust-alt-cta-serit">
            <CtaButon widget={widget} sinif="sh-cta sh-cta-serit" play />
          </div>
        )}
      </div>
    </div>
  );
}

function CaprazPanel({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  return (
    <div className="sh-capraz">
      <IcerikBlok widget={widget} cfg={cfg} renk={renk} ikonVaryant="pill" />
      <GorselAlani gorselUrl={gorselUrl} widget={widget} sinif="sh-gorsel-capraz" playCta />
    </div>
  );
}

function GradientKart({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  return (
    <div className="sh-gradient-kart" style={{ background: `linear-gradient(135deg, ${renk.vurgu}18, #fff 55%)` }}>
      <IcerikBlok widget={widget} cfg={cfg} renk={renk} ikonVaryant="yildiz" cta />
      <GorselAlani gorselUrl={gorselUrl} widget={widget} sinif="sh-gorsel-cam" />
    </div>
  );
}

function BentoHakkimizda({ widget, cfg, gorselUrl }: { widget: Widget; cfg: Cfg; gorselUrl?: string | null }) {
  const renk = renkler(cfg);
  const ikonKartlar = cfg.ikonKartlar ?? [];
  const kurumsalYedekleri: CizgiIkonYedegi[] = ['memnuniyet', 'kalite', 'basari', 'whatsapp'];
  return (
    <div className="sh-kurumsal-split">
      <GorselAlani gorselUrl={gorselUrl} widget={widget} sinif="sh-kurumsal-gorsel sh-kurumsal-gorsel-clip" />
      <div className="sh-kurumsal-icerik">
        <BaslikAlani widget={widget} cfg={cfg} renk={renk} />
        <MetinParagraf cfg={cfg} renk={renk} />
        {ikonKartlar.length > 0 && (
          <ul className="sh-kurumsal-ozellik-grid">
            {ikonKartlar.map((kart, indeks) => (
              <li key={kart.id} className="sh-kurumsal-ozellik">
                <span
                  className="sh-kurumsal-ozellik-ikon"
                  style={{ color: renk.vurgu }}
                  aria-hidden
                >
                  <CizgiIkon deger={kart.ikon || kart.metin} yedek={kurumsalYedekleri[indeks % kurumsalYedekleri.length]} />
                </span>
                <span className="sh-kurumsal-ozellik-metin" style={{ color: renk.baslik }}>
                  {kart.metin}
                </span>
              </li>
            ))}
          </ul>
        )}
        <CtaButon widget={widget} sinif="sh-cta sh-kurumsal-cta" play />
      </div>
    </div>
  );
}

export function SiteHakkindaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);
  const gorselUrl = widget.gorselUrl;

  let icerik: ReactNode;

  switch (gt) {
    case 'split-ters':
      icerik = <SplitTers widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'ust-alt-genis':
      icerik = <UstAltGenis widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'capraz-panel':
      icerik = <CaprazPanel widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'gradient-kart':
      icerik = <GradientKart widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'bento-hakkimizda':
      icerik = <BentoHakkimizda widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
      break;
    case 'split-klasik':
    default:
      icerik = <SplitKlasik widget={widget} cfg={cfg} gorselUrl={gorselUrl} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
