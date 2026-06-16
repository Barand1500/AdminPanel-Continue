import { adminHeaders, adminJsonFetch } from './adminFetch';
import type { SistemAyarlariForm } from '@/types/sistemAyarlari';

export type { SistemAyarlariForm };

export interface SistemAyarlariYanit {
  site: {
    id: string;
    ad: string;
    slug: string;
    domain: string | null;
    aktif: boolean;
  };
  sistem: Partial<SistemAyarlariForm>;
  surum: string;
}

export async function sistemAyarlariGetir(): Promise<SistemAyarlariYanit> {
  return adminJsonFetch<SistemAyarlariYanit>('/sistem-ayarlari', { headers: adminHeaders() });
}

export async function sistemAyarlariGuncelle(form: SistemAyarlariForm): Promise<SistemAyarlariYanit> {
  return adminJsonFetch<SistemAyarlariYanit>('/sistem-ayarlari', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(form),
  });
}
