import type { SitePublicData } from '@/types/site';
import { bosSiteVerisi } from '@/data/bosSiteVerisi';
import { jsonYanitOku } from '@/utils/jsonFetch';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const SITE_SLUG = import.meta.env.VITE_SITE_SLUG ?? 'demo';

export async function siteVerisiGetir(signal?: AbortSignal): Promise<SitePublicData> {
  try {
    const yanit = await fetch(`${API_URL}/site?site=${SITE_SLUG}`, { signal });
    if (!yanit.ok) {
      console.error('[siteVerisiGetir] API hatasi:', yanit.status, yanit.statusText);
      return bosSiteVerisi;
    }
    const veri = await jsonYanitOku<SitePublicData>(yanit);
    return {
      ...bosSiteVerisi,
      ...veri,
      site: { ...bosSiteVerisi.site, ...veri.site },
      sayfalar: veri.sayfalar ?? [],
      widgetlar: veri.widgetlar ?? [],
      bloglar: veri.bloglar ?? [],
      navKategoriler: (veri.navKategoriler ?? []).map((k) => ({
        ...k,
        id: String(k.id),
        ustKategoriId: k.ustKategoriId != null ? String(k.ustKategoriId) : null,
      })),
      formlar: (veri.formlar ?? []).map((f) => ({
        ...f,
        id: String(f.id),
        alanlarJson: Array.isArray(f.alanlarJson) ? f.alanlarJson : [],
      })),
      seoYonlendirmeler: veri.seoYonlendirmeler ?? [],
    };
  } catch (err) {
    console.error('[siteVerisiGetir]', err instanceof Error ? err.message : err);
    return bosSiteVerisi;
  }
}
