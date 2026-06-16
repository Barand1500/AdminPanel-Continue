import type { Request, Response } from 'express';
import { MedyaService } from '../../Services/MedyaService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';

const service = new MedyaService();

export class MedyaController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const medyalar = await service.listele(siteId);
      return res.json({ medyalar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Medyalar alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const medya = await service.olustur(siteId, req.body);
      return res.status(201).json({ medya });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Medya eklenemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async yukle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const dosya = req.file;
      if (!dosya) return res.status(400).json({ mesaj: 'Dosya gerekli' });

      const url = `/uploads/${dosya.filename}`;
      const ad = (req.body.ad as string)?.trim() || dosya.originalname;
      const medya = await service.olusturDosyadan(siteId, ad, url, dosya.size);
      return res.status(201).json({ medya });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Dosya yuklenemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, paramId(req.params.id));
      return res.json({ mesaj: 'Medya silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Medya silinemedi';
      const status = mesaj === 'Medya bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
