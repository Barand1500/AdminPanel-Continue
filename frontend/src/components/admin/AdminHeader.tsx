import { useEffect, useRef, useState } from 'react';
import { useSistemKesifOptional } from '@/contexts/SistemKesifContext';
import { AdminProfilModal } from '@/components/admin/ortak/AdminProfilModal';
import { BaslatMenu } from './BaslatMenu';
import { UstSekmeCubugu } from './UstSekmeCubugu';
import type { AdminModul, AdminSekme } from '@/types/admin';

interface AdminHeaderProps {
  sekmeler: AdminSekme[]; aktifSekmeId: string; onSekmeSec: (id: string) => void; onSekmeKapat: (id: string) => void;
  onSekmeTasi: (kaynakId: string, hedefId: string, mod: 'once' | 'sonra') => void; onSekmeBirlestir: (kaynakId: string, hedefId: string) => void;
  onModulSec: (modul: AdminModul) => void; onSekmeAyir?: (sekmeId: string) => void; baslatMenuAcik?: boolean; onBaslatMenuAcikDegistir?: (acik: boolean) => void;
}

export function AdminHeader({ sekmeler, aktifSekmeId, onSekmeSec, onSekmeKapat, onSekmeTasi, onSekmeBirlestir, onModulSec, onSekmeAyir, baslatMenuAcik: disBaslatMenuAcik, onBaslatMenuAcikDegistir }: AdminHeaderProps) {
  const kesif = useSistemKesifOptional();
  const [menuAcikIc, setMenuAcikIc] = useState(false);
  const [profilAcik, setProfilAcik] = useState(false);
  const baslatBtnRef = useRef<HTMLButtonElement>(null);
  const menuAcik = disBaslatMenuAcik ?? menuAcikIc;
  const menuAcikDegistir = onBaslatMenuAcikDegistir ?? setMenuAcikIc;

  useEffect(() => {
    kesif?.baslatMenuKaydet(() => menuAcikDegistir(true), () => menuAcikDegistir(false));
  }, [kesif, menuAcikDegistir]);

  return <>
    <header className={`ap-header flex h-12 shrink-0 items-stretch border-b${menuAcik ? ' ap-header--baslat-acik' : ''}`}>
      <button ref={baslatBtnRef} type="button" onClick={() => menuAcikDegistir(!menuAcik)} className={`ap-baslat-menu-btn ap-baslat-menu-btn--dikdortgen relative flex w-14 shrink-0 items-center justify-center ${menuAcik ? 'ap-baslat-menu-btn--dikdortgen-aktif ap-baslat-menu-btn--kenarlik-aktif' : 'border-r border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'}`} title="Başlat menüsü" data-ap-kesif="baslat-menu" aria-expanded={menuAcik}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>
      </button>
      <UstSekmeCubugu sekmeler={sekmeler} aktifSekmeId={aktifSekmeId} onSekmeSec={onSekmeSec} onSekmeKapat={onSekmeKapat} onSekmeTasi={onSekmeTasi} onSekmeBirlestir={onSekmeBirlestir} onSekmeAyir={onSekmeAyir} onModulSec={onModulSec} baslatMenuAcik={menuAcik} />
      <div className="ml-auto flex shrink-0 items-center self-stretch border-l border-[var(--ap-border)] px-4"><AdminSiteOnizleLink /></div>
    </header>
    <AdminProfilModal acik={profilAcik} onKapat={() => setProfilAcik(false)} />
    <BaslatMenu acik={menuAcik} onKapat={() => menuAcikDegistir(false)} onModulSec={onModulSec} baslatButonRef={baslatBtnRef} onProfilAc={() => setProfilAcik(true)} />
  </>;
}

export function AdminSiteOnizleLink() {
  return <a href="/" target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline" data-ap-kesif="site-onizle">Siteyi Önizle →</a>;
}
