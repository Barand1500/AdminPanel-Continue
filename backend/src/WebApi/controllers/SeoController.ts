import type { Request, Response } from 'express';
import { SeoService } from '../../Services/SeoService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';

const service = new SeoService();

export class SeoController {
  async ozet(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const seo = await service.ozet(siteId);
      return res.json(seo);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'SEO verisi alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async genelGuncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const ayarlar = await service.genelGuncelle(siteId, req.body);
      return res.json({ ayarlar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Genel SEO guncellenemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async sayfaGuncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sayfa = await service.sayfaGuncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ sayfa });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sayfa SEO guncellenemedi';
      const status = mesaj === 'Sayfa bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
