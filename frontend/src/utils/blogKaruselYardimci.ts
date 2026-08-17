import type { BlogYazisiOzet } from '@/types/blog';
import { blogOnizlemeListesi, blogTarihFormatla } from '@/types/blog';
import type { Widget } from '@/types/site';
import type { WidgetBlogKart, WidgetConfig } from '@/types/widget';
import { configOkuFromWidget } from '@/components/widget/widgetKabuk';

function slugTemizle(ham: string): string {
  return ham
    .toLowerCase()
    .replace(/^\/blog\//, '')
    .replace(/^#+$/, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function kartSlug(kart: WidgetBlogKart): string {
  const linkSlug = kart.link ? slugTemizle(kart.link) : '';
  if (linkSlug) return linkSlug;
  const baslikSlug = slugTemizle(kart.baslik);
  if (baslikSlug) return baslikSlug;
  return kart.id;
}

export function blogKarttanOzet(kart: WidgetBlogKart): BlogYazisiOzet {
  return {
    id: kart.id,
    baslik: kart.baslik,
    slug: kartSlug(kart),
    ozet: kart.ozet ?? null,
    kapakGorsel: kart.gorselUrl || null,
    kategori: kart.kategori ?? null,
    oneCikan: false,
    olusturma: new Date().toISOString(),
  };
}

function blogKaruselWidgetBul(widgetlar: Widget[]): Widget | undefined {
  return widgetlar.find((w) => w.tip === 'BLOG_KARUSEL' && w.aktif);
}

function karuselKartlari(widgetlar: Widget[]): WidgetBlogKart[] {
  const widget = blogKaruselWidgetBul(widgetlar);
  if (!widget) return [];
  const cfg = configOkuFromWidget(widget);
  return cfg.blogKartlari ?? [];
}

/** Site genelinde gösterilecek blog yazıları — önce API, yoksa karusel kartları */
export function siteBlogYazilariHazirla(
  bloglar: BlogYazisiOzet[],
  widgetlar: Widget[],
): BlogYazisiOzet[] {
  if (bloglar.length > 0) return bloglar;

  const kartlar = karuselKartlari(widgetlar).filter((k) => k.baslik?.trim());
  if (kartlar.length === 0) return [];

  return kartlar.map(blogKarttanOzet);
}

export function blogYazisindanKart(yazi: BlogYazisiOzet): WidgetBlogKart {
  return {
    id: yazi.id,
    baslik: yazi.baslik,
    gorselUrl: yazi.kapakGorsel ?? '',
    link: `/blog/${yazi.slug}`,
    butonMetni: 'Devamını Oku',
    tarih: blogTarihFormatla(yazi.olusturma),
    kategori: yazi.kategori ?? undefined,
    ozet: yazi.ozet ?? undefined,
  };
}

export function blogKaruselKartlariHazirla(
  bloglar: BlogYazisiOzet[],
  widgetlar: Widget[],
  cfg: WidgetConfig,
  secenekler?: { onizleme?: boolean },
): WidgetBlogKart[] {
  const adet = Math.max(1, Math.min(cfg.blogAdet ?? 6, 12));
  const manuelKaynak = cfg.blogKaynagi === 'manuel';
  const manuel = (cfg.blogKartlari ?? []).filter((k) => k.baslik?.trim());

  if (manuelKaynak && manuel.length > 0) {
    return manuel;
  }

  const yaziListesi = siteBlogYazilariHazirla(bloglar, widgetlar);
  if (yaziListesi.length > 0) {
    return blogOnizlemeListesi(yaziListesi, adet).map(blogYazisindanKart);
  }

  if (secenekler?.onizleme && manuel.length > 0) {
    return manuel;
  }

  return [];
}
