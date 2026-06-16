import { tokenAl } from '@/features/auth/authApi';
import type { SiteAyarlari } from '@/types/site';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface AdminSiteBilgi {
  id: string;
  ad: string;
  slug: string;
}

export interface AdminSiteAyarlariYanit {
  site: AdminSiteBilgi;
  ayarlar: SiteAyarlari | null;
}

export type SiteAyarlariGuncellePayload = Partial<
  SiteAyarlari & { siteAd: string }
>;

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = tokenAl();
  if (!token) throw new Error('Oturum gerekli');

  const yanit = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

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

export const adminSiteApi = {
  ayarlariGetir: () => adminFetch<AdminSiteAyarlariYanit>('/site/ayarlar'),

  ayarlariGuncelle: (payload: SiteAyarlariGuncellePayload) =>
    adminFetch<AdminSiteAyarlariYanit>('/site/ayarlar', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};
