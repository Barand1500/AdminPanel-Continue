import type { Request, Response } from 'express';
import { YedeklemeService } from '../../Services/YedeklemeService.js';

const yedekService = new YedeklemeService();

export class YedeklemeController {
  async varsayilanDosyaAdi(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const sonuc = await yedekService.varsayilanDosyaAdi(req.kullanici);
      return res.json(sonuc);
    } catch (err) {
      return res.status(400).json({ mesaj: err instanceof Error ? err.message : 'Dosya adi alinamadi' });
    }
  }

  async gecmis(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const sonuc = await yedekService.gecmisListele(req.kullanici);
      return res.json(sonuc);
    } catch (err) {
      return res.status(400).json({ mesaj: err instanceof Error ? err.message : 'Gecmis alinamadi' });
    }
  }

  async indir(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });

      const dosyaAdi = typeof req.body?.dosyaAdi === 'string' ? req.body.dosyaAdi : undefined;
      const { dosyaAdi: ad, icerik } = await yedekService.indirVeKaydet(req.kullanici, dosyaAdi);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${ad}"`);
      return res.send(icerik);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Yedek olusturulamadi';
      return res.status(500).json({ mesaj });
    }
  }

  async geriYukle(req: Request, res: Response) {
    try {
      if (!req.kullanici) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });

      const dosya = req.file;
      if (!dosya) return res.status(400).json({ mesaj: 'JSON dosyasi gerekli' });

      const dosyaAdi = typeof req.body?.dosyaAdi === 'string' ? req.body.dosyaAdi : dosya.originalname;
      const icerik = dosya.buffer.toString('utf-8');

      const sonuc = await yedekService.jsonGeriYukle(req.kullanici, icerik, dosyaAdi);
      return res.json(sonuc);
    } catch (err) {
      return res.status(400).json({ mesaj: err instanceof Error ? err.message : 'Geri yukleme basarisiz' });
    }
  }
}
