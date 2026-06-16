import type { MedyaOlusturDto } from '../Application/DTOs/MedyaDto.js';
import { MedyaRepository } from '../Infrastructure/repositories/MedyaRepository.js';

const medyaRepo = new MedyaRepository();

export class MedyaService {
  async listele(siteId: number) {
    return medyaRepo.findBySiteId(siteId);
  }

  async olustur(siteId: number, dto: MedyaOlusturDto) {
    return medyaRepo.createForSite(siteId, {
      ad: dto.ad,
      url: dto.url,
      tip: dto.tip,
    });
  }

  async olusturDosyadan(siteId: number, ad: string, url: string, boyut: number) {
    return medyaRepo.createForSite(siteId, {
      ad,
      url,
      tip: 'GORSEL',
      boyut,
    });
  }

  async sil(siteId: number, medyaId: number) {
    const mevcut = await medyaRepo.findByIdAndSiteId(medyaId, siteId);
    if (!mevcut) throw new Error('Medya bulunamadi');
    await medyaRepo.deleteForSite(medyaId, siteId);
  }
}
