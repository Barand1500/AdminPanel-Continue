import type { Prisma } from '@prisma/client';
import { sayisalId, opsiyonelSayisalId } from '../Infrastructure/utils/sayisalId.js';
import type { KisayolGuncelleDto, KisayolOlusturDto } from '../Application/DTOs/KisayolDto.js';
import { KisayolRepository } from '../Infrastructure/repositories/KisayolRepository.js';

const kisayolRepo = new KisayolRepository();

function kodOlustur(deger: string) {
  return deger
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_.]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export class KisayolService {
  async listele(siteId: number) {
    return kisayolRepo.findBySiteId(siteId);
  }

  async olustur(siteId: number, dto: KisayolOlusturDto) {
    const kod = dto.kod?.trim() || kodOlustur(dto.ad);
    if (!kod) throw new Error('Kisayol kodu olusturulamadi');

    const mevcut = await kisayolRepo.findByKod(siteId, kod);
    if (mevcut) throw new Error('Bu kisayol kodu zaten kullanimda');

    return kisayolRepo.createForSite(siteId, {
      ad: dto.ad,
      kod,
      tusKombinasyonu: dto.tusKombinasyonu,
      deger: dto.deger || null,
      aciklama: dto.aciklama || null,
      kategori: dto.kategori || null,
      sira: dto.sira ?? 0,
      aktif: dto.aktif ?? true,
      ekAyarlarJson: (dto.ekAyarlarJson ?? undefined) as Prisma.InputJsonValue | undefined,
    });
  }

  async guncelle(siteId: number, idHam: string | number, dto: KisayolGuncelleDto) {
    const id = sayisalId(idHam);
    const mevcut = await kisayolRepo.findByIdAndSiteId(id, siteId);
    if (!mevcut) throw new Error('Kisayol bulunamadi');

    const yeniKod = dto.kod?.trim();
    if (yeniKod && yeniKod !== mevcut.kod) {
      const cakisan = await kisayolRepo.findByKod(siteId, yeniKod);
      if (cakisan) throw new Error('Bu kisayol kodu zaten kullanimda');
    }

    return kisayolRepo.updateForSite(id, {
      ad: dto.ad,
      kod: dto.kod,
      tusKombinasyonu: dto.tusKombinasyonu,
      deger: dto.deger === '' ? null : dto.deger,
      aciklama: dto.aciklama === '' ? null : dto.aciklama,
      kategori: dto.kategori === '' ? null : dto.kategori,
      sira: dto.sira,
      aktif: dto.aktif,
      ekAyarlarJson:
        dto.ekAyarlarJson !== undefined ? (dto.ekAyarlarJson as Prisma.InputJsonValue) : undefined,
    });
  }

  async sil(siteId: number, idHam: string | number) {
    const id = sayisalId(idHam);
    const mevcut = await kisayolRepo.findByIdAndSiteId(id, siteId);
    if (!mevcut) throw new Error('Kisayol bulunamadi');
    await kisayolRepo.deleteForSite(id, siteId);
  }
}
