import { useEffect, useCallback } from 'react';

export interface RehberKart {
  baslik: string;
  aciklama: string;
  ikon?: string;
  renk: 'mor' | 'turuncu' | 'mavi' | 'sari' | 'yesil' | 'camgobegi';
}

interface AdminRehberModalProps {
  acik: boolean;
  onKapat: () => void;
  baslik: string;
  altBaslik: string;
  bolumBaslik: string;
  kartlar: RehberKart[];
  ipucu?: string;
}

export function AdminRehberModal({
  acik,
  onKapat,
  baslik,
  altBaslik,
  bolumBaslik,
  kartlar,
  ipucu,
}: AdminRehberModalProps) {
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
    <div className="ap-rehber-overlay" role="dialog" aria-modal="true" aria-labelledby="rehber-baslik">
      <div className="ap-rehber-backdrop" aria-hidden="true" />
      <div className="ap-rehber-modal">
        <header className="ap-rehber-header">
          <div className="ap-rehber-header-sol">
            <span className="ap-rehber-ikon">?</span>
            <div>
              <h2 id="rehber-baslik" className="ap-rehber-baslik">
                {baslik}
              </h2>
              <p className="ap-rehber-alt">{altBaslik}</p>
            </div>
          </div>
          <button type="button" className="ap-rehber-kapat" onClick={kapat}>
            ✕ ESC
          </button>
        </header>

        <div className="ap-scroll ap-rehber-icerik">
          <h3 className="ap-rehber-bolum">
            <span className="ap-rehber-bolum-cizgi" />
            {bolumBaslik}
          </h3>

          <div className="space-y-3">
            {kartlar.map((kart) => (
              <article key={kart.baslik} className={`ap-rehber-kart ap-rehber-kart-${kart.renk}`}>
                <h4 className="ap-rehber-kart-baslik">
                  {kart.ikon && <span className="mr-1">{kart.ikon}</span>}
                  {kart.baslik}
                </h4>
                <p className="ap-rehber-kart-metin">{kart.aciklama}</p>
              </article>
            ))}
          </div>

          {ipucu && (
            <div className="ap-rehber-ipucu">
              <span>💡</span>
              <p>
                <strong>İpucu:</strong> {ipucu}
              </p>
            </div>
          )}
        </div>

        <footer className="ap-rehber-footer">
          <p className="ap-rehber-kisayol">
            <kbd className="ap-rehber-kbd">ESC</kbd> veya ✕ ile kapat
          </p>
          <button type="button" className="ap-rehber-tamam" onClick={kapat}>
            Anladım ✓
          </button>
        </footer>
      </div>
    </div>
  );
}

export function RehberAcButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="ap-tray-ikon" title="Rehber (F1)" aria-label="Rehber">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M9.75 9.6a2.25 2.25 0 014.28.85c0 1.5-2.15 1.75-2.15 3.15" />
        <circle cx="12" cy="16.55" r="0.85" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
