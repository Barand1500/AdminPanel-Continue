import type { BlogYazisiDetay, BlogYazisiOzet } from '@/types/blog';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const SITE_SLUG = import.meta.env.VITE_SITE_SLUG ?? 'demo';

export async function blogDetayGetir(slug: string, signal?: AbortSignal): Promise<BlogYazisiDetay | null> {
  try {
    const yanit = await fetch(`${API_URL}/blog/${encodeURIComponent(slug)}?site=${SITE_SLUG}`, { signal });
    if (!yanit.ok) return null;
    const veri = (await yanit.json()) as { blog: BlogYazisiDetay };
    return veri.blog;
  } catch {
    return null;
  }
}

export async function blogListesiGetir(signal?: AbortSignal): Promise<BlogYazisiOzet[]> {
  try {
    const yanit = await fetch(`${API_URL}/blog?site=${SITE_SLUG}`, { signal });
    if (!yanit.ok) return [];
    const veri = (await yanit.json()) as { bloglar: BlogYazisiOzet[] };
    return veri.bloglar ?? [];
  } catch {
    return [];
  }
}
