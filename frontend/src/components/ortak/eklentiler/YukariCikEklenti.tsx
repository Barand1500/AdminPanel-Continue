import { useEffect, useState } from 'react';

export function YukariCikEklenti() {
  const [gorunur, setGorunur] = useState(false);

  useEffect(() => {
    function scrollDinle() {
      setGorunur(window.scrollY > 320);
    }
    scrollDinle();
    window.addEventListener('scroll', scrollDinle, { passive: true });
    return () => window.removeEventListener('scroll', scrollDinle);
  }, []);

  if (!gorunur) return null;

  return (
    <button
      type="button"
      className="sp-eklenti-yukari-cik"
      aria-label="Yukarı çık"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  );
}
