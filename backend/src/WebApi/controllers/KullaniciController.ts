import type { Request, Response } from 'express';
import { KullaniciService } from '../../Services/KullaniciService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';

const service = new KullaniciService();

export class KullaniciController {
  async listele(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const siteId = cozulenSiteId(req);
      const kullanicilar = await service.listele(req.kullanici, siteId);
      return res.json({ kullanicilar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kullanicilar alinamadi';
      const status = mesaj.includes('yetkiniz') ? 403 : 500;
      return res.status(status).json({ mesaj });
    }
  }

  async siteler(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const siteler = await service.siteler(req.kullanici);
      return res.json({ siteler });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Siteler alinamadi';
      const status = mesaj.includes('yetkiniz') ? 403 : 500;
      return res.status(status).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const kullanici = await service.olustur(req.kullanici, req.body);
      return res.status(201).json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kullanici olusturulamadi';
      const status = mesaj.includes('yetkiniz') ? 403 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const kullanici = await service.guncelle(req.kullanici, req.params.id as string, req.body);
      return res.json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kullanici guncellenemedi';
      let status = 400;
      if (mesaj.includes('yetkiniz')) status = 403;
      if (mesaj === 'Kullanici bulunamadi') status = 404;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      await service.sil(req.kullanici, req.params.id as string);
      return res.json({ mesaj: 'Kullanici silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kullanici silinemedi';
      let status = 400;
      if (mesaj.includes('yetkiniz')) status = 403;
      if (mesaj === 'Kullanici bulunamadi') status = 404;
      return res.status(status).json({ mesaj });
    }
  }
}
