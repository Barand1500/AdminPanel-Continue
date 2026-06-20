import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MEDYA_MAX_DOSYA_MB } from '../../config/medya.js';

export function hataYakalayici(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Hata]', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        mesaj: `Dosya cok buyuk. Maksimum ${MEDYA_MAX_DOSYA_MB} MB yukleyebilirsiniz.`,
      });
    }
    return res.status(400).json({ mesaj: err.message });
  }

  res.status(500).json({
    mesaj: 'Sunucu hatasi olustu',
    ...(process.env.NODE_ENV === 'development' && { detay: err.message }),
  });
}

export function bulunamadiHandler(_req: Request, res: Response) {
  res.status(404).json({ mesaj: 'Endpoint bulunamadi' });
}
