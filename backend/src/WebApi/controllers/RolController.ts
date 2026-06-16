import type { Request, Response } from 'express';
import { YETKI_ETIKETLERI, YETKILER } from '../../Application/DTOs/KullaniciDto.js';
import { RolService } from '../../Services/RolService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new RolService();

export class RolController {
  async listele(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const siteId = cozulenSiteId(req);
      const roller = await service.listele(req.kullanici, siteId);
      return res.json({
        roller,
        yetkiler: YETKILER.map((kod) => ({ kod, etiket: YETKI_ETIKETLERI[kod] })),
      });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Roller alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async kaydet(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const siteId = cozulenSiteId(req);
      const roller = await service.kaydet(req.kullanici, req.body, siteId);
      return res.json({
        roller,
        yetkiler: YETKILER.map((kod) => ({ kod, etiket: YETKI_ETIKETLERI[kod] })),
      });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Roller kaydedilemedi';
      const status = mesaj.includes('yetkiniz') || mesaj.includes('yalnizca') ? 403 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
