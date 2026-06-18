import type { SitePublicData } from '@/types/site';
import { bosSiteVerisi } from '@/data/bosSiteVerisi';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const SITE_SLUG = import.meta.env.VITE_SITE_SLUG ?? 'demo';

export async function siteVerisiGetir(signal?: AbortSignal): Promise<SitePublicData> {
  try {
    const yanit = await fetch(`${API_URL}/site?site=${SITE_SLUG}`, { signal });
    if (!yanit.ok) return bosSiteVerisi;
    const veri = (await yanit.json()) as SitePublicData;
    return {
      ...bosSiteVerisi,
      ...veri,
      site: { ...bosSiteVerisi.site, ...veri.site },
      sayfalar: veri.sayfalar ?? [],
      widgetlar: veri.widgetlar ?? [],
      urunler: veri.urunler ?? [],
      bloglar: veri.bloglar ?? [],
      navKategoriler: (veri.navKategoriler ?? []).map((k) => ({
        ...k,
        id: String(k.id),
        ustKategoriId: k.ustKategoriId != null ? String(k.ustKategoriId) : null,
      })),
    };
  } catch {
    return bosSiteVerisi;
  }
}
