import type { NextFunction, Request, Response } from 'express';
import type { RolKodu } from '../../Application/DTOs/KullaniciDto.js';

export function rolMiddleware(...izinliRoller: RolKodu[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.kullanici) {
      return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
    }
    if (!izinliRoller.includes(req.kullanici.rol as RolKodu)) {
      return res.status(403).json({ mesaj: 'Bu islem icin yetkiniz yok' });
    }
    next();
  };
}
