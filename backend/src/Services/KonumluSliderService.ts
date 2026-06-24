import type { KonumluSliderGuncelleDto, KonumluSliderOlusturDto } from '../Application/DTOs/KonumluSliderDto.js';
import { KonumluSliderRepository } from '../Infrastructure/repositories/KonumluSliderRepository.js';
import { opsiyonelSayisalId } from '../Infrastructure/utils/sayisalId.js';

const repo = new KonumluSliderRepository();

export class KonumluSliderService {
  async listeleAdmin(siteId: number) {
    return repo.findAdminBySiteId(siteId);
  }

  async listelePublic(siteId: number) {
    return repo.findPublicBySiteId(siteId);
  }

  async olustur(siteId: number, dto: KonumluSliderOlusturDto) {
    const sayfaId = opsiyonelSayisalId(dto.sayfaId);
    return repo.createForSite(siteId, {
      ad: dto.ad.trim(),
      sayfaId: sayfaId ?? null,
      aktif: dto.aktif ?? true,
      sira: dto.sira ?? 0,
      configJson: dto.configJson as object,
    });
  }

  async guncelle(siteId: number, id: number, dto: KonumluSliderGuncelleDto) {
    const mevcut = await repo.findByIdAndSiteId(id, siteId);
    if (!mevcut) throw new Error('Slider bulunamadi');

    const sayfaId =
      dto.sayfaId !== undefined ? (opsiyonelSayisalId(dto.sayfaId) ?? null) : undefined;

    return repo.updateForSite(id, {
      ad: dto.ad?.trim(),
      aktif: dto.aktif,
      sira: dto.sira,
      ...(sayfaId !== undefined
        ? sayfaId != null
          ? { sayfa: { connect: { id: sayfaId } } }
          : { sayfa: { disconnect: true } }
        : {}),
      configJson: dto.configJson !== undefined ? (dto.configJson as object) : undefined,
    });
  }

  async sil(siteId: number, id: number) {
    const sonuc = await repo.deleteForSite(id, siteId);
    if (sonuc.count === 0) throw new Error('Slider bulunamadi');
  }
}
