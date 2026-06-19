import type { Request, Response } from 'express';
import { EklentiService } from '../../Services/EklentiService.js';
import { EklentiKurulumService } from '../../Services/EklentiKurulumService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new EklentiService();
const kurulumService = new EklentiKurulumService();

export class EklentiController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const eklentiler = await service.listele(siteId);
      return res.json({ eklentiler });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Eklentiler alinamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async kur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const eklenti = await service.kur(siteId, req.params.kod as string);
      return res.status(201).json({ eklenti, mesaj: 'Eklenti kuruldu' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Eklenti kurulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async aktif(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const eklenti = await service.aktif(siteId, req.params.kod as string);
      return res.json({ eklenti, mesaj: 'Eklenti etkinlestirildi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Eklenti etkinlestirilemedi';
      const status = mesaj.includes('kurulu degil') ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async pasif(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const eklenti = await service.pasif(siteId, req.params.kod as string);
      return res.json({ eklenti, mesaj: 'Eklenti pasiflestirildi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Eklenti pasiflestirilemedi';
      const status = mesaj.includes('kurulu degil') ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async kaldir(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kayit = await service.kaldir(siteId, req.params.kod as string);
      if (kayit.kaynak === 'yukleme') {
        await kurulumService.dosyaKlasorunuSil(siteId, kayit.kod);
      }
      return res.json({ mesaj: 'Eklenti kaldirildi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Eklenti kaldirilamadi';
      const status = mesaj.includes('kurulu degil') ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async yukle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      if (!req.file) return res.status(400).json({ mesaj: 'Zip dosyasi gerekli' });
      const eklenti = await kurulumService.ziptenKur(siteId, req.file.buffer);
      return res.status(201).json({ eklenti, mesaj: 'Eklenti yuklendi ve kuruldu' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Eklenti yuklenemedi';
      return res.status(400).json({ mesaj });
    }
  }
}
