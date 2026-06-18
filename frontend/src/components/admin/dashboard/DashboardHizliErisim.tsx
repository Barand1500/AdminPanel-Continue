import { useState } from 'react';
import { HizliErisimAyarlariModal } from '@/components/admin/ortak/HizliErisimAyarlariModal';
import type { AdminModul } from '@/types/admin';

export function DashboardHizliErisim({
  moduller,
  onModulAc,
  sade = false,
}: {
  moduller: AdminModul[];
  onModulAc: (modulId: string) => void;
  sade?: boolean;
}) {
  const [acik, setAcik] = useState(false);

  return (
    <section className={sade ? 'ap-dash-sade-hizli' : 'ap-dash-hizli-bolum'}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className={sade ? 'ap-dash-sade-bolum-baslik mb-0' : 'ap-dash-bolum-baslik mb-0'}>
          Hızlı Erişim
        </h2>
        <button
          type="button"
          onClick={() => setAcik(true)}
          className="ap-dash-ayar-btn"
          title="Hızlı erişimi düzenle"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden sm:inline">Düzenle</span>
        </button>
      </div>
      <div className={sade ? 'ap-dash-sade-hizli-grid' : 'ap-dash-hizli-grid'}>
        {moduller.map((modul) => (
          <button
            key={modul.id}
            type="button"
            onClick={() => onModulAc(modul.id)}
            className={sade ? 'ap-dash-sade-hizli-oge' : 'ap-dash-hizli-oge'}
          >
            <span className={sade ? 'ap-dash-sade-hizli-ikon' : 'ap-dash-hizli-ikon'}>{modul.ikon}</span>
            <span className={sade ? 'ap-dash-sade-hizli-baslik' : 'ap-dash-hizli-baslik'}>{modul.baslik}</span>
          </button>
        ))}
      </div>
      <HizliErisimAyarlariModal acik={acik} onKapat={() => setAcik(false)} />
    </section>
  );
}
