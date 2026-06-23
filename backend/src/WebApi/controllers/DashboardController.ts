import type { Request, Response } from 'express';
import { DashboardService, gecerliDonem } from '../../Services/DashboardService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { veritabaniHataMesaji } from '../utils/veritabaniHataMesaji.js';

const service = new DashboardService();

export class DashboardController {
  async ozet(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const donem = req.query.donem ? gecerliDonem(req.query.donem) : undefined;
      const ozet = await service.ozet(siteId, donem);
      return res.json(ozet);
    } catch (err) {
      const ozel = veritabaniHataMesaji(err);
      if (ozel) return res.status(503).json({ mesaj: ozel });
      const mesaj = err instanceof Error ? err.message : 'Dashboard alinamadi';
      return res.status(500).json({ mesaj });
    }
  }
}
