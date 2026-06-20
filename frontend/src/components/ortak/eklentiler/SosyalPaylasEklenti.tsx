import { useState } from 'react';

export function SosyalPaylasEklenti() {
  const [acik, setAcik] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const baslik = typeof document !== 'undefined' ? document.title : '';

  async function linkKopyala() {
    try {
      await navigator.clipboard.writeText(url);
      setMesaj('Link kopyalandı');
    } catch {
      setMesaj('Kopyalanamadı');
    }
    window.setTimeout(() => setMesaj(null), 2000);
  }

  async function nativePaylas() {
    if (navigator.share) {
      try {
        await navigator.share({ title: baslik, url });
        setAcik(false);
      } catch {
        /* kullanıcı iptal etti */
      }
      return;
    }
    setAcik((v) => !v);
  }

  return (
    <div className="sp-eklenti-paylas">
      <button
        type="button"
        className="sp-eklenti-paylas-tetik"
        aria-label="Sayfayı paylaş"
        aria-expanded={acik}
        onClick={() => void nativePaylas()}
      >
        ↗
      </button>
      {acik && (
        <div className="sp-eklenti-paylas-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => void linkKopyala()}>
            Link kopyala
          </button>
          <a
            role="menuitem"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(baslik)}`}
            target="_blank"
            rel="noreferrer"
          >
            X (Twitter)
          </a>
          <a
            role="menuitem"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            role="menuitem"
            href={`https://wa.me/?text=${encodeURIComponent(`${baslik} ${url}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      )}
      {mesaj && <span className="sp-eklenti-paylas-toast">{mesaj}</span>}
    </div>
  );
}
