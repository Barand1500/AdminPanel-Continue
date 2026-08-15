import { useState } from 'react';
import { HizliErisimAyarlariModal } from '@/components/admin/ortak/HizliErisimAyarlariModal';
import type { AdminModul } from '@/types/admin';

export function DashboardHizliErisim({
  moduller,
  onModulAc,
}: {
  moduller: AdminModul[];
  onModulAc: (modulId: string) => void;
}) {
  const [acik, setAcik] = useState(false);

  return (
    <section className="ap-home-panel" data-ap-kesif="dash-hizli-erisim">
      <div className="ap-home-panel-baslik">
        <h2>Hızlı erişim</h2>
        <button type="button" className="ap-home-ayar" onClick={() => setAcik(true)} title="Modülleri düzenle">
          Düzenle
        </button>
      </div>
      {moduller.length === 0 ? (
        <p className="ap-home-bos">Modül eklemek için Düzenle’ye tıklayın.</p>
      ) : (
        <div className="ap-home-moduller">
          {moduller.map((modul) => (
            <button key={modul.id} type="button" className="ap-home-modul" onClick={() => onModulAc(modul.id)}>
              <span className="ap-home-modul-ikon" aria-hidden>
                {modul.ikon}
              </span>
              <span className="ap-home-modul-ad">{modul.baslik}</span>
            </button>
          ))}
        </div>
      )}
      <HizliErisimAyarlariModal acik={acik} onKapat={() => setAcik(false)} />
    </section>
  );
}
