import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { MenuOgesi } from '@/types/site';
import { MenuNavLink } from './MenuNavLink';

interface MenuDropdownProps {
  oge: MenuOgesi;
  className: string;
  linkClassName: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function MenuDropdown({ oge, className, linkClassName, style, onClick }: MenuDropdownProps) {
  const [acik, setAcik] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const altOgeler = oge.altOgeler ?? [];
  const hoverMod = oge.altMenuTetikleyici !== 'tikla';
  const yatay = oge.altMenuGorunum === 'yatay';
  const icerikVar = oge.icerikVar === true;

  useEffect(() => {
    if (!acik) return;
    function disariTikla(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [acik]);

  function panelAc() {
    if (altOgeler.length > 0) setAcik(true);
  }

  function panelKapat() {
    setAcik(false);
  }

  function tetikTikla() {
    if (altOgeler.length === 0) return;
    if (hoverMod) return;
    setAcik((a) => !a);
  }

  const tetikSinif = `site-menu-dropdown-tetik ${linkClassName} ${acik ? 'site-menu-dropdown-tetik-acik' : ''}`;

  return (
    <div
      ref={wrapRef}
      className={`site-menu-dropdown ${className} ${acik ? 'site-menu-dropdown-acik' : ''} ${yatay ? 'site-menu-dropdown-yatay' : ''} ${hoverMod ? 'site-menu-dropdown-hover' : 'site-menu-dropdown-tikla'}`}
      onMouseEnter={hoverMod ? panelAc : undefined}
      onMouseLeave={hoverMod ? panelKapat : undefined}
    >
      {icerikVar ? (
        <Link
          to={oge.yol}
          className={tetikSinif}
          style={style}
          onClick={() => {
            onClick?.();
            panelKapat();
          }}
        >
          <span>{oge.baslik}</span>
          {altOgeler.length > 0 && <MenuOk />}
        </Link>
      ) : (
        <button
          type="button"
          className={tetikSinif}
          style={style}
          aria-expanded={acik}
          aria-haspopup="true"
          onClick={tetikTikla}
        >
          <span>{oge.baslik}</span>
          {altOgeler.length > 0 && <MenuOk />}
        </button>
      )}

      {acik && altOgeler.length > 0 && (
        <div
          className={`site-menu-dropdown-panel ${yatay ? 'site-menu-dropdown-panel-yatay' : ''}`}
          role="menu"
        >
          {altOgeler.map((alt) =>
            alt.altOgeler && alt.altOgeler.length > 0 ? (
              <div key={alt.yol} className="site-menu-dropdown-ic-oge">
                <MenuDropdown
                  oge={alt}
                  className="site-menu-dropdown-ic"
                  linkClassName="site-menu-dropdown-alt-link"
                  onClick={onClick}
                />
              </div>
            ) : (
              <MenuNavLink
                key={alt.yol}
                oge={alt}
                className="site-menu-dropdown-alt-link"
                onClick={() => {
                  onClick?.();
                  panelKapat();
                }}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function MenuOk() {
  return (
    <svg viewBox="0 0 20 20" className="site-menu-dropdown-ok" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
