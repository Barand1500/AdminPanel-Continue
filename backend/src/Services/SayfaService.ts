import type { MenuGuncelleDto, SayfaGuncelleDto, SayfaOlusturDto } from '../Application/DTOs/SayfaDto.js';
import { SayfaRepository } from '../Infrastructure/repositories/SayfaRepository.js';
import { sayisalId } from '../Infrastructure/utils/sayisalId.js';

const sayfaRepo = new SayfaRepository();

function slugOlustur(baslik: string) {
  return baslik
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export class SayfaService {
  async listeleAdmin(siteId: number) {
    return sayfaRepo.findAdminBySiteId(siteId);
  }

  async olustur(siteId: number, dto: SayfaOlusturDto) {
    const slug = dto.slug ?? slugOlustur(dto.baslik);
    return sayfaRepo.createForSite(siteId, {
      baslik: dto.baslik,
      slug,
      icerik: dto.icerik ?? '',
      kapakGorsel: dto.kapakGorsel,
      seoTitle: dto.seoTitle,
      seoDesc: dto.seoDesc,
      yayinda: dto.yayinda,
      menudeGoster: dto.menudeGoster,
      sira: dto.sira,
      acilisModu: dto.acilisModu,
    });
  }

  async guncelle(siteId: number, sayfaId: number, dto: SayfaGuncelleDto) {
    const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!mevcut) throw new Error('Sayfa bulunamadi');

    return sayfaRepo.updateForSite(sayfaId, {
      baslik: dto.baslik,
      slug: dto.slug ?? (dto.baslik ? slugOlustur(dto.baslik) : undefined),
      icerik: dto.icerik,
      kapakGorsel: dto.kapakGorsel,
      seoTitle: dto.seoTitle,
      seoDesc: dto.seoDesc,
      yayinda: dto.yayinda,
      menudeGoster: dto.menudeGoster,
      sira: dto.sira,
      acilisModu: dto.acilisModu,
    });
  }

  async sil(siteId: number, sayfaId: number) {
    const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!mevcut) throw new Error('Sayfa bulunamadi');
    await sayfaRepo.deleteForSite(sayfaId, siteId);
  }

  async menuGuncelle(siteId: number, dto: MenuGuncelleDto) {
    for (const oge of dto.ogeler) {
      const sayfaId = sayisalId(oge.id);
      const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
      if (!mevcut) continue;
      await sayfaRepo.updateForSite(sayfaId, {
        sira: oge.sira,
        menudeGoster: oge.menudeGoster,
      });
    }
    return sayfaRepo.findAdminBySiteId(siteId);
  }
}
