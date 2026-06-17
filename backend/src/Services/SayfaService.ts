import type { Prisma } from '@prisma/client';
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

    const data: Prisma.SayfaUpdateInput = {};
    if (dto.baslik !== undefined) data.baslik = dto.baslik;
    if (dto.slug !== undefined) data.slug = dto.slug;
    else if (dto.baslik) data.slug = slugOlustur(dto.baslik);
    if (dto.icerik !== undefined) data.icerik = dto.icerik;
    if (dto.kapakGorsel !== undefined) data.kapakGorsel = dto.kapakGorsel;
    if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle;
    if (dto.seoDesc !== undefined) data.seoDesc = dto.seoDesc;
    if (dto.yayinda !== undefined) data.yayinda = dto.yayinda;
    if (dto.menudeGoster !== undefined) data.menudeGoster = dto.menudeGoster;
    if (dto.sira !== undefined) data.sira = dto.sira;
    if (dto.acilisModu !== undefined) data.acilisModu = dto.acilisModu;

    return sayfaRepo.updateForSite(sayfaId, data);
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
