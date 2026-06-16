import { adminHeaders, adminJsonFetch } from './adminFetch';
import type { KurTipi } from '@/types/header';

export interface TcmbOnizleYanit {
  var: boolean;
  kur?: number;
  mesaj: string;
}

export async function tcmbKurOnizle(kod: string, kurTipi: KurTipi): Promise<TcmbOnizleYanit> {
  const params = new URLSearchParams({ kod, kurTipi });
  return adminJsonFetch<TcmbOnizleYanit>(`/kur/tcmb-onizle?${params}`, {
    headers: adminHeaders(),
  });
}
