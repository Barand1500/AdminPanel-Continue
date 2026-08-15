import { useCallback, useEffect } from 'react';
import { TemaOnizlemePaneli } from './TemaOnizlemePaneli';
import type { GeceSablonId } from '@/types/temaAyarlari';

interface TemaOnizlemeModalProps {
  acik: boolean;
  siteAd: string;
  anaRenk: string;
  ikincilRenk: string;
  geceSablon: GeceSablonId;
  font?: string;
  onKapat: () => void;
}

export function TemaOnizlemeModal({
  acik,
  siteAd,
  anaRenk,
  ikincilRenk,
  geceSablon,
  font,
  onKapat,
}: TemaOnizlemeModalProps) {
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

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tema-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop ap-tema-onizleme-backdrop" aria-label="Kapat" onClick={kapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-tema-onizleme-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="tema-onizleme-baslik" className="ap-admin-modal-baslik">
              Tema Önizleme
            </h2>
            <p className="ap-admin-modal-alt">Gündüz ve gece paleti — kaydedilmemiş renkler de yansır</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={kapat}>
            ✕ ESC
          </button>
        </header>
        <div className="ap-scroll ap-admin-modal-icerik">
          <TemaOnizlemePaneli
            siteAd={siteAd}
            anaRenk={anaRenk}
            ikincilRenk={ikincilRenk}
            geceSablon={geceSablon}
            font={font}
          />
        </div>
      </div>
    </div>
  );
}
