import type { Prisma } from '@prisma/client';
import type { NavKategoriGuncelleDto, NavKategoriOlusturDto } from '../Application/DTOs/NavKategoriDto.js';
import { NavKategoriRepository } from '../Infrastructure/repositories/NavKategoriRepository.js';

const repo = new NavKategoriRepository();

function slugOlustur(baslik: string) {
  return baslik
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export class NavKategoriService {
  async listeleAdmin(siteId: number) {
    return repo.findAdminBySiteId(siteId);
  }

  async listelePublic(siteId: number) {
    return repo.findPublicBySiteId(siteId);
  }

  private async derinlik(siteId: number, ustKategoriId: number | null): Promise<number> {
    if (!ustKategoriId) return 0;
    const ust = await repo.findByIdAndSiteId(ustKategoriId, siteId);
    if (!ust) throw new Error('Ust kategori bulunamadi');
    if (!ust.ustKategoriId) return 1;
    return 1 + (await this.derinlik(siteId, ust.ustKategoriId));
  }

  private async donguKontrol(siteId: number, kategoriId: number, hedefUstId: number) {
    let current: number | null = hedefUstId;
    while (current != null) {
      if (current === kategoriId) throw new Error('Kategori kendi alt agacina tasinamaz');
      const kayit = await repo.findByIdAndSiteId(current, siteId);
      if (!kayit) break;
      current = kayit.ustKategoriId ?? null;
    }
  }

  async olustur(siteId: number, dto: NavKategoriOlusturDto) {
    const ustKategoriId = dto.ustKategoriId ?? null;
    if (ustKategoriId != null) {
      const derinlik = await this.derinlik(siteId, ustKategoriId);
      if (derinlik >= 2) throw new Error('En fazla 3 seviye kategori olusturulabilir');
    }

    const slug = dto.slug?.trim() || slugOlustur(dto.baslik);
    const mevcut = await repo.findBySlug(siteId, slug);
    if (mevcut) throw new Error('Bu slug zaten kullaniliyor');

    const yol = dto.yol?.trim() || `/urunler?k=${encodeURIComponent(slug)}`;

    return repo.createForSite(siteId, {
      baslik: dto.baslik.trim(),
      slug,
      yol,
      gorselUrl: dto.gorselUrl ?? null,
      ikon: dto.ikon ?? null,
      aktif: dto.aktif ?? true,
      sira: dto.sira ?? 0,
      ustKategoriId,
    });
  }

  async guncelle(siteId: number, kategoriId: number, dto: NavKategoriGuncelleDto) {
    const mevcut = await repo.findByIdAndSiteId(kategoriId, siteId);
    if (!mevcut) throw new Error('Kategori bulunamadi');

    const data: Prisma.NavKategoriUpdateInput = {};

    if (dto.ustKategoriId !== undefined) {
      if (dto.ustKategoriId === kategoriId) throw new Error('Kategori kendi ust kategorisi olamaz');
      if (dto.ustKategoriId != null) {
        await this.donguKontrol(siteId, kategoriId, dto.ustKategoriId);
        const derinlik = await this.derinlik(siteId, dto.ustKategoriId);
        if (derinlik >= 2) throw new Error('En fazla 3 seviye kategori olusturulabilir');
        data.ustKategori = { connect: { id: dto.ustKategoriId } };
      } else {
        data.ustKategori = { disconnect: true };
      }
    }

    if (dto.baslik !== undefined) data.baslik = dto.baslik.trim();
    if (dto.slug !== undefined) {
      const slug = dto.slug.trim() || slugOlustur(dto.baslik ?? mevcut.baslik);
      const cakisan = await repo.findBySlug(siteId, slug);
      if (cakisan && cakisan.id !== kategoriId) throw new Error('Bu slug zaten kullaniliyor');
      data.slug = slug;
    }
    if (dto.yol !== undefined) data.yol = dto.yol?.trim() || null;
    if (dto.gorselUrl !== undefined) data.gorselUrl = dto.gorselUrl;
    if (dto.ikon !== undefined) data.ikon = dto.ikon;
    if (dto.aktif !== undefined) data.aktif = dto.aktif;
    if (dto.sira !== undefined) data.sira = dto.sira;

    return repo.updateForSite(kategoriId, data);
  }

  async sil(siteId: number, kategoriId: number) {
    const mevcut = await repo.findByIdAndSiteId(kategoriId, siteId);
    if (!mevcut) throw new Error('Kategori bulunamadi');
    const altSayi = await repo.countChildren(siteId, kategoriId);
    if (altSayi > 0) throw new Error('Alt kategorileri olan bir kategori silinemez');
    await repo.deleteForSite(kategoriId, siteId);
  }
}
