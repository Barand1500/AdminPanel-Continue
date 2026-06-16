import type { NextFunction, Request, Response } from 'express';
import { AuthService, type JwtPayload } from '../../Services/AuthService.js';

const authService = new AuthService();

declare global {
  namespace Express {
    interface Request {
      kullanici?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
  }

  try {
    const token = header.slice(7);
    req.kullanici = authService.tokenDogrula(token);
    next();
  } catch {
    return res.status(401).json({ mesaj: 'Gecersiz veya suresi dolmus token' });
  }
}

export class AuthController {
  async giris(req: Request, res: Response) {
    try {
      const sonuc = await authService.giris(req.body);
      return res.json(sonuc);
    } catch (err) {
      if (err instanceof Error && err.message.includes('DATABASE_URL')) {
        return res.status(503).json({
          mesaj: 'Veritabani baglantisi kurulamadi. MySQL servisinin acik oldugunu ve backend/.env icindeki DATABASE_URL degerini kontrol edin.',
        });
      }
      if (err instanceof Error && err.message.includes('Prisma')) {
        console.error('[Auth]', err.message);
        return res.status(503).json({ mesaj: 'Veritabani hatasi. Sunucu loglarini kontrol edin.' });
      }
      const mesaj = err instanceof Error ? err.message : 'Giris basarisiz';
      return res.status(401).json({ mesaj });
    }
  }

  async ben(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const kullanici = await authService.ben(req.kullanici.kullaniciId);
      return res.json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kullanici alinamadi';
      return res.status(401).json({ mesaj });
    }
  }

  async profilGuncelle(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const kullanici = await authService.profilGuncelle(req.kullanici.kullaniciId, req.body);
      return res.json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Profil guncellenemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async tercihlerGuncelle(req: Request, res: Response) {
    try {
      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      }
      const kullanici = await authService.tercihlerGuncelle(req.kullanici.kullaniciId, req.body);
      return res.json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Tercihler kaydedilemedi';
      return res.status(400).json({ mesaj });
    }
  }
}
