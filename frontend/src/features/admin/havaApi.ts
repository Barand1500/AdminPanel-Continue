import { adminHeaders, adminJsonFetch } from './adminFetch';
import type { HavaDurumuYanit } from '@/features/site/havaApi';

export async function havaOnizleGetir(sehir: string, ilce?: string): Promise<HavaDurumuYanit> {
  const params = new URLSearchParams({ sehir });
  if (ilce?.trim()) params.set('ilce', ilce.trim());
  return adminJsonFetch<HavaDurumuYanit>(`/hava-onizle?${params}`, {
    headers: adminHeaders(),
  });
}
