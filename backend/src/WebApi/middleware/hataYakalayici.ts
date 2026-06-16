import type { Request, Response, NextFunction } from 'express';

export function hataYakalayici(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Hata]', err.message);

  res.status(500).json({
    mesaj: 'Sunucu hatasi olustu',
    ...(process.env.NODE_ENV === 'development' && { detay: err.message }),
  });
}

export function bulunamadiHandler(_req: Request, res: Response) {
  res.status(404).json({ mesaj: 'Endpoint bulunamadi' });
}
