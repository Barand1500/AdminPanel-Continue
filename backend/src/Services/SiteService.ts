import { config } from '../config/env.js';
import { SayfaRepository } from '../Infrastructure/repositories/SayfaRepository.js';
import { SayfaService } from './SayfaService.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import { SistemAyariRepository } from '../Infrastructure/repositories/SistemAyariRepository.js';
import { WidgetRepository } from '../Infrastructure/repositories/WidgetRepository.js';
import { BlogRepository } from '../Infrastructure/repositories/BlogRepository.js';
import { NavKategoriRepository } from '../Infrastructure/repositories/NavKategoriRepository.js';
import { FormRepository } from '../Infrastructure/repositories/FormRepository.js';
import { SeoYonlendirmeRepository } from '../Infrastructure/repositories/SeoYonlendirmeRepository.js';
import {
  sistemAyariSatirdanJson,
  sistemAyarlariJsonCozKayit,
  varsayilanSistemAyarlari,
} from '../Infrastructure/utils/sistemAyariMapper.js';

const siteRepo = new SiteRepository();
const sayfaRepo = new SayfaRepository();
const sayfaService = new SayfaService();
const widgetRepo = new WidgetRepository();
const blogRepo = new BlogRepository();
const navKategoriRepo = new NavKategoriRepository();
const formRepo = new FormRepository();
const yonlendirmeRepo = new SeoYonlendirmeRepository();
const sistemAyariRepo = new SistemAyariRepository();

function sayfaPublicUrl(slug: string): string {
  if (slug === 'anasayfa' || slug === 'home') return '/';
  return `/${slug}`;
}

function publicSistemAyarlari(
  siteAyarlari: { sistemAyarlariJson?: unknown } | null | undefined,
  sistemSatiri: Record<string, unknown> | null | undefined
) {
  if (sistemSatiri) {
    return sistemAyariSatirdanJson(sistemSatiri);
  }
  if (siteAyarlari?.sistemAyarlariJson && typeof siteAyarlari.sistemAyarlariJson === 'object') {
    return sistemAyarlariJsonCozKayit(siteAyarlari.sistemAyarlariJson as Record<string, unknown>);
  }
  return { ...varsayilanSistemAyarlari };
}

export class SiteService {
  async getSitePublicData(siteSlug?: string) {
    const slug = siteSlug ?? config.defaultSiteSlug;
    const site = await siteRepo.findBySlug(slug);

    if (!site) {
      return null;
    }

    await sayfaService.hiyerarsiOnar(site.id);

    const [sayfalar, widgetlar, bloglar, navKategoriler, formlar, seoYonlendirmeler, sistemSatiri] = await Promise.all([
      sayfaRepo.findBySiteId(site.id),
      widgetRepo.findBySiteId(site.id),
      blogRepo.findPublicBySiteId(site.id),
      navKategoriRepo.findPublicBySiteId(site.id),
      formRepo.findPublicBySiteId(site.id),
      yonlendirmeRepo.findPublicBySiteId(site.id),
      sistemAyariRepo.findBySiteId(site.id),
    ]);

    const sistemAyarlariJson = publicSistemAyarlari(
      site.siteAyarlari,
      sistemSatiri as Record<string, unknown> | null | undefined
    );

    return {
      site: {
        id: site.id,
        ad: site.ad,
        slug: site.slug,
        aktif: site.aktif,
        ayarlar: site.siteAyarlari
          ? {
              ...site.siteAyarlari,
              sistemAyarlariJson,
            }
          : { sistemAyarlariJson },
      },
      sayfalar,
      widgetlar,
      navKategoriler,
      bloglar: bloglar.map((b) => ({
        ...b,
        olusturma: b.olusturma.toISOString(),
      })),
      formlar: formlar.map((f) => ({
        id: String(f.id),
        ad: f.ad,
        slug: f.slug,
        aciklama: f.aciklama,
        alanlarJson: f.alanlarJson,
        ayarlarJson: f.ayarlarJson,
        aktif: f.aktif,
      })),
      seoYonlendirmeler: seoYonlendirmeler
        .map((y) => {
          if (y.hedefTip !== 'sayfa') return null;
          const hedef = sayfalar.find((s) => s.id === y.hedefId);
          if (!hedef) return null;
          return {
            kaynakUrl: y.kaynakUrl,
            hedefUrl: sayfaPublicUrl(hedef.slug),
            kod: y.kod,
          };
        })
        .filter((y): y is { kaynakUrl: string; hedefUrl: string; kod: number } => y != null),
    };
  }

  async getSayfaBySlug(siteSlug: string, sayfaSlug: string) {
    const site = await siteRepo.findBySlug(siteSlug);
    if (!site) return null;

    return sayfaRepo.findBySlug(site.id, sayfaSlug);
  }
}
