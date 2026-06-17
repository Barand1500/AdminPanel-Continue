import type { Request, Response } from 'express';
import { SayfaService } from '../../Services/SayfaService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';

const service = new SayfaService();

export class SayfaController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sayfalar = await service.listeleAdmin(siteId);
      return res.json({ sayfalar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sayfalar alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sayfa = await service.olustur(siteId, req.body);
      return res.status(201).json({ sayfa });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sayfa olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sayfa = await service.guncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ sayfa });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sayfa guncellenemedi';
      const status = mesaj === 'Sayfa bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, paramId(req.params.id));
      return res.json({ mesaj: 'Sayfa silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sayfa silinemedi';
      const status = mesaj === 'Sayfa bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async menuGuncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sayfalar = await service.menuGuncelle(siteId, req.body);
      return res.json({ sayfalar });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Menu guncellenemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async tasi(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const sayfa = await service.tasi(siteId, paramId(req.params.id), req.body);
      return res.json({ sayfa });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Sayfa tasinamadi';
      const status = mesaj === 'Sayfa bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
