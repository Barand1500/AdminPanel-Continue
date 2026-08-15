import { useCallback, useEffect } from 'react';
import { SeoSerpOnizleme } from '@/components/admin/seo/SeoBilesenleri';

interface SeoOnizlemeModalProps {
  acik: boolean;
  baslik: string;
  aciklama: string;
  url: string;
  onKapat: () => void;
}

export function SeoOnizlemeModal({ acik, baslik, aciklama, url, onKapat }: SeoOnizlemeModalProps) {
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
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="seo-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={kapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-seo-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="seo-onizleme-baslik" className="ap-admin-modal-baslik">
              SEO önizleme
            </h2>
            <p className="ap-admin-modal-alt">Google arama sonucunda nasıl görüneceği</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={kapat}>
            ✕ ESC
          </button>
        </header>
        <div className="ap-seo-oniz-govde">
          <SeoSerpOnizleme baslik={baslik} aciklama={aciklama} url={url} />
        </div>
      </div>
    </div>
  );
}
