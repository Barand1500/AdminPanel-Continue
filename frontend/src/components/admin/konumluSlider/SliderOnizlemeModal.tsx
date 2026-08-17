import { useCallback, useEffect } from 'react';
import { KonumluSliderRender } from '@/components/konumluSlider/KonumluSliderRender';
import { konumSecimOzeti } from '@/components/admin/konumluSlider/KonumluSliderAyarlarPaneli';
import type { KonumluSliderConfig, KonumluSliderKayit } from '@/types/konumluSlider';

interface SliderOnizlemeModalProps {
  acik: boolean;
  ad: string;
  config: KonumluSliderConfig;
  onKapat: () => void;
}

export function SliderOnizlemeModal({ acik, ad, config, onKapat }: SliderOnizlemeModalProps) {
  const kapat = useCallback(() => onKapat(), [onKapat]);

  useEffect(() => {
    if (!acik) return;

    function tusHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        kapat();
      }
    }

    document.addEventListener('keydown', tusHandler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tusHandler);
      document.body.style.overflow = '';
    };
  }, [acik, kapat]);

  if (!acik) return null;

  const slaytVar = config.slaytlar.some((s) => s.aktif && s.gorselUrl);
  const kayit: KonumluSliderKayit = {
    id: 'onizleme',
    siteId: '',
    sayfaId: null,
    ad: ad.trim() || 'Banner',
    aktif: true,
    sira: 1,
    configJson: config,
  };

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="slider-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={kapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-slider-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="slider-onizleme-baslik" className="ap-admin-modal-baslik">
              Banner önizleme
            </h2>
            <p className="ap-admin-modal-alt">
              {ad.trim() || 'Adsız'} · {konumSecimOzeti(config)} · {config.yon === 'yatay' ? 'Yatay' : 'Dikey'}
            </p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={kapat}>
            ✕ ESC
          </button>
        </header>
        <div className="ap-slider-oniz-govde">
          {slaytVar ? (
            <div className={`ap-slider-oniz-cerceve ap-slider-oniz-cerceve--${config.yon}`}>
              <KonumluSliderRender slider={kayit} />
            </div>
          ) : (
            <p className="ap-slider-oniz-bos">Önizlemek için en az bir aktif slayt görseli ekleyin.</p>
          )}
        </div>
      </div>
    </div>
  );
}
