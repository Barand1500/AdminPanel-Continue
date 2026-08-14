import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import {
  kurumsalHeroConfigOku,
  type KurumsalHeroSlayt,
} from '@/types/kurumsalHero';
import { useKurumsalHeroOverlay } from '@/contexts/KurumsalHeroOverlayContext';

interface KurumsalHeroWidgetProps {
  widget: Widget;
  onizleme?: boolean;
}

function HeroButonLink({
  buton,
  sinif,
}: {
  buton: { metin: string; link: string; renk?: string; yaziRenk?: string };
  sinif: string;
}) {
  if (!buton.metin?.trim()) return null;
  const link = buton.link || '#';
  const dis = link.startsWith('http');
  const stil =
    buton.renk || buton.yaziRenk
      ? { backgroundColor: buton.renk, color: buton.yaziRenk }
      : undefined;

  if (dis) {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={sinif} style={stil}>
        {buton.metin}
      </a>
    );
  }
  return (
    <Link to={link} className={sinif} style={stil}>
      {buton.metin}
    </Link>
  );
}

function SlaytIcerik({ slayt }: { slayt: KurumsalHeroSlayt }) {
  return (
    <div className="kurumsal-hero-icerik">
      <div className="container-site kurumsal-hero-icerik-grid">
        <div className="kurumsal-hero-metin">
          {slayt.baslik?.trim() && <h2 className="kurumsal-hero-baslik">{slayt.baslik}</h2>}
          {slayt.aciklama?.trim() && <p className="kurumsal-hero-aciklama">{slayt.aciklama}</p>}
          <div className="kurumsal-hero-butonlar">
            {slayt.birincilButon && (
              <HeroButonLink buton={slayt.birincilButon} sinif="kurumsal-hero-btn kurumsal-hero-btn--birincil" />
            )}
            {slayt.ikinciButon && (
              <HeroButonLink buton={slayt.ikinciButon} sinif="kurumsal-hero-btn kurumsal-hero-btn--ikincil" />
            )}
          </div>
        </div>
        {slayt.onGorselUrl?.trim() && (
          <div className="kurumsal-hero-on-gorsel" aria-hidden>
            <img src={medyaUrl(slayt.onGorselUrl)} alt="" />
          </div>
        )}
      </div>
    </div>
  );
}

export function KurumsalHeroWidget({ widget, onizleme }: KurumsalHeroWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const kh = kurumsalHeroConfigOku(cfg);
  const slaytlar = kh.slaytlar.filter((s) => s.aktif && s.arkaPlanUrl?.trim());
  const [aktif, setAktif] = useState(0);
  const overlay = useKurumsalHeroOverlay();
  const sureMs = Math.max(2000, (kh.gecisSuresiSn ?? 6) * 1000);
  const yukseklik = kh.gorunum.yukseklik ?? '85vh';

  useEffect(() => {
    setAktif(0);
  }, [slaytlar.length, widget.id]);

  useEffect(() => {
    if (onizleme || !kh.headerOverlay) return;
    overlay.activate({ yukseklik, ustBantGoster: kh.ustBantGoster });
    return () => overlay.deactivate();
  }, [onizleme, kh.headerOverlay, kh.ustBantGoster, yukseklik, overlay.activate, overlay.deactivate]);

  useEffect(() => {
    if (slaytlar.length <= 1) return;
    const timer = setInterval(() => setAktif((i) => (i + 1) % slaytlar.length), sureMs);
    return () => clearInterval(timer);
  }, [slaytlar.length, sureMs]);

  const onceki = useCallback(() => {
    setAktif((i) => (i - 1 + slaytlar.length) % slaytlar.length);
  }, [slaytlar.length]);

  const sonraki = useCallback(() => {
    setAktif((i) => (i + 1) % slaytlar.length);
  }, [slaytlar.length]);

  if (slaytlar.length === 0) {
    return (
      <section className="kurumsal-hero kurumsal-hero--bos" style={{ minHeight: yukseklik }}>
        <div className="kurumsal-hero-bos-icerik">
          <p className="text-sm text-white/80">Kurumsal hero slaytları admin panelden eklenebilir.</p>
        </div>
      </section>
    );
  }

  const slayt = slaytlar[aktif];
  const overlayRenk = kh.gorunum.overlayRenk ?? '#1e40af';
  const overlayOpaklik = kh.gorunum.overlayOpaklik ?? 0.72;
  const hex = overlayRenk.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) || 30;
  const g = parseInt(hex.slice(2, 4), 16) || 64;
  const b = parseInt(hex.slice(4, 6), 16) || 175;
  const overlayGradient = `linear-gradient(105deg, rgba(${r},${g},${b},${overlayOpaklik}) 0%, rgba(${r},${g},${b},${overlayOpaklik * 0.92}) 50%, rgba(${r},${g},${b},${overlayOpaklik * 0.75}) 100%)`;

  return (
    <section
      className={`kurumsal-hero${kh.headerOverlay && !onizleme ? ' kurumsal-hero--overlay' : ''}`}
      style={{ minHeight: yukseklik }}
      aria-label={widget.ad || 'Kurumsal hero'}
    >
      <div className="kurumsal-hero-sahne">
        <img
          src={medyaUrl(slayt.arkaPlanUrl)}
          alt={slayt.baslik || ''}
          className="kurumsal-hero-arkaplan"
        />
        <div className="kurumsal-hero-overlay" style={{ background: overlayGradient }} aria-hidden />
        <SlaytIcerik slayt={slayt} />
      </div>

      {slaytlar.length > 1 && (
        <>
          <div className="kurumsal-hero-noktalar" role="tablist" aria-label="Slayt seçimi">
            {slaytlar.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === aktif}
                aria-label={`Slayt ${i + 1}`}
                className={`kurumsal-hero-nokta${i === aktif ? ' kurumsal-hero-nokta--aktif' : ''}`}
                onClick={() => setAktif(i)}
              />
            ))}
          </div>
          <div className="kurumsal-hero-oklar">
            <button type="button" className="kurumsal-hero-ok" onClick={onceki} aria-label="Önceki slayt">
              ‹
            </button>
            <button type="button" className="kurumsal-hero-ok" onClick={sonraki} aria-label="Sonraki slayt">
              ›
            </button>
          </div>
        </>
      )}
    </section>
  );
}
