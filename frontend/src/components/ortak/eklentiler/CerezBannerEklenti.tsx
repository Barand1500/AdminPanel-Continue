import { useEffect, useState } from 'react';

const ANAHTAR = 'sp-cerez-onay';

export function CerezBannerEklenti() {
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setGoster(localStorage.getItem(ANAHTAR) !== '1');
  }, []);

  if (!goster) return null;

  function kabul() {
    localStorage.setItem(ANAHTAR, '1');
    setGoster(false);
  }

  return (
    <div className="sp-eklenti-cerez" role="dialog" aria-label="Çerez bildirimi">
      <div className="sp-eklenti-cerez-icerik">
        <p>
          Bu site deneyiminizi iyileştirmek için çerezler kullanır. Siteyi kullanmaya devam ederek çerez
          politikamızı kabul etmiş olursunuz.
        </p>
        <button type="button" className="sp-eklenti-cerez-btn" onClick={kabul}>
          Kabul Et
        </button>
      </div>
    </div>
  );
}
