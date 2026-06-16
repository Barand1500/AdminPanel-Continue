import { config } from '../config/env.js';
import { SayfaRepository } from '../Infrastructure/repositories/SayfaRepository.js';
import { SiteRepository } from '../Infrastructure/repositories/SiteRepository.js';
import { WidgetRepository } from '../Infrastructure/repositories/WidgetRepository.js';
import { BlogRepository } from '../Infrastructure/repositories/BlogRepository.js';

const siteRepo = new SiteRepository();
const sayfaRepo = new SayfaRepository();
const widgetRepo = new WidgetRepository();
const blogRepo = new BlogRepository();

export class SiteService {
  async getSitePublicData(siteSlug?: string) {
    const slug = siteSlug ?? config.defaultSiteSlug;
    const site = await siteRepo.findBySlug(slug);

    if (!site) {
      return null;
    }

    const [sayfalar, widgetlar, bloglar] = await Promise.all([
      sayfaRepo.findBySiteId(site.id),
      widgetRepo.findBySiteId(site.id),
      blogRepo.findPublicBySiteId(site.id),
    ]);

    return {
      site: {
        id: site.id,
        ad: site.ad,
        slug: site.slug,
        ayarlar: site.siteAyarlari,
      },
      sayfalar,
      widgetlar,
      urunler: [],
      bloglar: bloglar.map((b) => ({
        ...b,
        olusturma: b.olusturma.toISOString(),
      })),
    };
  }

  async getSayfaBySlug(siteSlug: string, sayfaSlug: string) {
    const site = await siteRepo.findBySlug(siteSlug);
    if (!site) return null;

    return sayfaRepo.findBySlug(site.id, sayfaSlug);
  }
}
