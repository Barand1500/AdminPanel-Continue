import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { MenuOgesi } from '@/types/site';
import { MenuNavLink, MenuOgeMetin } from './MenuNavLink';

interface MenuDropdownProps {
  oge: MenuOgesi;
  className: string;
  linkClassName: string;
  style?: CSSProperties;
  onClick?: () => void;
}

interface MenuIcGrupProps {
  oge: MenuOgesi;
  onClick?: () => void;
  mobil?: boolean;
}

export function MenuDropdown({ oge, className, linkClassName, style, onClick }: MenuDropdownProps) {
  const [acik, setAcik] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const kapatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const altOgeler = oge.altOgeler ?? [];
  const hoverMod = oge.altMenuTetikleyici !== 'tikla';
  const yatay = oge.altMenuGorunum === 'yatay';
  const icerikVar = oge.icerikVar === true;
  const tiklaModu = !hoverMod;

  useEffect(() => {
    return () => {
      if (kapatTimerRef.current) clearTimeout(kapatTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!acik || !tiklaModu) return;
    function disariTikla(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [acik, tiklaModu]);

  function panelAc() {
    if (!hoverMod || altOgeler.length === 0) return;
    if (kapatTimerRef.current) {
      clearTimeout(kapatTimerRef.current);
      kapatTimerRef.current = null;
    }
    setAcik(true);
  }

  function panelKapatGecikmeli() {
    if (!hoverMod) return;
    if (kapatTimerRef.current) clearTimeout(kapatTimerRef.current);
    kapatTimerRef.current = setTimeout(() => setAcik(false), 160);
  }

  function panelKapat() {
    if (kapatTimerRef.current) {
      clearTimeout(kapatTimerRef.current);
      kapatTimerRef.current = null;
    }
    setAcik(false);
  }

  function tetikTikla(e: ReactMouseEvent<HTMLButtonElement>) {
    if (hoverMod || altOgeler.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    setAcik((v) => !v);
  }

  const mobil = className.includes('mobil');
  const tetikSinif = `site-menu-dropdown-tetik ${linkClassName} ${acik ? 'site-menu-dropdown-tetik-acik' : ''}`;
  const panelGorunur = acik && altOgeler.length > 0;
  const panelGoster = altOgeler.length > 0 && (!mobil || panelGorunur);

  const tetikIcerik = (
    <>
      <MenuOgeMetin oge={oge} />
      {altOgeler.length > 0 && <MenuOkAsagi acik={acik} />}
    </>
  );

  return (
    <div
      ref={wrapRef}
      className={`site-menu-dropdown ${className} ${acik ? 'site-menu-dropdown-acik' : ''} ${yatay ? 'site-menu-dropdown-yatay' : ''} ${hoverMod ? 'site-menu-dropdown-hover' : 'site-menu-dropdown-tikla'}`}
      onMouseEnter={panelAc}
      onMouseLeave={panelKapatGecikmeli}
    >
      {hoverMod && icerikVar ? (
        <Link
          to={oge.yol}
          className={tetikSinif}
          style={style}
          onClick={() => {
            onClick?.();
            panelKapat();
          }}
        >
          {tetikIcerik}
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
          {tetikIcerik}
        </button>
      )}

      {panelGoster && (
        <div
          className={`site-menu-dropdown-panel ${yatay ? 'site-menu-dropdown-panel-yatay' : ''} ${panelGorunur ? 'site-menu-dropdown-panel-acik' : ''}`}
          role="menu"
          onMouseEnter={panelAc}
          onMouseLeave={panelKapatGecikmeli}
        >
          <div className="site-menu-dropdown-panel-icerik">
            {tiklaModu && icerikVar && (
              <>
                <MenuNavLink
                  oge={oge}
                  className="site-menu-dropdown-ust-link"
                  onClick={() => {
                    onClick?.();
                    panelKapat();
                  }}
                />
                <div className="site-menu-dropdown-ayrac" />
              </>
            )}
            {altOgeler.map((alt) =>
              alt.altOgeler && alt.altOgeler.length > 0 ? (
                <MenuIcGrup key={alt.yol} oge={alt} onClick={onClick} mobil={mobil} />
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
        </div>
      )}
    </div>
  );
}

function MenuIcGrup({ oge, onClick, mobil = false }: MenuIcGrupProps) {
  const [acik, setAcik] = useState(false);
  const kapatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const altOgeler = oge.altOgeler ?? [];
  const hoverMod = !mobil && oge.altMenuTetikleyici !== 'tikla';
  const tiklaModu = !hoverMod;
  const icerikVar = oge.icerikVar === true;

  useEffect(() => {
    return () => {
      if (kapatTimerRef.current) clearTimeout(kapatTimerRef.current);
    };
  }, []);

  function grupAc() {
    if (!hoverMod) return;
    if (kapatTimerRef.current) {
      clearTimeout(kapatTimerRef.current);
      kapatTimerRef.current = null;
    }
    setAcik(true);
  }

  function grupKapatGecikmeli() {
    if (!hoverMod) return;
    if (kapatTimerRef.current) clearTimeout(kapatTimerRef.current);
    kapatTimerRef.current = setTimeout(() => setAcik(false), 160);
  }

  function tetikTikla(e: ReactMouseEvent<HTMLButtonElement>) {
    if (hoverMod) return;
    e.preventDefault();
    e.stopPropagation();
    setAcik((v) => !v);
  }

  const tetikSinif = `site-menu-ic-grup-tetik site-menu-dropdown-alt-link ${acik ? 'site-menu-ic-grup-tetik-acik' : ''}`;
  const tetikIcerik = (
    <>
      <MenuOgeMetin oge={oge} />
      {mobil ? <MenuOkAsagi acik={acik} /> : <MenuOkSaga />}
    </>
  );

  const altListe = (
    <>
      {tiklaModu && icerikVar && (
        <MenuNavLink oge={oge} className="site-menu-dropdown-alt-link site-menu-ic-grup-ust-link" onClick={onClick} />
      )}
      {altOgeler.map((alt) =>
        alt.altOgeler && alt.altOgeler.length > 0 ? (
          <MenuIcGrup key={alt.yol} oge={alt} onClick={onClick} mobil={mobil} />
        ) : (
          <MenuNavLink key={alt.yol} oge={alt} className="site-menu-dropdown-alt-link" onClick={onClick} />
        )
      )}
    </>
  );

  return (
    <div
      className={`site-menu-ic-grup ${acik ? 'site-menu-ic-grup-acik' : ''} ${mobil ? 'site-menu-ic-grup-mobil' : ''} ${hoverMod ? 'site-menu-ic-grup-hover' : 'site-menu-ic-grup-tikla'}`}
      onMouseEnter={grupAc}
      onMouseLeave={grupKapatGecikmeli}
    >
      {hoverMod && icerikVar ? (
        <Link
          to={oge.yol}
          className={tetikSinif}
          onClick={() => {
            onClick?.();
          }}
        >
          {tetikIcerik}
        </Link>
      ) : (
        <button
          type="button"
          className={tetikSinif}
          aria-expanded={acik}
          aria-haspopup="true"
          onClick={tetikTikla}
        >
          {tetikIcerik}
        </button>
      )}

      {acik && altOgeler.length > 0 && (
        mobil ? (
          <div className="site-menu-ic-grup-alt-liste" role="menu">
            {altListe}
          </div>
        ) : (
          <div
            className="site-menu-ic-grup-flyout"
            role="menu"
            onMouseEnter={grupAc}
            onMouseLeave={grupKapatGecikmeli}
          >
            <div className="site-menu-dropdown-panel-icerik">{altListe}</div>
          </div>
        )
      )}
    </div>
  );
}

function MenuOkAsagi({ acik }: { acik: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`site-menu-dropdown-ok site-menu-dropdown-ok-asagi ${acik ? 'site-menu-dropdown-ok-acik' : ''}`}
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuOkSaga() {
  return (
    <svg viewBox="0 0 20 20" className="site-menu-dropdown-ok site-menu-dropdown-ok-saga" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
