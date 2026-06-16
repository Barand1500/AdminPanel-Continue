import { useState } from 'react';
import { modulAra, adminKategoriler, adminModulleri } from '@/data/adminMenuYapisi';
import { usePanelDil } from '@/contexts/PanelDilContext';
import type { AdminModul } from '@/types/admin';
import { BaslatMenuArama } from './BaslatMenuArama';

const KATEGORI_IKON: Record<string, string> = {
  'Hızlı Erişim': '⚡',
  'Site Yönetimi': '🏠',
  'İçerik Yönetimi': '📝',
  'Müşteri / Ajans': '👥',
  Sistem: '⚙️',
};

interface BaslatMenuProps {
  acik: boolean;
  onKapat: () => void;
  onModulSec: (modul: AdminModul) => void;
}

export function BaslatMenu({ acik, onKapat, onModulSec }: BaslatMenuProps) {
  if (!acik) return null;

  return (
    <>
      <div className="ap-baslat-overlay fixed inset-0 z-40 bg-black/25" onClick={onKapat} />
      <BaslatMenuIcerik onModulSec={onModulSec} onKapat={onKapat} />
    </>
  );
}

function BaslatMenuIcerik({
  onModulSec,
  onKapat,
}: {
  onModulSec: (modul: AdminModul) => void;
  onKapat: () => void;
}) {
  const [arama, setArama] = useState('');
  const { t } = usePanelDil();
  const sonuclar = modulAra(arama);

  return (
    <div className="ap-baslat-menu-dock fixed left-0 top-12 z-50 flex max-h-[calc(100vh-3rem)] w-[min(440px,92vw)] flex-col overflow-hidden border border-[var(--ap-border)] border-l-0 bg-[var(--ap-surface)] shadow-2xl">
      <div className="border-b border-[var(--ap-border)] bg-[var(--ap-header-bg)] px-3 py-2">
        <p className="ap-heading text-xs font-bold">{t('header.baslatMenu', 'Başlat Menüsü')}</p>
        <p className="ap-muted text-[10px]">{t('header.modulAra', 'Modül veya ayar ara')}</p>
      </div>

      <BaslatMenuArama deger={arama} onDegistir={setArama} />

      <div className="ap-scroll flex-1 overflow-y-auto p-2">
        {arama ? (
          <ModulListesi
            baslik={`Arama: "${arama}"`}
            kategori=""
            moduller={sonuclar}
            onSec={(m) => {
              onModulSec(m);
              onKapat();
            }}
          />
        ) : (
          adminKategoriler.map((kategori) => (
            <ModulListesi
              key={kategori}
              baslik={t(`kategori.${kategori}`, kategori)}
              kategori={kategori}
              moduller={adminModulleri.filter((m) => m.kategori === kategori)}
              onSec={(m) => {
                onModulSec(m);
                onKapat();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ModulListesi({
  baslik,
  kategori,
  moduller,
  onSec,
}: {
  baslik: string;
  kategori: string;
  moduller: AdminModul[];
  onSec: (modul: AdminModul) => void;
}) {
  const { t } = usePanelDil();
  if (moduller.length === 0) return null;

  return (
    <div className="ap-menu-kategori">
      <p className="ap-menu-kategori-baslik">
        {kategori && <span>{KATEGORI_IKON[kategori] ?? '•'}</span>}
        {baslik}
      </p>
      <ul className="space-y-0.5">
        {moduller.map((modul) => (
          <li key={modul.id}>
            <button type="button" onClick={() => onSec(modul)} className="ap-menu-oge">
              <span className="ap-menu-oge-ikon">{modul.ikon}</span>
              <span className="font-medium">{t(`modul.${modul.id}`, modul.baslik)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
