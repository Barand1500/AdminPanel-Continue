import type { Request, Response } from 'express';
import { SiteService } from '../../Services/SiteService.js';
import { BlogService } from '../../Services/BlogService.js';
import { SiteRepository } from '../../Infrastructure/repositories/SiteRepository.js';
import { config } from '../../config/env.js';

const siteService = new SiteService();
const blogService = new BlogService();
const siteRepo = new SiteRepository();

async function siteIdFromSlug(siteSlug: string): Promise<number | null> {
  const site = await siteRepo.findBySlug(siteSlug);
  return site?.id ?? null;
}

export class SiteController {
  async getPublicSite(req: Request, res: Response) {
    const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
    const data = await siteService.getSitePublicData(siteSlug);

    if (!data) {
      return res.status(404).json({ mesaj: 'Site bulunamadi' });
    }

    return res.json(data);
  }

  async getSayfa(req: Request, res: Response) {
    const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
    const slug = req.params.slug as string;

    const sayfa = await siteService.getSayfaBySlug(siteSlug, slug);

    if (!sayfa) {
      return res.status(404).json({ mesaj: 'Sayfa bulunamadi' });
    }

    return res.json(sayfa);
  }

  async listeleBlog(req: Request, res: Response) {
    const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
    const siteId = await siteIdFromSlug(siteSlug);
    if (!siteId) return res.status(404).json({ mesaj: 'Site bulunamadi' });

    const bloglar = await blogService.listelePublic(siteId);
    return res.json({ bloglar });
  }

  async getBlog(req: Request, res: Response) {
    const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
    const slug = req.params.slug as string;
    const siteId = await siteIdFromSlug(siteSlug);
    if (!siteId) return res.status(404).json({ mesaj: 'Site bulunamadi' });

    const blog = await blogService.getBySlugPublic(siteId, slug);
    if (!blog) return res.status(404).json({ mesaj: 'Blog yazisi bulunamadi' });

    return res.json({ blog });
  }

  async health(_req: Request, res: Response) {
    return res.json({
      durum: 'ok',
      surum: '1.0.0-dev.3',
      publicSiteSurum: '0.1.0',
      zaman: new Date().toISOString(),
    });
  }
}
