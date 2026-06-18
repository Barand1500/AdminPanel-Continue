import type { NextFunction, Request, Response } from 'express';
import type { YetkiKodu } from '../../Application/DTOs/KullaniciDto.js';
import { RolService } from '../../Services/RolService.js';

const rolService = new RolService();

export function yetkiMiddleware(...gerekliYetkiler: YetkiKodu[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.kullanici) {
      return res.status(401).json({ mesaj: 'Yetkilendirme gerekli' });
    }

    try {
      const yetkiler = await rolService.kullaniciYetkileri(req.kullanici);
      const izinli = gerekliYetkiler.some((y) => yetkiler.includes(y));
      if (!izinli) {
        return res.status(403).json({ mesaj: 'Bu islem icin yetkiniz yok' });
      }
      next();
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : 'Yetki kontrolu basarisiz';
      return res.status(500).json({ mesaj });
    }
  };
}
