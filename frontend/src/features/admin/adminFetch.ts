import { tokenAl } from '@/features/auth/authApi';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export function adminHeaders(json = true): HeadersInit {
  const token = tokenAl();
  if (!token) throw new Error('Oturum bulunamadi');
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

export async function adminJsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const yanit = await fetch(`${API_URL}/admin${path}`, init);
  const veri = await yanit.json();
  if (!yanit.ok) {
    const hatalar = veri.hatalar as Record<string, string[] | undefined> | undefined;
    const detay = hatalar
      ? Object.entries(hatalar)
          .flatMap(([alan, liste]) => (liste ?? []).map((m) => `${alan}: ${m}`))
          .join(' · ')
      : '';
    throw new Error(detay ? `${veri.mesaj ?? 'Islem basarisiz'} (${detay})` : (veri.mesaj ?? 'Islem basarisiz'));
  }
  return veri as T;
}
