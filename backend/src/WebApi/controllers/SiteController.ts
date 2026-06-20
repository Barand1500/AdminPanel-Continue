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
    try {
      const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
      const data = await siteService.getSitePublicData(siteSlug);

      if (!data) {
        return res.status(404).json({ mesaj: 'Site bulunamadi' });
      }

      return res.json(data);
    } catch (err) {
      console.error('[SiteController.getPublicSite]', err);
      const detay = err instanceof Error ? err.message : 'Site verisi alinamadi';
      return res.status(500).json({ mesaj: detay });
    }
  }

  async getSayfa(req: Request, res: Response, slugYolu?: string) {
    const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
    const querySlug = typeof req.query.slug === 'string' ? req.query.slug.trim() : '';
    const paramSlug = slugYolu ?? '';
    const slug = (querySlug || paramSlug).replace(/^\/+|\/+$/g, '');

    if (!slug) {
      return res.status(400).json({ mesaj: 'Slug gerekli' });
    }

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
