import type { Request, Response } from 'express';
import { NavKategoriService } from '../../Services/NavKategoriService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';

const service = new NavKategoriService();

export class NavKategoriController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kategoriler = await service.listeleAdmin(siteId);
      return res.json({ kategoriler });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kategoriler alinamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kategori = await service.olustur(siteId, req.body);
      return res.status(201).json({ kategori });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kategori olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const kategori = await service.guncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ kategori });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kategori guncellenemedi';
      const status = mesaj === 'Kategori bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, paramId(req.params.id));
      return res.json({ mesaj: 'Kategori silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kategori silinemedi';
      const status = mesaj === 'Kategori bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }
}
