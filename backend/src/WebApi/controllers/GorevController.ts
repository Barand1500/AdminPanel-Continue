import type { AdminGorev } from '@prisma/client';
import type { Request, Response } from 'express';
import { GorevService } from '../../Services/GorevService.js';
import { cozulenSiteIdFromKullanici } from '../../Infrastructure/utils/siteIdCoz.js';
import { idToApi } from '../../Infrastructure/utils/sayisalId.js';
import { veritabaniHataMesaji } from '../utils/veritabaniHataMesaji.js';

const service = new GorevService();

function gorevToApi(gorev: AdminGorev) {
  return {
    id: idToApi(gorev.id),
    metin: gorev.baslik,
    tamamlandi: gorev.tamamlandi,
    onemli: gorev.onemli,
    tarih: gorev.baslangicTarihi?.toISOString().slice(0, 10) ?? null,
    tarihBitis: gorev.bitisTarihi?.toISOString().slice(0, 10) ?? null,
    olusturma: gorev.olusturma.toISOString(),
    guncelleme: gorev.guncelleme.toISOString(),
  };
}

async function kullaniciBaglami(req: Request, res: Response) {
  if (!req.kullanici) {
    res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
    return null;
  }
  if (req.kullanici.rol === 'MUSTERI') {
    res.status(403).json({ mesaj: 'Bu islem yalnizca yonetim paneli kullanicilarina aciktir' });
    return null;
  }
  const siteId = await cozulenSiteIdFromKullanici(req.kullanici);
  return {
    kullaniciId: req.kullanici.kullaniciId,
    siteId,
  };
}

function hataYaniti(res: Response, err: unknown, varsayilan: string) {
  const dbMesaj = veritabaniHataMesaji(err);
  if (dbMesaj) return res.status(503).json({ mesaj: dbMesaj });
  const mesaj = err instanceof Error ? err.message : varsayilan;
  const status = mesaj === 'Gorev bulunamadi' ? 404 : 400;
  return res.status(status).json({ mesaj });
}

export class GorevController {
  async listele(req: Request, res: Response) {
    try {
      const baglam = await kullaniciBaglami(req, res);
      if (!baglam) return;
      const gorevler = await service.listele(baglam.kullaniciId, baglam.siteId);
      return res.json({ gorevler: gorevler.map(gorevToApi) });
    } catch (err) {
      return hataYaniti(res, err, 'Gorevler alinamadi');
    }
  }

  async olustur(req: Request, res: Response) {
    try {
      const baglam = await kullaniciBaglami(req, res);
      if (!baglam) return;
      const gorev = await service.olustur(baglam.kullaniciId, baglam.siteId, req.body);
      return res.status(201).json({ gorev: gorevToApi(gorev) });
    } catch (err) {
      return hataYaniti(res, err, 'Gorev olusturulamadi');
    }
  }

  async guncelle(req: Request, res: Response) {
    try {
      const baglam = await kullaniciBaglami(req, res);
      if (!baglam) return;
      const gorev = await service.guncelle(
        baglam.kullaniciId,
        baglam.siteId,
        req.params.id as string,
        req.body,
      );
      return res.json({ gorev: gorevToApi(gorev) });
    } catch (err) {
      return hataYaniti(res, err, 'Gorev guncellenemedi');
    }
  }

  async sil(req: Request, res: Response) {
    try {
      const baglam = await kullaniciBaglami(req, res);
      if (!baglam) return;
      await service.sil(baglam.kullaniciId, baglam.siteId, req.params.id as string);
      return res.json({ mesaj: 'Gorev silindi' });
    } catch (err) {
      return hataYaniti(res, err, 'Gorev silinemedi');
    }
  }
}
