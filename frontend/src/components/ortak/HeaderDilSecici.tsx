import { useEffect, useRef, useState } from 'react';
import type { DilDestegiAyarlari, SiteDilKaydi } from '@/types/header';
import { aktifDiller, SITE_DIL_STORAGE } from '@/data/siteDilleri';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { dilBayrakGorselUrl } from '@/utils/dilBayrak';

function DilBayrak({ dil }: { dil: SiteDilKaydi }) {
  const url = dilBayrakGorselUrl(dil);
  if (url) {
    return (
      <img
        className="header-dil-bayrak-gorsel"
        src={url}
        srcSet={`${dilBayrakGorselUrl(dil, 80) ?? url} 2x`}
        alt=""
        width={20}
        height={14}
      />
    );
  }
  return (
    <span className="header-dil-bayrak" aria-hidden>
      {dil.bayrak || dil.kod}
    </span>
  );
}

interface HeaderDilSeciciProps {
  ayar: DilDestegiAyarlari;
  className?: string;
  /** Tüm dilleri yan yana bayrak olarak göster (kurumsal üst bant) */
  satir?: boolean;
}

export function HeaderDilSecici({ ayar, className = '', satir = false }: HeaderDilSeciciProps) {
  const diller = aktifDiller(ayar);
  const { dilKodu, dilAyarla } = useSiteDil();
  const [acik, setAcik] = useState(false);
  const kutuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function disari(e: MouseEvent) {
      if (kutuRef.current && !kutuRef.current.contains(e.target as Node)) setAcik(false);
    }
    document.addEventListener('mousedown', disari);
    return () => document.removeEventListener('mousedown', disari);
  }, []);

  if (!ayar.aktif || diller.length === 0) return null;

  const gecerliKod = diller.some((d) => d.kod === dilKodu) ? dilKodu : diller[0]?.kod ?? ayar.varsayilanDil;
  const aktifDil = diller.find((d) => d.kod === gecerliKod) ?? diller[0];
  const bayrakli = ayar.gorunum === 'bayrak';

  function dilSec(kod: string) {
    dilAyarla(kod);
    localStorage.setItem(SITE_DIL_STORAGE, kod);
    setAcik(false);
    window.dispatchEvent(new CustomEvent('site-dil-degisti', { detail: kod }));
  }

  if (satir && bayrakli) {
    return (
      <div className={`header-dil-satir ${className}`.trim()} role="listbox" aria-label="Dil seçimi">
        {diller.map((d) => (
          <button
            key={d.kod}
            type="button"
            role="option"
            aria-selected={d.kod === gecerliKod}
            title={d.ad}
            className={`header-dil-satir-oge${d.kod === gecerliKod ? ' header-dil-satir-oge-aktif' : ''}`}
            onClick={() => dilSec(d.kod)}
          >
            <DilBayrak dil={d} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={kutuRef} className={`header-dil-secici ${className}`}>
      <button
        type="button"
        className="header-dil-tetik"
        onClick={() => setAcik((a) => !a)}
        aria-expanded={acik}
        aria-haspopup="listbox"
      >
        <span className="header-dil-globe" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
          </svg>
        </span>
        {bayrakli && <DilBayrak dil={aktifDil} />}
        <span className="header-dil-kod">{aktifDil.kod}</span>
      </button>

      {acik && (
        <ul className={`header-dil-liste ${bayrakli ? 'header-dil-liste-bayrak' : 'header-dil-liste-kod'}`} role="listbox">
          {diller.map((d) => (
            <li key={d.kod}>
              <button
                type="button"
                role="option"
                aria-selected={d.kod === gecerliKod}
                className={d.kod === gecerliKod ? 'header-dil-oge-aktif' : ''}
                onClick={() => dilSec(d.kod)}
              >
                {bayrakli ? (
                  <>
                    <DilBayrak dil={d} />
                    <span>{d.kod}</span>
                  </>
                ) : (
                  d.kod
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
