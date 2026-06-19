import { useMemo } from 'react';
import type { SitePublicData } from '@/types/site';
import type { AktifEklentiPublic } from '@/types/eklenti';

export function useAktifEklentiler(veri: SitePublicData) {
  return useMemo(() => veri.aktifEklentiler ?? [], [veri.aktifEklentiler]);
}

export function eklentiAktifMi(aktifler: AktifEklentiPublic[], kod: string) {
  return aktifler.some((e) => e.kod === kod);
}

export function eklentiAyarBul(aktifler: AktifEklentiPublic[], kod: string) {
  return aktifler.find((e) => e.kod === kod)?.ayarlarJson ?? {};
}
