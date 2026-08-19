import { useEffect, useState } from 'react';

/** Sayfa biraz kaydırıldığında true döner. */
export function useSayfaKaydirildi(esik = 12): boolean {
  const [kaydi, setKaydi] = useState(false);

  useEffect(() => {
    const guncelle = () => setKaydi(window.scrollY > esik);
    guncelle();
    window.addEventListener('scroll', guncelle, { passive: true });
    return () => window.removeEventListener('scroll', guncelle);
  }, [esik]);

  return kaydi;
}
