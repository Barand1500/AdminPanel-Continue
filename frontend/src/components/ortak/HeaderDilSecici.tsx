import { useEffect, useRef, useState } from 'react';
import type { DilDestegiAyarlari } from '@/types/header';
import { aktifDiller, SITE_DIL_STORAGE } from '@/data/siteDilleri';

interface HeaderDilSeciciProps {
  ayar: DilDestegiAyarlari;
  className?: string;
}

export function HeaderDilSecici({ ayar, className = '' }: HeaderDilSeciciProps) {
  const diller = aktifDiller(ayar);
  const [acik, setAcik] = useState(false);
  const [secili, setSecili] = useState(ayar.varsayilanDil);
  const kutuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kayitli = localStorage.getItem(SITE_DIL_STORAGE);
    if (kayitli) setSecili(kayitli);
    else setSecili(ayar.varsayilanDil);
  }, [ayar.varsayilanDil]);

  useEffect(() => {
    function disari(e: MouseEvent) {
      if (kutuRef.current && !kutuRef.current.contains(e.target as Node)) setAcik(false);
    }
    document.addEventListener('mousedown', disari);
    return () => document.removeEventListener('mousedown', disari);
  }, []);

  if (!ayar.aktif || diller.length === 0) return null;

  const gecerliKod = diller.some((d) => d.kod === secili) ? secili : diller[0].kod;
  const aktifDil = diller.find((d) => d.kod === gecerliKod) ?? diller[0];
  const bayrakli = ayar.gorunum === 'bayrak';

  function dilSec(kod: string) {
    setSecili(kod);
    localStorage.setItem(SITE_DIL_STORAGE, kod);
    setAcik(false);
    window.dispatchEvent(new CustomEvent('site-dil-degisti', { detail: kod }));
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
        {bayrakli && <span className="header-dil-bayrak">{aktifDil.bayrak}</span>}
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
                    <span className="header-dil-bayrak">{d.bayrak}</span>
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
