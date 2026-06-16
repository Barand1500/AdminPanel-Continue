import { useEffect, useRef, useState } from 'react';

interface GorevCubuguTrayProps {
  onYedekle: () => void;
  onLoglar: () => void;
  onTamEkranYedekle?: () => void;
  onTamEkranLoglar?: () => void;
}

function TrayIkon({
  etiket,
  acik,
  onToggle,
  children,
  panel,
}: {
  etiket: string;
  acik: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  panel: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acik) return;
    function disariTikla(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [acik, onToggle]);

  return (
    <div ref={ref} className="ap-tray-ikon-wrap relative">
      <button
        type="button"
        onClick={onToggle}
        className={`ap-tray-ikon ${acik ? 'ap-tray-ikon-aktif' : ''}`}
        title={etiket}
        aria-label={etiket}
      >
        {children}
      </button>
      {acik && <div className="ap-tray-panel">{panel}</div>}
    </div>
  );
}

export function GorevCubuguTray({
  onYedekle,
  onLoglar,
  onTamEkranYedekle,
  onTamEkranLoglar,
}: GorevCubuguTrayProps) {
  const [yedekAcik, setYedekAcik] = useState(false);
  const [logAcik, setLogAcik] = useState(false);

  return (
    <div className="ap-tray-grup flex items-center gap-1">
      <TrayIkon
        etiket="Veri Yedekleme"
        acik={yedekAcik}
        onToggle={() => {
          setLogAcik(false);
          setYedekAcik((a) => !a);
        }}
        panel={
          <>
            <p className="ap-heading text-sm font-semibold">Veri Yedekleme</p>
            <p className="ap-muted mt-1 text-xs">Site verilerinizin yedeğini alın veya geri yükleyin.</p>
            <div className="mt-3 flex flex-col gap-2">
              <button type="button" className="ap-tray-panel-btn" onClick={() => { onYedekle(); setYedekAcik(false); }}>
                Hızlı işlem
              </button>
              {onTamEkranYedekle && (
                <button type="button" className="ap-tray-panel-btn-ikincil" onClick={() => { onTamEkranYedekle(); setYedekAcik(false); }}>
                  Tam ekrana git
                </button>
              )}
            </div>
          </>
        }
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
      </TrayIkon>

      <TrayIkon
        etiket="Log Takibi"
        acik={logAcik}
        onToggle={() => {
          setYedekAcik(false);
          setLogAcik((a) => !a);
        }}
        panel={
          <>
            <p className="ap-heading text-sm font-semibold">Log Takibi</p>
            <p className="ap-muted mt-1 text-xs">Panelde yapılan işlemlerin geçmişini görüntüleyin.</p>
            <div className="mt-3 flex flex-col gap-2">
              <button type="button" className="ap-tray-panel-btn" onClick={() => { onLoglar(); setLogAcik(false); }}>
                Son kayıtlar
              </button>
              {onTamEkranLoglar && (
                <button type="button" className="ap-tray-panel-btn-ikincil" onClick={() => { onTamEkranLoglar(); setLogAcik(false); }}>
                  Tam ekrana git
                </button>
              )}
            </div>
          </>
        }
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </TrayIkon>
    </div>
  );
}
