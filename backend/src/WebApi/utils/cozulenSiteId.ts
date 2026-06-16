import type { Request } from 'express';
import { opsiyonelSayisalId, sayisalId } from '../../Infrastructure/utils/sayisalId.js';

export function cozulenSiteId(req: Request): number | null {
  if (!req.kullanici) return null;
  const querySiteId = typeof req.query.siteId === 'string' ? req.query.siteId : undefined;
  if (req.kullanici.rol === 'SUPER_ADMIN') {
    if (querySiteId) return sayisalId(querySiteId);
    return req.kullanici.siteId ?? null;
  }
  return req.kullanici.siteId ?? null;
}

export function paramSiteId(req: Request): number | null {
  return opsiyonelSayisalId(typeof req.query.siteId === 'string' ? req.query.siteId : undefined);
}
