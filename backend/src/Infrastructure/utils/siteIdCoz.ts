import { config } from '../../config/env.js';
import { SiteRepository } from '../repositories/SiteRepository.js';
import { sayisalId } from './sayisalId.js';

const siteRepo = new SiteRepository();

export async function cozulenSiteIdFromKullanici(
  kullanici: { siteId: number | null },
  explicitSiteId?: string | number | null
): Promise<number> {
  if (explicitSiteId !== undefined && explicitSiteId !== null && explicitSiteId !== '') {
    return sayisalId(explicitSiteId);
  }
  if (kullanici.siteId) return kullanici.siteId;
  const site = await siteRepo.findBySlug(config.defaultSiteSlug);
  if (!site) throw new Error('Varsayilan site bulunamadi');
  return site.id;
}
