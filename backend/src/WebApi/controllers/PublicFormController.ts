import type { Request, Response } from 'express';
import { FormService } from '../../Services/FormService.js';
import { config } from '../../config/env.js';

const service = new FormService();

export class PublicFormController {
  async gonder(req: Request, res: Response) {
    try {
      const siteSlug = (req.query.site as string) ?? config.defaultSiteSlug;
      const formSlug = req.params.slug as string;
      const gonderim = await service.publicGonder(siteSlug, formSlug, req.body);
      return res.status(201).json({
        mesaj: 'Form basariyla gonderildi',
        gonderimId: String(gonderim.id),
      });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Form gonderilemedi';
      const status = mesaj === 'Form bulunamadi' || mesaj === 'Site bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
