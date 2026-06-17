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

function slugTemizle(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

function publicSayfaDonustur(veri: PublicSayfa): PublicSayfa {
  return { ...veri, id: String(veri.id) };
}

async function siteVerisindenSayfaBul(temiz: string, signal?: AbortSignal): Promise<PublicSayfa | null> {
  try {
    const yanit = await fetch(`${API_URL}/site?site=${encodeURIComponent(SITE_SLUG)}`, { signal });
    if (!yanit.ok) return null;
    const veri = (await yanit.json()) as { sayfalar?: PublicSayfa[] };
    const sayfa = veri.sayfalar?.find((s) => {
      const kayit = s as PublicSayfa & { yayinda?: boolean };
      return slugTemizle(s.slug) === temiz && kayit.yayinda !== false;
    });
    return sayfa ? publicSayfaDonustur(sayfa) : null;
  } catch {
    return null;
  }
}

export async function sayfaDetayGetir(slug: string, signal?: AbortSignal): Promise<PublicSayfa | null> {
  const temiz = slugTemizle(slug);
  if (!temiz) return null;

  const segmentYolu = temiz
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');

  const denemeler = [
    `${API_URL}/sayfalar/${segmentYolu}?site=${encodeURIComponent(SITE_SLUG)}`,
    `${API_URL}/sayfalar/detay?slug=${encodeURIComponent(temiz)}&site=${encodeURIComponent(SITE_SLUG)}`,
  ];

  for (const url of denemeler) {
    try {
      const yanit = await fetch(url, { signal });
      if (yanit.ok) {
        return publicSayfaDonustur((await yanit.json()) as PublicSayfa);
      }
    } catch {
      // sonraki yonteme gec
    }
  }

  return siteVerisindenSayfaBul(temiz, signal);
}
