import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { MedyaOlusturDto, MedyaTopluSilDto } from '../Application/DTOs/MedyaDto.js';
import { MedyaRepository } from '../Infrastructure/repositories/MedyaRepository.js';

const medyaRepo = new MedyaRepository();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../uploads');

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

  private async dosyaSil(url: string | null | undefined) {
    if (!url || !url.startsWith('/uploads/')) return;
    const relative = url.replace(/^\/uploads\//, '');
    const tamYol = path.join(uploadsDir, relative);
    try {
      await fs.unlink(tamYol);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        // eslint-disable-next-line no-console
        console.error('Medya dosyasi silinemedi:', tamYol, err);
      }
    }
  }

  async sil(siteId: number, medyaId: number) {
    const mevcut = await medyaRepo.findByIdAndSiteId(medyaId, siteId);
    if (!mevcut) throw new Error('Medya bulunamadi');
    await medyaRepo.deleteForSite(medyaId, siteId);
    await this.dosyaSil(mevcut.url);
  }

  async topluSil(siteId: number, dto: MedyaTopluSilDto) {
    const benzersizIds = Array.from(new Set(dto.ids));
    const mevcutlar = await medyaRepo.findManyByIdsAndSiteId(benzersizIds, siteId);
    if (mevcutlar.length === 0) {
      throw new Error('Silinecek medya bulunamadi');
    }
    await medyaRepo.deleteManyForSite(
      mevcutlar.map((m) => m.id),
      siteId
    );
    await Promise.all(mevcutlar.map((m) => this.dosyaSil(m.url)));
  }
}
