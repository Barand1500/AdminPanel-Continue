import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { KonumluSliderConfig, KonumluSliderKayit } from '@/types/konumluSlider';
import { medyaTamUrl } from '@/features/admin/medyaApi';

interface KonumluSliderRenderProps {
  slider: KonumluSliderKayit;
  sinif?: string;
}

function slaytlarSirali(config: KonumluSliderConfig) {
  return [...config.slaytlar]
    .filter((s) => s.aktif && s.gorselUrl)
    .sort((a, b) => a.sira - b.sira);
}

export function KonumluSliderRender({ slider, sinif = '' }: KonumluSliderRenderProps) {
  const config = slider.configJson;
  const [aktifIdx, setAktifIdx] = useState(0);

  const slaytlar = config ? slaytlarSirali(config) : [];
  const gorunum = config?.gorunum;
  const yon = config?.yon ?? 'dikey';

  const sonraki = useCallback(() => {
    if (slaytlar.length <= 1) return;
    setAktifIdx((i) => (i + 1) % slaytlar.length);
  }, [slaytlar.length]);

  useEffect(() => {
    if (slaytlar.length <= 1) return;
    const t = window.setInterval(sonraki, 6000);
    return () => window.clearInterval(t);
  }, [slaytlar.length, sonraki]);

  if (!slider.aktif || !config || slaytlar.length === 0) return null;

  const aktifSlayt = slaytlar[aktifIdx] ?? slaytlar[0];
  const stil: CSSProperties = {
    borderRadius: gorunum?.borderRadius ?? 12,
    backgroundColor: gorunum?.arkaplanTransparan
      ? 'transparent'
      : gorunum?.arkaplanRengi ?? 'rgba(15,23,42,0.04)',
  };

  const kirpmaSinif =
    gorunum?.gorselKirpma === 'sigdir'
      ? 'ks-gorsel--sigdir'
      : gorunum?.gorselKirpma === 'orijinal'
        ? 'ks-gorsel--orijinal'
        : 'ks-gorsel--kapla';

  const zSinif = gorunum?.zIndex === 'ust' ? 'ks-z--ust' : 'ks-z--alt';

  return (
    <div
      className={`ks-slider ks-yon--${yon} ${zSinif} ${sinif}`.trim()}
      style={stil}
      data-slider-id={slider.id}
    >
      <div className="ks-slider-icerik">
        {slaytlar.map((s, i) => (
          <div
            key={s.id}
            className={`ks-slayt ${i === aktifIdx ? 'ks-slayt--aktif' : ''}`}
            aria-hidden={i !== aktifIdx}
          >
            <img
              src={medyaTamUrl(s.gorselUrl)}
              alt={s.baslik ?? aktifSlayt.baslik ?? slider.ad}
              className={`ks-gorsel ${kirpmaSinif}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {(s.baslik || s.altBaslik) && (
              <div className="ks-slayt-metin">
                {s.baslik && <p className="ks-slayt-baslik">{s.baslik}</p>}
                {s.altBaslik && <p className="ks-slayt-alt">{s.altBaslik}</p>}
              </div>
            )}
            {gorunum?.butonGoster && s.butonMetni && s.butonLink && (
              <div className={`ks-buton-wrap ks-buton--${gorunum.butonKonumu}`}>
                <Link to={s.butonLink} className="ks-buton">
                  {s.butonMetni}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {slaytlar.length > 1 && (
        <>
          <button type="button" className="ks-nav ks-nav--once" onClick={sonraki} aria-label="Sonraki">
            ‹
          </button>
          <button
            type="button"
            className="ks-nav ks-nav--sonra"
            onClick={() => setAktifIdx((i) => (i - 1 + slaytlar.length) % slaytlar.length)}
            aria-label="Önceki"
          >
            ›
          </button>
          <div className="ks-noktalar">
            {slaytlar.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`ks-nokta ${i === aktifIdx ? 'ks-nokta--aktif' : ''}`}
                onClick={() => setAktifIdx(i)}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
