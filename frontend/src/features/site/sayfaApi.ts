const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const SITE_SLUG = import.meta.env.VITE_SITE_SLUG ?? 'demo';

import type { SayfaAcilisModu } from '@/types/site';

export interface PublicSayfa {
  id: string;
  baslik: string;
  slug: string;
  icerik: string;
  kapakGorsel?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  acilisModu?: SayfaAcilisModu;
}

export async function sayfaDetayGetir(slug: string, signal?: AbortSignal): Promise<PublicSayfa | null> {
  try {
    const yanit = await fetch(
      `${API_URL}/sayfalar/${encodeURIComponent(slug)}?site=${encodeURIComponent(SITE_SLUG)}`,
      { signal }
    );
    if (!yanit.ok) return null;
    const veri = (await yanit.json()) as PublicSayfa;
    return { ...veri, id: String(veri.id) };
  } catch {
    return null;
  }
}
