import type { NextFunction, Request, Response } from 'express';
import { SiteAuthService } from '../../Services/SiteAuthService.js';
import { AuthService, type JwtPayload } from '../../Services/AuthService.js';

const siteAuthService = new SiteAuthService();
const authService = new AuthService();

declare global {
  namespace Express {
    interface Request {
      uye?: JwtPayload;
    }
  }
}

export function uyeAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
  }

  try {
    const token = header.slice(7);
    const payload = authService.tokenDogrula(token);
    if (payload.rol !== 'MUSTERI') {
      return res.status(403).json({ mesaj: 'Üye oturumu gerekli' });
    }
    req.uye = payload;
    next();
  } catch {
    return res.status(401).json({ mesaj: 'Geçersiz veya süresi dolmuş oturum' });
  }
}

export class SiteAuthController {
  async kayit(req: Request, res: Response) {
    try {
      const sonuc = await siteAuthService.kayit(req.body);
      return res.status(201).json(sonuc);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Kayıt başarısız';
      return res.status(400).json({ mesaj });
    }
  }

  async giris(req: Request, res: Response) {
    try {
      const sonuc = await siteAuthService.giris(req.body);
      return res.json(sonuc);
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Giriş başarısız';
      return res.status(401).json({ mesaj });
    }
  }

  async ben(req: Request, res: Response) {
    try {
      if (!req.uye) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const kullanici = await siteAuthService.ben(req.uye.kullaniciId);
      return res.json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Oturum geçersiz';
      return res.status(401).json({ mesaj });
    }
  }

  async profilGuncelle(req: Request, res: Response) {
    try {
      if (!req.uye) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      const kullanici = await siteAuthService.profilGuncelle(req.uye.kullaniciId, req.body);
      return res.json({ kullanici });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Profil güncellenemedi';
      return res.status(400).json({ mesaj });
    }
  }

  async sifreDegistir(req: Request, res: Response) {
    try {
      if (!req.uye) return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
      await siteAuthService.sifreDegistir(req.uye.kullaniciId, req.body);
      return res.json({ basarili: true });
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Şifre değiştirilemedi';
      return res.status(400).json({ mesaj });
    }
  }
}
