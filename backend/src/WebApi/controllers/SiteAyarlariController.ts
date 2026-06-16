import type { Request, Response } from 'express';
import { SiteAyarlariService } from '../../Services/SiteAyarlariService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new SiteAyarlariService();

export class SiteAyarlariController {
  async getir(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const veri = await service.getir(req.kullanici, cozulenSiteId(req));
      return res.json(veri);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Site ayarlari alinamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const veri = await service.guncelle(req.kullanici, req.body, cozulenSiteId(req));
      return res.json(veri);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Site ayarlari guncellenemedi';
      return res.status(400).json({ mesaj });
    }
  }
}
