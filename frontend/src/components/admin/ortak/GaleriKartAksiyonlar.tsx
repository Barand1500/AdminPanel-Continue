import { useEffect, type MouseEvent, type ReactNode } from 'react';

function GozIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function InfoIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.2V16.5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GaleriKartAksiyonlar({
  ad,
  aciklama,
  infoAcik,
  onInfo,
  onOnizle,
}: {
  ad: string;
  aciklama: string;
  infoAcik: boolean;
  onInfo: () => void;
  onOnizle: () => void;
}) {
  return (
    <span className="ap-widget-galeri-aksiyonlar">
      <button
        type="button"
        className="ap-widget-galeri-goz"
        aria-label={`${ad} önizle`}
        title="Önizle"
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onOnizle();
        }}
      >
        <GozIkon />
      </button>
      <button
        type="button"
        className={`ap-widget-galeri-info${infoAcik ? ' ap-widget-galeri-info--acik' : ''}`}
        aria-label={`${ad} nedir?`}
        aria-expanded={infoAcik}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onInfo();
        }}
      >
        <InfoIkon />
        <span className="ap-widget-galeri-info-kutu" role="tooltip">
          {aciklama}
        </span>
      </button>
    </span>
  );
}

export function GaleriOnizlemeKabugu({
  acik,
  baslik,
  alt,
  onKapat,
  modalSinif,
  children,
}: {
  acik: boolean;
  baslik: string;
  alt: string;
  onKapat: () => void;
  modalSinif?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!acik) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onKapat();
      }
    }
    document.addEventListener('keydown', tus);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = '';
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="galeri-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className={`ap-admin-modal ap-admin-modal-genis ${modalSinif ?? ''}`.trim()}>
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="galeri-onizleme-baslik" className="ap-admin-modal-baslik">
              {baslik}
            </h2>
            <p className="ap-admin-modal-alt">{alt}</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
