import { useEffect, useRef, useState, type CSSProperties } from 'react';
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

  const altOgeler = oge.altOgeler ?? [];

  return (
    <div
      ref={wrapRef}
      className={`site-menu-dropdown ${className} ${acik ? 'site-menu-dropdown-acik' : ''}`}
      onMouseEnter={() => setAcik(true)}
      onMouseLeave={() => setAcik(false)}
    >
      <button
        type="button"
        className={`site-menu-dropdown-tetik ${linkClassName}`}
        style={style}
        aria-expanded={acik}
        aria-haspopup="true"
        onClick={() => setAcik((a) => !a)}
      >
        <span>{oge.baslik}</span>
        <svg
          viewBox="0 0 20 20"
          className="site-menu-dropdown-ok"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {acik && altOgeler.length > 0 && (
        <div className="site-menu-dropdown-panel" role="menu">
          {altOgeler.map((alt) => (
            <MenuNavLink
              key={alt.yol}
              oge={alt}
              className="site-menu-dropdown-alt-link"
              onClick={() => {
                onClick?.();
                setAcik(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
