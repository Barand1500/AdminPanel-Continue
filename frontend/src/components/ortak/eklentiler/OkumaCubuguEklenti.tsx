import { useEffect, useState } from 'react';

export function OkumaCubuguEklenti() {
  const [ilerleme, setIlerleme] = useState(0);

  useEffect(() => {
    function guncelle() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const yukseklik = doc.scrollHeight - doc.clientHeight;
      setIlerleme(yukseklik > 0 ? Math.min(100, (scrollTop / yukseklik) * 100) : 0);
    }

    guncelle();
    window.addEventListener('scroll', guncelle, { passive: true });
    window.addEventListener('resize', guncelle);
    return () => {
      window.removeEventListener('scroll', guncelle);
      window.removeEventListener('resize', guncelle);
    };
  }, []);

  return (
    <div className="sp-eklenti-okuma-cubugu" aria-hidden>
      <div className="sp-eklenti-okuma-cubugu-dolgu" style={{ width: `${ilerleme}%` }} />
    </div>
  );
}
