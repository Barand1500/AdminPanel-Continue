import type { Request, Response } from 'express';
import { logKaydetSchema } from '../../Application/DTOs/LogDto.js';
import { LogService } from '../../Services/LogService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { veritabaniHataMesaji } from '../utils/veritabaniHataMesaji.js';

const service = new LogService();

export class LogController {
  async listele(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const loglar = await service.listele(req.kullanici, cozulenSiteId(req));
      return res.json({ loglar });
    } catch (err) {
      const ozel = veritabaniHataMesaji(err);
      if (ozel) return res.status(503).json({ mesaj: ozel });
      const mesaj = err instanceof Error ? err.message : 'Loglar alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async kaydet(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const sonuc = logKaydetSchema.safeParse(req.body);
      if (!sonuc.success) {
        return res.status(400).json({ mesaj: 'Gecersiz veri' });
      }
      const log = await service.kaydet(req.kullanici, sonuc.data, cozulenSiteId(req));
      return res.status(201).json({ log });
    } catch (err) {
      const ozel = veritabaniHataMesaji(err);
      if (ozel) return res.status(503).json({ mesaj: ozel });
      const mesaj = err instanceof Error ? err.message : 'Log kaydedilemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async temizle(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      await service.temizle(req.kullanici, cozulenSiteId(req));
      return res.json({ mesaj: 'Loglar temizlendi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Loglar temizlenemedi';
      return res.status(400).json({ mesaj });
    }
  }
}
