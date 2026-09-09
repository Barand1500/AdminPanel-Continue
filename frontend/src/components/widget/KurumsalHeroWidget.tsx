import { useEffect, useState, useCallback, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import {
  kurumsalHeroConfigOku,
  type KurumsalHeroSlayt,
} from '@/types/kurumsalHero';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';

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
  const sayfaIciHedef = link.startsWith('#') && link.length > 1;
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
  if (sayfaIciHedef) {
    return (
      <a
        href={link}
        className={sinif}
        style={stil}
        onClick={(olay) => {
          olay.preventDefault();
          const hedef = document.getElementById(link.slice(1));
          if (!hedef) return;
          window.history.replaceState(null, '', link);
          // Her zaman seçilen widgetın görünen ilk başlığına iner. Böylece
          // fiyatlandırmada da paketlerin altındaki butona kaymaz.
          const baslikHedefi = hedef.querySelector<HTMLElement>('h1, h2, h3');
          const kaydirmaHedefi = baslikHedefi ?? hedef;
          const headerBosluk = 78;
          const hedefY = window.scrollY + kaydirmaHedefi.getBoundingClientRect().top - headerBosluk;
          window.scrollTo({
            top: Math.max(0, hedefY),
            behavior: 'smooth',
          });
        }}
      >
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
  const gorunumTipi = widgetGorunumTipiAl(widget);
  const slaytlar = kh.slaytlar.filter((s) => s.aktif && s.arkaPlanUrl?.trim());
  const [aktif, setAktif] = useState(0);
  const sureMs = Math.max(2000, (kh.gecisSuresiSn ?? 6) * 1000);
  const yarimKapakOrta = gorunumTipi === 'vetahsilat-yarim-kapak' && kh.gorunum.yukseklik === '70vh';
  // Orta kompakt, geniş ise içerik sayfasındaki önceki dengeli kapak ölçüsündedir.
  // Tam ekran seçeneği kendi mevcut yüksekliğini korur.
  const yukseklik = gorunumTipi === 'vetahsilat-yarim-kapak'
    ? yarimKapakOrta
      ? 'clamp(14rem, 21vw, 17rem)'
      : kh.gorunum.yukseklik === '85vh'
        ? 'clamp(19rem, 27vw, 23rem)'
        : 'clamp(22rem, 34vw, 29rem)'
    : gorunumTipi === 'vetahsilat-klasik'
      ? 'calc(100svh - 2rem)'
      : kh.gorunum.yukseklik;
  // Şeffaf header kendi alanını kapakta işgal etmez. Opaque header ile aynı
  // toplam kapak yüksekliğini korumak için bu alanı hero'ya ekliyoruz.
  // Üst iletişim bandı + ana menü, sınırlarla birlikte canlı sitede 120px yer kaplar.
  const headerYuksekligi = kh.ustBantGoster ? '10rem' : '4.5rem';
  const headerOverlayEtkin = kh.headerOverlay && !onizleme;
  // Telafi yalnızca yarım kapakta gerekir. Klasik tam ekran kendi viewport
  // yüksekliğini yönetir; burada ek alan verilmesi onu gereksiz uzatır.
  const yarimKapakHeaderTelafisi = headerOverlayEtkin && gorunumTipi === 'vetahsilat-yarim-kapak';
  const heroYuksekligi = yarimKapakHeaderTelafisi ? `calc(${yukseklik} + ${headerYuksekligi})` : yukseklik;

  useEffect(() => {
    setAktif(0);
  }, [slaytlar.length, widget.id]);

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
      <section className="kurumsal-hero kurumsal-hero--bos" style={{ minHeight: heroYuksekligi }}>
        <div className="kurumsal-hero-bos-icerik">
          <p className="text-sm text-white/80">Kurumsal hero slaytları admin panelden eklenebilir.</p>
        </div>
      </section>
    );
  }

  const slayt = slaytlar[aktif];
  const overlayRenk = kh.gorunum.overlayRenk ?? '#1e40af';
  // Eski kayıtlardaki renk katmanı görseli maviye boyuyordu. Katman artık
  // yalnızca yönetici özellikle açarsa uygulanır; aksi hâlde görsel özgün kalır.
  const overlayOpaklik = kh.gorunum.overlayEtkin ? (kh.gorunum.overlayOpaklik ?? 0.72) : 0;
  const hex = overlayRenk.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) || 30;
  const g = parseInt(hex.slice(2, 4), 16) || 64;
  const b = parseInt(hex.slice(4, 6), 16) || 175;
  const sol = `rgba(${r},${g},${b},${overlayOpaklik})`;
  const orta = `rgba(${r},${g},${b},${overlayOpaklik * 0.82})`;
  const saydam = `rgba(${r},${g},${b},${overlayOpaklik * 0.38})`;
  const overlayGradient = (() => {
    switch (gorunumTipi) {
      case 'vetahsilat-yarim-kapak':
        return `linear-gradient(105deg, ${sol} 0%, ${orta} 50%, ${saydam} 100%)`;
      case 'vetahsilat-acik':
        return `radial-gradient(circle at 50% 45%, ${saydam} 0%, ${orta} 52%, ${sol} 100%)`;
      case 'vetahsilat-mor':
        return `linear-gradient(270deg, ${sol} 0%, ${orta} 43%, ${saydam} 100%)`;
      case 'vetahsilat-yesil':
        return `linear-gradient(0deg, ${sol} 0%, ${orta} 42%, ${saydam} 100%)`;
      case 'vetahsilat-lavanta':
        return `linear-gradient(90deg, ${sol} 0%, ${orta} 46%, ${saydam} 100%)`;
      default:
        return `linear-gradient(105deg, ${sol} 0%, rgba(${r},${g},${b},${overlayOpaklik * 0.92}) 50%, rgba(${r},${g},${b},${overlayOpaklik * 0.75}) 100%)`;
    }
  })();

  return (
    <section
      className={`kurumsal-hero kurumsal-hero--${gorunumTipi}${yarimKapakOrta ? ' kurumsal-hero--yarim-kapak-orta' : ''}${headerOverlayEtkin ? ' kurumsal-hero--overlay' : ''}`}
      style={{ minHeight: heroYuksekligi, '--kurumsal-hero-header-yuksekligi': headerYuksekligi } as CSSProperties}
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
