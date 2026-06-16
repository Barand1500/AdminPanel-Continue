import type { Request, Response } from 'express';
import { KisayolService } from '../../Services/KisayolService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new KisayolService();

export class KisayolController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kisayollar = await service.listele(siteId);
      return res.json({ kisayollar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kisayollar alinamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kisayol = await service.olustur(siteId, req.body);
      return res.status(201).json({ kisayol });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kisayol olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kisayol = await service.guncelle(siteId, req.params.id as string, req.body);
      return res.json({ kisayol });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kisayol guncellenemedi';
      const status = mesaj === 'Kisayol bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, req.params.id as string);
      return res.json({ mesaj: 'Kisayol silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kisayol silinemedi';
      const status = mesaj === 'Kisayol bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
