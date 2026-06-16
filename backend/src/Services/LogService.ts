import type { LogKaydetDto } from '../Application/DTOs/LogDto.js';
import type { JwtPayload } from './AuthService.js';
import { LogRepository } from '../Infrastructure/repositories/LogRepository.js';
import { cozulenSiteIdFromKullanici } from '../Infrastructure/utils/siteIdCoz.js';

const logRepo = new LogRepository();

export class LogService {
  async listele(kullanici: JwtPayload, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    return logRepo.findBySiteId(siteId);
  }

  async kaydet(kullanici: JwtPayload, dto: LogKaydetDto, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    return logRepo.create({
      siteId,
      kullaniciId: kullanici.kullaniciId,
      kullaniciAd: kullanici.email.split('@')[0],
      kullaniciEmail: kullanici.email,
      islem: dto.islem,
      modulId: dto.modulId ?? null,
      aksiyonId: dto.aksiyonId ?? null,
    });
  }

  async temizle(kullanici: JwtPayload, explicitSiteId?: string | number | null) {
    const siteId = await cozulenSiteIdFromKullanici(kullanici, explicitSiteId);
    await logRepo.temizle(siteId);
  }
}
