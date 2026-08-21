import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import {
  IconApps,
  IconBolt,
  IconBuilding,
  IconNotes,
  IconSettings,
  IconUsersGroup,
} from '@tabler/icons-react';
import { modulAra, adminKategoriler, adminModulleri } from '@/data/adminMenuYapisi';
import { usePanelDil } from '@/contexts/PanelDilContext';
import type { AdminModul } from '@/types/admin';
import { BaslatMenuArama } from './BaslatMenuArama';
import { BaslatMenuKenarlikAnimasyon } from './BaslatMenuKenarlikAnimasyon';
import { AdminModulIkonu } from './AdminModulIkonu';

const KATEGORI_IKON: Record<string, string> = {
  'Hızlı Erişim': '⚡',
  'Site Yönetimi': '🏠',
  'İçerik Yönetimi': '📝',
  'Müşteri / Ajans': '👥',
  Sistem: '⚙️',
};

const KATEGORI_FLAT_IKONLARI = {
  'Hızlı Erişim': IconBolt,
  'Site Yönetimi': IconBuilding,
  'İçerik Yönetimi': IconNotes,
  'Müşteri / Ajans': IconUsersGroup,
  Sistem: IconSettings,
} as const;

interface BaslatMenuProps {
  acik: boolean;
  onKapat: () => void;
  onModulSec: (modul: AdminModul) => void;
  baslatButonRef?: RefObject<HTMLButtonElement | null>;
}

export function BaslatMenu({ acik, onKapat, onModulSec, baslatButonRef }: BaslatMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [dockStil, setDockStil] = useState<CSSProperties>();
  const dockAktif = Boolean(baslatButonRef);

  useLayoutEffect(() => {
    if (!acik || !dockAktif || !baslatButonRef?.current) {
      setDockStil(undefined);
      return;
    }

    const guncelle = () => {
      const btn = baslatButonRef.current?.getBoundingClientRect();
      if (!btn) return;
      setDockStil({ left: btn.left, top: btn.bottom - 1 });
    };

    guncelle();
    const raf = requestAnimationFrame(guncelle);
    window.addEventListener('resize', guncelle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', guncelle);
    };
  }, [acik, dockAktif, baslatButonRef]);

  if (!acik) return null;

  const kenarlikAnim = dockAktif && acik;

  return (
    <>
      <div className="ap-baslat-overlay fixed inset-0 z-40 bg-black/25" onClick={onKapat} />
      <BaslatMenuIcerik
        menuRef={menuRef}
        onModulSec={onModulSec}
        onKapat={onKapat}
        kenarlikAnim={kenarlikAnim}
        dockStil={kenarlikAnim ? dockStil : undefined}
      />
      {kenarlikAnim && baslatButonRef && (
        <BaslatMenuKenarlikAnimasyon butonRef={baslatButonRef} menuRef={menuRef} />
      )}
    </>
  );
}

function BaslatMenuIcerik({
  menuRef,
  onModulSec,
  onKapat,
  kenarlikAnim,
  dockStil,
}: {
  menuRef: RefObject<HTMLDivElement | null>;
  onModulSec: (modul: AdminModul) => void;
  onKapat: () => void;
  kenarlikAnim: boolean;
  dockStil?: CSSProperties;
}) {
  const [arama, setArama] = useState('');
  const { t } = usePanelDil();
  const sonuclar = modulAra(arama);

  const dockSinif = [
    'ap-baslat-menu-dock fixed z-50 flex max-h-[calc(100vh-3rem)] w-[min(440px,92vw)] flex-col overflow-hidden border border-[var(--ap-border)] bg-[var(--ap-surface)] shadow-2xl',
    kenarlikAnim ? 'ap-baslat-menu-dock--kenarlik-anim ap-baslat-menu-dock--bagli' : 'left-0 top-12 border-l-0',
  ].join(' ');

  return (
    <div ref={menuRef} className={dockSinif} style={dockStil}>
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
  const KategoriIkonu = kategori
    ? KATEGORI_FLAT_IKONLARI[kategori as keyof typeof KATEGORI_FLAT_IKONLARI] ?? IconApps
    : null;

  if (moduller.length === 0) return null;

  return (
    <div className="ap-menu-kategori">
      <p className="ap-menu-kategori-baslik">
        {KategoriIkonu && (
          <span className="ap-menu-kategori-ikon">
            <KategoriIkonu size={14} stroke={1.9} aria-hidden="true" />
          </span>
        )}
        {kategori && <span>{KATEGORI_IKON[kategori] ?? '•'}</span>}
        {baslik}
      </p>
      <ul className="space-y-0.5">
        {moduller.map((modul) => (
          <li key={modul.id}>
            <button type="button" onClick={() => onSec(modul)} className="ap-menu-oge">
              <span className="ap-menu-oge-ikon">
                <AdminModulIkonu modulId={modul.id} />
              </span>
              <span className="font-medium">{t(`modul.${modul.id}`, modul.baslik)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
