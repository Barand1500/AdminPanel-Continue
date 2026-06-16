import type { Request, Response, NextFunction } from 'express';

const istekler = new Map<string, number[]>();
const LIMIT = 3;
const PENCERE_MS = 60_000;

function ipAl(req: Request) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip ?? 'unknown';
}

export function formRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = ipAl(req);
  const simdi = Date.now();
  const kayitlar = (istekler.get(ip) ?? []).filter((t) => simdi - t < PENCERE_MS);

  if (kayitlar.length >= LIMIT) {
    return res.status(429).json({ mesaj: 'Cok fazla istek. Lutfen bir dakika sonra tekrar deneyin.' });
  }

  kayitlar.push(simdi);
  istekler.set(ip, kayitlar);
  return next();
}
