import type { Prisma } from '@prisma/client';
import type { GorevGuncelleDto, GorevOlusturDto } from '../Application/DTOs/GorevDto.js';
import { GorevRepository } from '../Infrastructure/repositories/GorevRepository.js';
import { sayisalId } from '../Infrastructure/utils/sayisalId.js';

const gorevRepo = new GorevRepository();

function tarihDonustur(deger: string | null | undefined): Date | null {
  if (deger === null || deger === undefined) return null;
  const tarih = /^\d{4}-\d{2}-\d{2}$/.test(deger)
    ? new Date(`${deger}T00:00:00.000Z`)
    : new Date(deger);
  if (Number.isNaN(tarih.getTime())) throw new Error('Gecerli bir tarih girin');
  return tarih;
}

function tarihAraliginiDogrula(baslangic: Date | null, bitis: Date | null) {
  if (baslangic && bitis && baslangic.getTime() > bitis.getTime()) {
    throw new Error('Bitis tarihi baslangic tarihinden once olamaz');
  }
}

export class GorevService {
  async listele(kullaniciId: number, siteId: number) {
    return gorevRepo.findByOwner(kullaniciId, siteId);
  }

  async olustur(kullaniciId: number, siteId: number, dto: GorevOlusturDto) {
    const baslangicTarihi = tarihDonustur(dto.tarih);
    const bitisTarihi = tarihDonustur(dto.tarihBitis);
    tarihAraliginiDogrula(baslangicTarihi, bitisTarihi);

    return gorevRepo.createForOwner(kullaniciId, siteId, {
      baslik: dto.metin.trim(),
      tamamlandi: dto.tamamlandi ?? false,
      onemli: dto.onemli ?? false,
      baslangicTarihi,
      bitisTarihi,
    });
  }

  async guncelle(
    kullaniciId: number,
    siteId: number,
    idHam: string | number,
    dto: GorevGuncelleDto,
  ) {
    const id = sayisalId(idHam);
    const mevcut = await gorevRepo.findByIdAndOwner(id, kullaniciId, siteId);
    if (!mevcut) throw new Error('Gorev bulunamadi');

    const baslangicTarihi = dto.tarih !== undefined ? tarihDonustur(dto.tarih) : mevcut.baslangicTarihi;
    const bitisTarihi = dto.tarihBitis !== undefined ? tarihDonustur(dto.tarihBitis) : mevcut.bitisTarihi;
    tarihAraliginiDogrula(baslangicTarihi, bitisTarihi);

    const gorev = await gorevRepo.updateForOwner(id, kullaniciId, siteId, {
      baslik: dto.metin?.trim(),
      tamamlandi: dto.tamamlandi,
      onemli: dto.onemli,
      baslangicTarihi: dto.tarih !== undefined ? baslangicTarihi : undefined,
      bitisTarihi: dto.tarihBitis !== undefined ? bitisTarihi : undefined,
    } satisfies Prisma.AdminGorevUpdateManyMutationInput);
    if (!gorev) throw new Error('Gorev bulunamadi');
    return gorev;
  }

  async sil(kullaniciId: number, siteId: number, idHam: string | number) {
    const id = sayisalId(idHam);
    const silindi = await gorevRepo.deleteForOwner(id, kullaniciId, siteId);
    if (!silindi) throw new Error('Gorev bulunamadi');
  }
}
