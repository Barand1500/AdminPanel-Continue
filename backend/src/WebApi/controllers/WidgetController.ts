import { WidgetTipi } from '@prisma/client';
import type { Request, Response } from 'express';
import { WidgetService } from '../../Services/WidgetService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';

const widgetService = new WidgetService();

export class WidgetController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) {
        return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      }

      const tipRaw = typeof req.query.tip === 'string' ? req.query.tip : undefined;
      const tip = tipRaw && Object.values(WidgetTipi).includes(tipRaw as WidgetTipi)
        ? (tipRaw as WidgetTipi)
        : undefined;

      const widgetlar = await widgetService.listele(siteId, tip);
      return res.json({ widgetlar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Widgetlar alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) {
        return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      }

      const widget = await widgetService.olustur(siteId, req.body);
      return res.status(201).json({ widget });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Widget olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) {
        return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      }

      const widget = await widgetService.guncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ widget });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Widget guncellenemedi';
      const status = mesaj === 'Widget bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
