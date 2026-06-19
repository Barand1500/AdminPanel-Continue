import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminTema } from '@/contexts/AdminTemaContext';
import { useSistemKesifOptional } from '@/contexts/SistemKesifContext';
import { AdminProfilModal } from '@/components/admin/ortak/AdminProfilModal';
import { BaslatMenu } from './BaslatMenu';
import { UstSekmeCubugu } from './UstSekmeCubugu';
import type { AdminModul, AdminSekme } from '@/types/admin';

interface AdminHeaderProps {
  sekmeler: AdminSekme[];
  aktifSekmeId: string;
  onSekmeSec: (id: string) => void;
  onSekmeKapat: (id: string) => void;
  onSekmeTasi: (kaynakId: string, hedefId: string, mod: 'once' | 'sonra') => void;
  onSekmeBirlestir: (kaynakId: string, hedefId: string) => void;
  onModulSec: (modul: AdminModul) => void;
  onSekmeAyir?: (sekmeId: string) => void;
}

export function AdminHeader({
  sekmeler,
  aktifSekmeId,
  onSekmeSec,
  onSekmeKapat,
  onSekmeTasi,
  onSekmeBirlestir,
  onModulSec,
  onSekmeAyir,
}: AdminHeaderProps) {
  const { kullanici } = useAuth();
  const { temaDegistir, koyuMu } = useAdminTema();
  const kesif = useSistemKesifOptional();
  const [menuAcik, setMenuAcik] = useState(false);
  const [profilAcik, setProfilAcik] = useState(false);

  useEffect(() => {
    kesif?.baslatMenuKaydet(
      () => setMenuAcik(true),
      () => setMenuAcik(false)
    );
  }, [kesif]);

  const basHarf = kullanici?.ad?.charAt(0).toUpperCase() ?? '?';

  return (
    <>
      <header className="ap-header flex h-12 shrink-0 items-stretch border-b">
        <button
          type="button"
          onClick={() => setMenuAcik((a) => !a)}
          className="flex w-14 items-center justify-center border-r border-[var(--ap-border)] hover:bg-[var(--ap-hover)]"
          title="Başlat menüsü"
          data-ap-kesif="baslat-menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </button>

        <UstSekmeCubugu
          sekmeler={sekmeler}
          aktifSekmeId={aktifSekmeId}
          onSekmeSec={onSekmeSec}
          onSekmeKapat={onSekmeKapat}
          onSekmeTasi={onSekmeTasi}
          onSekmeBirlestir={onSekmeBirlestir}
          onSekmeAyir={onSekmeAyir}
          onModulSec={onModulSec}
        />

        <div className="flex items-center gap-3 border-l border-[var(--ap-border)] px-4">
          <button
            type="button"
            onClick={temaDegistir}
            className="rounded-lg border border-[var(--ap-border)] px-2 py-1 text-sm transition hover:bg-[var(--ap-hover)]"
            title={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
          >
            {koyuMu ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            onClick={() => setProfilAcik(true)}
            className="ap-profil-btn"
            title="Profil ayarları"
          >
            <span className="ap-profil-avatar">{basHarf}</span>
            <span className="ap-profil-ad hidden sm:block">{kullanici?.ad ?? 'Profil'}</span>
            <svg viewBox="0 0 20 20" className="ap-profil-ok hidden h-3.5 w-3.5 opacity-60 sm:block" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </header>

      <AdminProfilModal acik={profilAcik} onKapat={() => setProfilAcik(false)} />

      <BaslatMenu
        acik={menuAcik}
        onKapat={() => setMenuAcik(false)}
        onModulSec={onModulSec}
      />
    </>
  );
}

export function AdminSiteOnizleLink() {
  return (
    <Link
      to="/"
      target="_blank"
      className="text-xs text-blue-400 hover:underline"
      data-ap-kesif="site-onizle"
    >
      Siteyi Önizle →
    </Link>
  );
}
