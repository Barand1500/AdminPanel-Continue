import type { Request, Response } from 'express';
import { HavaDurumuService } from '../../Services/HavaDurumuService.js';

const service = new HavaDurumuService();

export class HavaDurumuController {
  async getir(req: Request, res: Response) {
    const sehir = (req.query.sehir as string) ?? '';
    const ilce = (req.query.ilce as string) ?? '';

    try {
      const veri = await service.getir(sehir, ilce);
      return res.json(veri);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Hava verisi alinamadi';
      return res.status(400).json({ mesaj });
    }
  }
}
