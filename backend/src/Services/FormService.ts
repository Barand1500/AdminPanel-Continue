import type { FormGuncelleDto, FormOlusturDto } from '../Application/DTOs/FormDto.js';
import { FormRepository } from '../Infrastructure/repositories/FormRepository.js';

const formRepo = new FormRepository();

function slugOlustur(ad: string) {
  return ad
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export class FormService {
  async listeleAdmin(siteId: number) {
    return formRepo.findAdminBySiteId(siteId);
  }

  async detay(siteId: number, formId: number) {
    const form = await formRepo.findByIdAndSiteId(formId, siteId);
    if (!form) throw new Error('Form bulunamadi');
    return form;
  }

  async olustur(siteId: number, dto: FormOlusturDto) {
    const slug = dto.slug ?? slugOlustur(dto.ad);
    return formRepo.createForSite(siteId, {
      ad: dto.ad,
      slug,
      aciklama: dto.aciklama,
      alanlarJson: dto.alanlarJson,
      ayarlarJson: dto.ayarlarJson ?? undefined,
      aktif: dto.aktif,
      bildirimEmail: dto.bildirimEmail === '' ? null : dto.bildirimEmail,
    });
  }

  async guncelle(siteId: number, formId: number, dto: FormGuncelleDto) {
    const mevcut = await formRepo.findByIdAndSiteId(formId, siteId);
    if (!mevcut) throw new Error('Form bulunamadi');

    return formRepo.updateForSite(formId, {
      ad: dto.ad,
      slug: dto.slug ?? (dto.ad ? slugOlustur(dto.ad) : undefined),
      aciklama: dto.aciklama,
      alanlarJson: dto.alanlarJson,
      ayarlarJson: dto.ayarlarJson,
      aktif: dto.aktif,
      bildirimEmail: dto.bildirimEmail === '' ? null : dto.bildirimEmail,
    });
  }

  async sil(siteId: number, formId: number) {
    const mevcut = await formRepo.findByIdAndSiteId(formId, siteId);
    if (!mevcut) throw new Error('Form bulunamadi');
    await formRepo.deleteForSite(formId, siteId);
  }

  async gonderimleriGetir(siteId: number, formId: number) {
    const liste = await formRepo.gonderimleriGetir(formId, siteId);
    if (!liste) throw new Error('Form bulunamadi');
    return liste;
  }

  async gonderimOkundu(siteId: number, formId: number, gonderimId: number) {
    const form = await formRepo.findByIdAndSiteId(formId, siteId);
    if (!form) throw new Error('Form bulunamadi');
    await formRepo.gonderimOkundu(gonderimId, formId);
  }

  async gonderimSil(siteId: number, formId: number, gonderimId: number) {
    const form = await formRepo.findByIdAndSiteId(formId, siteId);
    if (!form) throw new Error('Form bulunamadi');
    await formRepo.gonderimSil(gonderimId, formId);
  }
}
