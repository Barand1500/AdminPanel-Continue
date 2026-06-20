import { useEffect, useState } from 'react';

const ANAHTAR = 'sp-yazi-olcek';
const MIN = 90;
const MAX = 130;
const STEP = 10;

export function YaziBuyutucuEklenti() {
  const [olcek, setOlcek] = useState(() => {
    const kayitli = Number(localStorage.getItem(ANAHTAR) || 100);
    return Number.isFinite(kayitli) ? Math.min(MAX, Math.max(MIN, kayitli)) : 100;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${olcek}%`;
    localStorage.setItem(ANAHTAR, String(olcek));
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [olcek]);

  return (
    <div className="sp-eklenti-yazi" role="group" aria-label="Yazı boyutu">
      <button type="button" aria-label="Yazıyı küçült" onClick={() => setOlcek((o) => Math.max(MIN, o - STEP))}>
        A−
      </button>
      <button type="button" aria-label="Varsayılan boyut" onClick={() => setOlcek(100)}>
        A
      </button>
      <button type="button" aria-label="Yazıyı büyüt" onClick={() => setOlcek((o) => Math.min(MAX, o + STEP))}>
        A+
      </button>
    </div>
  );
}
