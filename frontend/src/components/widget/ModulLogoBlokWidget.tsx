import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetEtiketKarti, WidgetIkonKart } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || '#7c3aed',
  };
}

function OzellikListesi({ ozellikler, vurgu }: { ozellikler: WidgetIkonKart[]; vurgu: string }) {
  if (ozellikler.length === 0) return null;
  return (
    <ul className="mlb-ozellikler">
      {ozellikler.map((o) => (
        <li key={o.id} className="mlb-ozellik">
          <span className="mlb-ozellik-isaret" style={{ color: vurgu }}>
            {o.ikon || '✓'}
          </span>
          <span>{o.metin}</span>
        </li>
      ))}
    </ul>
  );
}

function ModulBaslik({
  widget,
  renk,
  ikon,
}: {
  widget: Widget;
  renk: ReturnType<typeof renkler>;
  ikon?: string;
}) {
  return (
    <div className="mlb-baslik-alan">
      {ikon && (
        <div className="mlb-modul-ikon" style={{ background: renk.vurgu }}>
          <span aria-hidden>{ikon}</span>
        </div>
      )}
      <div className="mlb-baslik-metin">
        {widget.baslik && (
          <h2 className="mlb-baslik" style={{ color: renk.baslik }}>
            {widget.baslik}
          </h2>
        )}
        {widget.aciklama && (
          <p className="mlb-aciklama" style={{ color: renk.metin }}>
            {widget.aciklama}
          </p>
        )}
      </div>
    </div>
  );
}

function LogoKart({
  kart,
  radius,
  sinif = '',
  dahaFazla = false,
}: {
  kart: WidgetEtiketKarti;
  radius: number;
  sinif?: string;
  dahaFazla?: boolean;
}) {
  const icerik = (
    <>
      {kart.gorselUrl && !dahaFazla ? (
        <img src={medyaUrl(kart.gorselUrl)} alt={kart.etiket} className="mlb-logo-img" />
      ) : null}
      {kart.etiket && <span className={`mlb-logo-etiket${dahaFazla ? ' mlb-logo-daha-fazla' : ''}`}>{kart.etiket}</span>}
    </>
  );

  const stil = { borderRadius: `${Math.max(6, radius - 4)}px` };

  if (kart.link && !dahaFazla) {
    const href = kart.link;
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={`mlb-logo-kart ${sinif}`.trim()} style={stil}>
          {icerik}
        </Link>
      );
    }
    return (
      <a href={href} className={`mlb-logo-kart ${sinif}`.trim()} style={stil}>
        {icerik}
      </a>
    );
  }

  return (
    <div className={`mlb-logo-kart ${sinif}${dahaFazla ? ' mlb-logo-kart-daha-fazla' : ''}`.trim()} style={stil}>
      {icerik}
    </div>
  );
}

function LogoGrid({
  logolar,
  cfg,
  sinif = '',
  kolon = 4,
}: {
  logolar: WidgetEtiketKarti[];
  cfg: WidgetConfig;
  sinif?: string;
  kolon?: number;
}) {
  const radius = cfg.gorunum?.borderRadius ?? 12;
  const dahaFazlaMetin = cfg.dahaFazlaMetin;
  const dahaFazlaLink = cfg.dahaFazlaLink;

  return (
    <div
      className={`mlb-logo-grid ${sinif}`.trim()}
      style={{ gridTemplateColumns: `repeat(${Math.min(kolon, 6)}, minmax(0, 1fr))` }}
    >
      {logolar.map((l) => (
        <LogoKart key={l.id} kart={l} radius={radius} />
      ))}
      {dahaFazlaMetin && (
        <LogoKart
          kart={{ id: '_daha', etiket: dahaFazlaMetin, gorselUrl: '', link: dahaFazlaLink ?? '' }}
          radius={radius}
          dahaFazla
        />
      )}
    </div>
  );
}

function IcerikBolumu({
  widget,
  cfg,
  ozellikler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
}) {
  const renk = renkler(cfg);
  return (
    <div className="mlb-icerik">
      {widget.altBaslik && (
        <p className="mlb-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      <ModulBaslik widget={widget} renk={renk} ikon={cfg.modulIkon} />
      <OzellikListesi ozellikler={ozellikler} vurgu={renk.vurgu} />
      {widget.butonLink && widget.butonMetni && (
        <a href={widget.butonLink} className="mlb-cta" style={{ background: renk.vurgu }}>
          {widget.butonMetni}
        </a>
      )}
    </div>
  );
}

function CerceveliSplit({
  widget,
  cfg,
  ozellikler,
  logolar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
  logolar: WidgetEtiketKarti[];
}) {
  const radius = cfg.gorunum?.borderRadius ?? 16;
  return (
    <div className="mlb-cerceve" style={{ borderRadius: `${radius}px` }}>
      <div className="mlb-split">
        <IcerikBolumu widget={widget} cfg={cfg} ozellikler={ozellikler} />
        <LogoGrid logolar={logolar} cfg={cfg} kolon={cfg.gorunum?.kolonSayisi ?? 4} />
      </div>
    </div>
  );
}

function SplitTers({
  widget,
  cfg,
  ozellikler,
  logolar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
  logolar: WidgetEtiketKarti[];
}) {
  const radius = cfg.gorunum?.borderRadius ?? 16;
  return (
    <div className="mlb-cerceve mlb-cerceve-ters" style={{ borderRadius: `${radius}px` }}>
      <div className="mlb-split mlb-split-ters">
        <LogoGrid logolar={logolar} cfg={cfg} kolon={cfg.gorunum?.kolonSayisi ?? 4} />
        <IcerikBolumu widget={widget} cfg={cfg} ozellikler={ozellikler} />
      </div>
    </div>
  );
}

function UstAltGrid({
  widget,
  cfg,
  ozellikler,
  logolar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
  logolar: WidgetEtiketKarti[];
}) {
  const renk = renkler(cfg);
  const radius = cfg.gorunum?.borderRadius ?? 16;
  return (
    <div className="mlb-ust-alt" style={{ borderRadius: `${radius}px` }}>
      <div className="mlb-ust-alt-baslik">
        {widget.altBaslik && (
          <p className="mlb-alt-baslik" style={{ color: renk.vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        <ModulBaslik widget={widget} renk={renk} ikon={cfg.modulIkon} />
        <OzellikListesi ozellikler={ozellikler} vurgu={renk.vurgu} />
      </div>
      <LogoGrid logolar={logolar} cfg={cfg} sinif="mlb-logo-grid-genis" kolon={cfg.gorunum?.kolonSayisi ?? 4} />
    </div>
  );
}

function GradientKart({
  widget,
  cfg,
  ozellikler,
  logolar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
  logolar: WidgetEtiketKarti[];
}) {
  const renk = renkler(cfg);
  const radius = cfg.gorunum?.borderRadius ?? 20;
  return (
    <div
      className="mlb-gradient"
      style={{
        borderRadius: `${radius}px`,
        background: `linear-gradient(135deg, ${renk.vurgu}18 0%, ${renk.vurgu}08 50%, #fff 100%)`,
      }}
    >
      <div className="mlb-split">
        <IcerikBolumu widget={widget} cfg={cfg} ozellikler={ozellikler} />
        <LogoGrid logolar={logolar} cfg={cfg} sinif="mlb-logo-grid-cam" kolon={3} />
      </div>
    </div>
  );
}

function LogoMarquee({
  widget,
  cfg,
  ozellikler,
  logolar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
  logolar: WidgetEtiketKarti[];
}) {
  const radius = cfg.gorunum?.borderRadius ?? 16;
  const cift = [...logolar, ...logolar];
  return (
    <div className="mlb-marquee-wrap" style={{ borderRadius: `${radius}px` }}>
      <div className="mlb-marquee-split">
        <IcerikBolumu widget={widget} cfg={cfg} ozellikler={ozellikler} />
        <div className="mlb-marquee-alan">
          <div className="mlb-marquee-iz">
            {cift.map((l, i) => (
              <LogoKart key={`${l.id}-${i}`} kart={l} radius={radius} sinif="mlb-marquee-kart" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoModul({
  widget,
  cfg,
  ozellikler,
  logolar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  ozellikler: WidgetIkonKart[];
  logolar: WidgetEtiketKarti[];
}) {
  const renk = renkler(cfg);
  const radius = cfg.gorunum?.borderRadius ?? 14;
  return (
    <div className="mlb-bento">
      <div className="mlb-bento-icerik" style={{ borderRadius: `${radius}px` }}>
        {widget.altBaslik && (
          <p className="mlb-alt-baslik" style={{ color: renk.vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        {cfg.modulIkon && (
          <div className="mlb-modul-ikon mlb-modul-ikon-buyuk" style={{ background: renk.vurgu }}>
            <span aria-hidden>{cfg.modulIkon}</span>
          </div>
        )}
        {widget.baslik && (
          <h2 className="mlb-baslik" style={{ color: renk.baslik }}>
            {widget.baslik}
          </h2>
        )}
        {widget.aciklama && (
          <p className="mlb-aciklama" style={{ color: renk.metin }}>
            {widget.aciklama}
          </p>
        )}
        <OzellikListesi ozellikler={ozellikler} vurgu={renk.vurgu} />
      </div>
      {logolar.map((l, i) => (
        <LogoKart
          key={l.id}
          kart={l}
          radius={radius}
          sinif={`mlb-bento-hucre mlb-bento-hucre-${(i % 5) + 1}`}
        />
      ))}
      {cfg.dahaFazlaMetin && (
        <LogoKart
          kart={{ id: '_daha', etiket: cfg.dahaFazlaMetin, gorselUrl: '', link: cfg.dahaFazlaLink ?? '' }}
          radius={radius}
          sinif="mlb-bento-hucre mlb-bento-hucre-daha"
          dahaFazla
        />
      )}
    </div>
  );
}

export function ModulLogoBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const ozellikler = cfg.ikonKartlar ?? [];
  const logolar = cfg.logoKartlar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (!widget.baslik && ozellikler.length === 0 && logolar.length === 0) return null;

  const ortak = { widget, cfg, ozellikler, logolar };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'split-ters' && <SplitTers {...ortak} />}
      {gt === 'ust-alt-grid' && <UstAltGrid {...ortak} />}
      {gt === 'gradient-kart' && <GradientKart {...ortak} />}
      {gt === 'logo-marquee' && <LogoMarquee {...ortak} />}
      {gt === 'bento-modul' && <BentoModul {...ortak} />}
      {(gt === 'cerceveli-split' || !gt) && <CerceveliSplit {...ortak} />}
    </WidgetKabuk>
  );
}
