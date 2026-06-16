import { useEffect } from 'react';
import { FormAlani } from './FormAlani';
import { SITE_FONTLARI, fontGoogleUrl } from '@/data/siteFontlari';

interface FontSeciciProps {
  deger: string;
  onChange: (font: string) => void;
}

export function FontSecici({ deger, onChange }: FontSeciciProps) {
  useEffect(() => {
    const id = 'gt-admin-font-onizleme';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const aileler = SITE_FONTLARI.map((f) => `family=${f.google}:wght@400;600;700`).join('&');
    link.href = `https://fonts.googleapis.com/css2?${aileler}&display=swap`;
  }, []);

  return (
    <FormAlani etiket="Yazi Tipi" aciklama="Her secenek kendi fontuyla gosterilir">
      <div className="ap-font-grid">
        {SITE_FONTLARI.map((font) => {
          const secili = deger === font.ad;
          return (
            <button
              key={font.ad}
              type="button"
              onClick={() => onChange(font.ad)}
              className={`ap-font-kart ${secili ? 'ap-font-kart-secili' : ''}`}
              style={{ fontFamily: `"${font.aile}", sans-serif` }}
            >
              <span className="ap-font-kart-ornek">Aa Bb Cc</span>
              <span className="ap-font-kart-ad" style={{ fontFamily: `"${font.aile}", sans-serif` }}>
                {font.ad}
              </span>
              {secili && (
                <span className="ap-font-kart-tik">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </FormAlani>
  );
}

export { fontGoogleUrl };
