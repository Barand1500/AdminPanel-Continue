import type { Request, Response } from 'express';
import { SistemAyarlariService } from '../../Services/SistemAyarlariService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new SistemAyarlariService();

export class SistemAyarlariController {
  async getir(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const veri = await service.getir(req.kullanici, cozulenSiteId(req));
      return res.json(veri);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sistem ayarlari alinamadi';
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
      const mesaj = err instanceof Error ? err.message : 'Sistem ayarlari guncellenemedi';
      return res.status(400).json({ mesaj });
    }
  }
}
