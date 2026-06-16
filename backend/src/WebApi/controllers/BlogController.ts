import type { Request, Response } from 'express';
import { BlogService } from '../../Services/BlogService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';

const service = new BlogService();

export class BlogController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const bloglar = await service.listeleAdmin(siteId);
      return res.json({ bloglar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Bloglar alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const blog = await service.olustur(siteId, req.body);
      return res.status(201).json({ blog });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Blog olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const blog = await service.guncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ blog });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Blog guncellenemedi';
      const status = mesaj === 'Blog yazisi bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, paramId(req.params.id));
      return res.json({ mesaj: 'Blog silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Blog silinemedi';
      const status = mesaj === 'Blog yazisi bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
