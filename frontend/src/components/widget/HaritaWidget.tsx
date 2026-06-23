import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetHaritaSube } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, haritaEmbedUrl } from './widgetHelpers';

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

function haritaSrc(
  cfg: Cfg,
  sube?: Pick<WidgetHaritaSube, 'haritaUrl' | 'haritaLat' | 'haritaLng' | 'haritaZoom'>
) {
  const url = sube?.haritaUrl ?? cfg.haritaUrl;
  const lat = sube?.haritaLat ?? cfg.haritaLat;
  const lng = sube?.haritaLng ?? cfg.haritaLng;
  const zoom = sube?.haritaZoom ?? cfg.haritaZoom ?? 14;
  return haritaEmbedUrl(url, lat, lng, zoom);
}

function HaritaIframe({ src, className }: { src: string; className?: string }) {
  return (
    <iframe
      title="Harita"
      src={src}
      className={className ?? 'hr-iframe'}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function CtaButon({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  if (!widget.butonMetni?.trim()) return null;
  const renk = renkler(cfg);
  const link = widget.butonLink?.trim();
  const sinif = 'hr-cta';
  const stil = { backgroundColor: renk.vurgu, borderRadius: renk.radius };
  if (link?.startsWith('/')) {
    return (
      <Link to={link} className={sinif} style={stil}>
        {widget.butonMetni}
      </Link>
    );
  }
  if (link) {
    const href = link.startsWith('http') ? link : `https://${link}`;
    return (
      <a href={href} className={sinif} style={stil} target="_blank" rel="noopener noreferrer">
        {widget.butonMetni}
      </a>
    );
  }
  return (
    <span className={sinif} style={stil}>
      {widget.butonMetni}
    </span>
  );
}

function BilgiPaneli({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  const renk = renkler(cfg);
  return (
    <div className="hr-bilgi-panel">
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} hr-bilgi-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="hr-bilgi-metin" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
      <CtaButon widget={widget} cfg={cfg} />
    </div>
  );
}

function SplitSolBilgi({ widget, cfg, src }: { widget: Widget; cfg: Cfg; src: string }) {
  const renk = renkler(cfg);
  return (
    <div className="hr-split">
      <BilgiPaneli widget={widget} cfg={cfg} />
      <div className="hr-harita-kapsul" style={{ borderRadius: renk.radius }}>
        <HaritaIframe src={src} />
      </div>
    </div>
  );
}

function SplitTers({ widget, cfg, src }: { widget: Widget; cfg: Cfg; src: string }) {
  const renk = renkler(cfg);
  return (
    <div className="hr-split hr-split-ters">
      <div className="hr-harita-kapsul" style={{ borderRadius: renk.radius }}>
        <HaritaIframe src={src} />
      </div>
      <BilgiPaneli widget={widget} cfg={cfg} />
    </div>
  );
}

function UstBantAlt({ widget, cfg, src }: { widget: Widget; cfg: Cfg; src: string }) {
  const renk = renkler(cfg);
  return (
    <div className="hr-bant-wrap" style={{ borderRadius: renk.radius }}>
      {(widget.baslik || widget.altBaslik || widget.aciklama) && (
        <div className="hr-bant-ust" style={{ background: `linear-gradient(135deg, ${renk.vurgu}, #f59e0b)` }}>
          {widget.altBaslik && <p className="hr-bant-etiket">{widget.altBaslik}</p>}
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} hr-bant-baslik`}>{widget.baslik}</h2>}
          {widget.aciklama && <p className="hr-bant-aciklama">{widget.aciklama}</p>}
        </div>
      )}
      <HaritaIframe src={src} className="hr-bant-harita" />
    </div>
  );
}

function YanIkonListe({ widget, cfg, src }: { widget: Widget; cfg: Cfg; src: string }) {
  const renk = renkler(cfg);
  const satirlar = cfg.ikonKartlar ?? [];
  return (
    <div className="hr-yan-wrap">
      <div className="hr-yan-sol">
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} hr-yan-baslik`} style={{ color: renk.baslik }}>
            {widget.baslik}
          </h2>
        )}
        {widget.aciklama && (
          <p className="hr-yan-aciklama" style={{ color: renk.metin }}>
            {widget.aciklama}
          </p>
        )}
        <div className="hr-harita-kapsul hr-yan-harita" style={{ borderRadius: renk.radius }}>
          <HaritaIframe src={src} />
        </div>
      </div>
      {satirlar.length > 0 && (
        <ul className="hr-ikon-liste">
          {satirlar.map((k) => (
            <li key={k.id} className="hr-ikon-oge" style={{ borderRadius: renk.radius }}>
              <span className="hr-ikon-kutu" style={{ backgroundColor: `${renk.vurgu}18`, color: renk.vurgu }}>
                {k.ikon}
              </span>
              <span className="hr-ikon-metin" style={{ color: renk.baslik }}>
                {k.metin}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KompaktKart({ widget, cfg, src }: { widget: Widget; cfg: Cfg; src: string }) {
  const renk = renkler(cfg);
  return (
    <div className="hr-kompakt">
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} hr-kompakt-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      <div className="hr-kompakt-kart" style={{ borderRadius: renk.radius }}>
        <HaritaIframe src={src} />
      </div>
      <div className="hr-kompakt-alt">
        <CtaButon widget={widget} cfg={cfg} />
      </div>
    </div>
  );
}

function SekmeSubeler({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  const subeler = cfg.haritaSubeler ?? [];
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);

  const kaynaklar: WidgetHaritaSube[] =
    subeler.length > 0
      ? subeler
      : [{ id: 'varsayilan', ad: 'Konum', haritaUrl: cfg.haritaUrl, haritaLat: cfg.haritaLat, haritaLng: cfg.haritaLng, haritaZoom: cfg.haritaZoom }];

  const secili = kaynaklar[aktif] ?? kaynaklar[0];
  const src = haritaSrc(cfg, secili);
  if (!src) return null;

  return (
    <>
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} hr-sekme-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="hr-sekme-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
      {kaynaklar.length > 1 && (
        <div className="hr-sekme-liste">
          {kaynaklar.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`hr-sekme ${i === aktif ? 'hr-sekme-aktif' : ''}`}
              style={i === aktif ? { backgroundColor: renk.vurgu, borderColor: renk.vurgu } : undefined}
              onClick={() => setAktif(i)}
            >
              {s.ad}
            </button>
          ))}
        </div>
      )}
      <div className="hr-harita-kapsul hr-sekme-harita" style={{ borderRadius: renk.radius }}>
        <HaritaIframe src={src} />
      </div>
    </>
  );
}

export function HaritaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);

  if (gt === 'sekme-subeler') {
    const subeler = cfg.haritaSubeler ?? [];
    const varsayilanSrc = haritaSrc(cfg);
    if (subeler.length === 0 && !varsayilanSrc) return null;
    return (
      <WidgetKabuk widget={widget}>
        <SekmeSubeler widget={widget} cfg={cfg} />
      </WidgetKabuk>
    );
  }

  const src = haritaSrc(cfg);
  if (!src) return null;

  let icerik;
  switch (gt) {
    case 'split-ters':
      icerik = <SplitTers widget={widget} cfg={cfg} src={src} />;
      break;
    case 'ust-bant-alt':
      icerik = <UstBantAlt widget={widget} cfg={cfg} src={src} />;
      break;
    case 'yan-ikon-liste':
      icerik = <YanIkonListe widget={widget} cfg={cfg} src={src} />;
      break;
    case 'kompakt-kart':
      icerik = <KompaktKart widget={widget} cfg={cfg} src={src} />;
      break;
    default:
      icerik = <SplitSolBilgi widget={widget} cfg={cfg} src={src} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
