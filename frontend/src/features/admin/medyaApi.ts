import { adminHeaders, adminJsonFetch } from './adminFetch';
import { tokenAl } from '@/features/auth/authApi';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface AdminMedya {
  id: string;
  ad: string;
  url: string;
  tip: string;
  boyut?: number | null;
  olusturma: string;
}

export async function adminMedyalariGetir(): Promise<AdminMedya[]> {
  const veri = await adminJsonFetch<{ medyalar: AdminMedya[] }>('/medya', { headers: adminHeaders() });
  return veri.medyalar;
}

export async function adminMedyaOlustur(ad: string, url: string): Promise<AdminMedya> {
  const veri = await adminJsonFetch<{ medya: AdminMedya }>('/medya', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ ad, url, tip: 'GORSEL' }),
  });
  return veri.medya;
}

export async function adminMedyaYukle(dosya: File, ad?: string): Promise<AdminMedya> {
  const token = tokenAl();
  if (!token) throw new Error('Oturum bulunamadi');

  const formData = new FormData();
  formData.append('dosya', dosya);
  if (ad) formData.append('ad', ad);

  const yanit = await fetch(`${API_URL}/admin/medya/yukle`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Dosya yuklenemedi');
  return veri.medya as AdminMedya;
}

export async function adminMedyaSil(id: string): Promise<void> {
  await adminJsonFetch(`/medya/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function adminMedyaTopluSil(ids: string[]): Promise<void> {
  await adminJsonFetch(`/medya`, {
    method: 'DELETE',
    headers: adminHeaders(),
    body: JSON.stringify({ ids }),
  });
}

export function medyaTamUrl(url: string): string {
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const apiBase = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/api$/, '');
  return `${apiBase}${url}`;
}
