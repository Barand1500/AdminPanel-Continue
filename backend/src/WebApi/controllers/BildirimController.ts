import type { Request, Response } from 'express';
import { BildirimService } from '../../Services/BildirimService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new BildirimService();

export class BildirimController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const veri = await service.listele(siteId);
      return res.json(veri);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Bildirimler alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async tumunuOkundu(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.tumunuOkundu(siteId);
      return res.json({ mesaj: 'Tum bildirimler okundu olarak isaretlendi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Islem basarisiz';
      return res.status(400).json({ mesaj });
    }
  }
}
