import type { Request, Response } from 'express';
import { FormService } from '../../Services/FormService.js';
import { cozulenSiteId } from '../utils/cozulenSiteId.js';
import { paramId } from '../../Infrastructure/utils/paramId.js';
import { veritabaniHataMesaji } from '../utils/veritabaniHataMesaji.js';

const service = new FormService();

function hataYanit(res: Response, err: unknown, varsayilan: string) {
  const ozel = veritabaniHataMesaji(err);
  if (ozel) return res.status(503).json({ mesaj: ozel });
  const mesaj = err instanceof Error ? err.message : varsayilan;
  return res.status(500).json({ mesaj });
}

export class FormController {
  async listele(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const formlar = await service.listeleAdmin(siteId);
      return res.json({ formlar });
    } catch (err) {
      return hataYanit(res, err, 'Formlar alinamadi');
    }
  }

  async detay(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const form = await service.detay(siteId, paramId(req.params.id));
      return res.json({ form });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Form alinamadi';
      const status = mesaj === 'Form bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const form = await service.olustur(siteId, req.body);
      return res.status(201).json({ form });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Form olusturulamadi';
      return res.status(400).json({ mesaj });
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const form = await service.guncelle(siteId, paramId(req.params.id), req.body);
      return res.json({ form });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Form guncellenemedi';
      const status = mesaj === 'Form bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.sil(siteId, paramId(req.params.id));
      return res.json({ mesaj: 'Form silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Form silinemedi';
      const status = mesaj === 'Form bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async gonderimler(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      const gonderimler = await service.gonderimleriGetir(siteId, paramId(req.params.id));
      return res.json({ gonderimler });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Gonderimler alinamadi';
      const status = mesaj === 'Form bulunamadi' ? 404 : 400;
      return res.status(status).json({ mesaj });
    }
  }

  async gonderimOkundu(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.gonderimOkundu(siteId, paramId(req.params.id), paramId(req.params.gonderimId));
      return res.json({ mesaj: 'Okundu olarak isaretlendi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Islem basarisiz';
      return res.status(400).json({ mesaj });
    }
  }

  async gonderimSil(req: Request, res: Response) {
    try {
      const siteId = cozulenSiteId(req);
      if (!siteId) return res.status(400).json({ mesaj: 'Site secimi gerekli' });
      await service.gonderimSil(siteId, paramId(req.params.id), paramId(req.params.gonderimId));
      return res.json({ mesaj: 'Gonderim silindi' });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Silme basarisiz';
      return res.status(400).json({ mesaj });
    }
  }
}
