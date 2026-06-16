import type { Request, Response } from 'express';
import { SekmeService } from '../../Services/SekmeService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new SekmeService();

export class SekmeController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sekmeler = await service.listele(siteId);
      return res.json({ sekmeler });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sekmeler alinamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sekme = await service.olustur(siteId, req.body);
      return res.status(201).json({ sekme });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sekme olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sekme = await service.guncelle(siteId, req.params.id as string, req.body);
      return res.json({ sekme });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sekme guncellenemedi';
      const status =
        mesaj === 'Sekme bulunamadi' || mesaj === 'Bagli kisayol bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, req.params.id as string);
      return res.json({ mesaj: 'Sekme silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sekme silinemedi';
      const status = mesaj === 'Sekme bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
