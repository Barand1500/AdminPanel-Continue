import { useEffect, useRef, useState } from 'react';
import { modulAra } from '@/data/adminMenuYapisi';
import { usePanelDil } from '@/contexts/PanelDilContext';
import type { AdminModul } from '@/types/admin';
import { useAksiyonCubuguPanelSync } from './aksiyon-cubugu/AksiyonCubuguPanelContext';
import { AdminModulIkonu } from './AdminModulIkonu';

interface CubukModulAramaProps {
  onModulSec: (modul: AdminModul) => void;
}

/** Alt aksiyon çubuğu için, sonuçlarını çubuğun üstünde gösteren modül araması. */
export function CubukModulArama({ onModulSec }: CubukModulAramaProps) {
  const { t } = usePanelDil();
  const [acik, setAcik] = useState(false);
  const [arama, setArama] = useState('');
  const kapsayiciRef = useRef<HTMLDivElement>(null);
  const oneriRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sonuclar = modulAra(arama).slice(0, 8);
  const oneriAcik = acik && arama.trim().length > 0;

  useAksiyonCubuguPanelSync(oneriAcik, oneriRef);

  useEffect(() => {
    if (!acik) return;
    const disariTikla = (event: MouseEvent) => {
      if (!kapsayiciRef.current?.contains(event.target as Node)) {
        setAcik(false);
        setArama('');
      }
    };
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [acik]);

  function acKapat() {
    setAcik((onceki) => {
      const yeni = !onceki;
      if (yeni) window.setTimeout(() => inputRef.current?.focus(), 0);
      else setArama('');
      return yeni;
    });
  }

  return (
    <div ref={kapsayiciRef} className={`ap-cubuk-arama${acik ? ' ap-cubuk-arama--acik' : ''}`}>
      <div className={`ap-cubuk-arama-birim${oneriAcik ? ' ap-cubuk-arama-birim--oneri ap-cubuk-arama-birim--kenarlik-anim' : ''}`}>
        {oneriAcik && (
          <div ref={oneriRef} className="ap-cubuk-arama-oneri ap-cubuk-arama-oneri--kenarlik-anim" role="listbox" aria-label="Modül önerileri">
            {sonuclar.length === 0 ? (
              <p className="ap-muted px-3 py-2 text-xs">Sonuç bulunamadı</p>
            ) : (
              <ul className="ap-cubuk-arama-sonuc-listesi">
                {sonuclar.map((modul) => (
                  <li key={modul.id}>
                    <button
                      type="button"
                      className="ap-cubuk-arama-sonuc"
                      role="option"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onModulSec(modul);
                        setArama('');
                        setAcik(false);
                      }}
                    >
                      <span className="ap-cubuk-arama-modul-ikon"><AdminModulIkonu modulId={modul.id} boyut={16} /></span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-medium">{t(`modul.${modul.id}`, modul.baslik)}</span>
                        <span className="ap-muted block truncate text-[10px]">{modul.kategori}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="ap-cubuk-arama-grup">
          <div className="ap-cubuk-arama-input-sarm">
            <input
              ref={inputRef}
              type="search"
              value={arama}
              onChange={(event) => setArama(event.target.value)}
              placeholder="Modül veya ayar ara..."
              className="ap-cubuk-arama-input"
              aria-label="Modül veya ayar ara"
              tabIndex={acik ? 0 : -1}
            />
          </div>
          <button type="button" className={`ap-tray-ikon ap-cubuk-arama-btn${acik ? ' ap-tray-ikon-aktif' : ''}`} onClick={acKapat} title="Modül ara" aria-label="Modül ara" aria-expanded={acik}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
