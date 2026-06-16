import type { Prisma } from '@prisma/client';
import type { SekmeGuncelleDto, SekmeOlusturDto } from '../Application/DTOs/SekmeDto.js';
import { KisayolRepository } from '../Infrastructure/repositories/KisayolRepository.js';
import { SekmeRepository } from '../Infrastructure/repositories/SekmeRepository.js';
import { opsiyonelSayisalId, sayisalId } from '../Infrastructure/utils/sayisalId.js';

const sekmeRepo = new SekmeRepository();
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

async function kisayolDogrula(siteId: number, kisayolId?: string | number | null) {
  if (!kisayolId) return null;
  const kayit = await kisayolRepo.findByIdAndSiteId(sayisalId(kisayolId), siteId);
  if (!kayit) throw new Error('Bagli kisayol bulunamadi');
  return kayit.id;
}

export class SekmeService {
  async listele(siteId: number) {
    return sekmeRepo.findBySiteId(siteId);
  }

  async olustur(siteId: number, dto: SekmeOlusturDto) {
    const kod = dto.kod?.trim() || kodOlustur(dto.ad);
    if (!kod) throw new Error('Sekme kodu olusturulamadi');

    const mevcut = await sekmeRepo.findByKod(siteId, kod);
    if (mevcut) throw new Error('Bu sekme kodu zaten kullanimda');

    const kisayolId = await kisayolDogrula(siteId, dto.kisayolId || null);

    return sekmeRepo.createForSite(siteId, {
      ad: dto.ad,
      kod,
      tip: dto.tip ?? 'sayfa',
      yol: dto.yol,
      ikon: dto.ikon || null,
      aciklama: dto.aciklama || null,
      kategori: dto.kategori || null,
      hedef: dto.hedef || '_self',
      sira: dto.sira ?? 0,
      aktif: dto.aktif ?? true,
      sabit: dto.sabit ?? false,
      kisayolId,
      ekAyarlarJson: (dto.ekAyarlarJson ?? undefined) as Prisma.InputJsonValue | undefined,
    });
  }

  async guncelle(siteId: number, idHam: string | number, dto: SekmeGuncelleDto) {
    const id = sayisalId(idHam);
    const mevcut = await sekmeRepo.findByIdAndSiteId(id, siteId);
    if (!mevcut) throw new Error('Sekme bulunamadi');

    const yeniKod = dto.kod?.trim();
    if (yeniKod && yeniKod !== mevcut.kod) {
      const cakisan = await sekmeRepo.findByKod(siteId, yeniKod);
      if (cakisan) throw new Error('Bu sekme kodu zaten kullanimda');
    }

    const kisayolId =
      dto.kisayolId !== undefined ? await kisayolDogrula(siteId, dto.kisayolId || null) : undefined;

    return sekmeRepo.updateForSite(id, {
      ad: dto.ad,
      kod: dto.kod,
      tip: dto.tip,
      yol: dto.yol,
      ikon: dto.ikon === '' ? null : dto.ikon,
      aciklama: dto.aciklama === '' ? null : dto.aciklama,
      kategori: dto.kategori === '' ? null : dto.kategori,
      hedef: dto.hedef === '' ? '_self' : dto.hedef,
      sira: dto.sira,
      aktif: dto.aktif,
      sabit: dto.sabit,
      kisayol:
        kisayolId !== undefined
          ? kisayolId
            ? { connect: { id: kisayolId } }
            : { disconnect: true }
          : undefined,
      ekAyarlarJson:
        dto.ekAyarlarJson !== undefined ? (dto.ekAyarlarJson as Prisma.InputJsonValue) : undefined,
    });
  }

  async sil(siteId: number, idHam: string | number) {
    const id = sayisalId(idHam);
    const mevcut = await sekmeRepo.findByIdAndSiteId(id, siteId);
    if (!mevcut) throw new Error('Sekme bulunamadi');
    await sekmeRepo.deleteForSite(id, siteId);
  }
}
