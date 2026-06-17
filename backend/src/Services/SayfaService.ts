import type { Prisma } from '@prisma/client';
import type { MenuGuncelleDto, SayfaGuncelleDto, SayfaOlusturDto } from '../Application/DTOs/SayfaDto.js';
import { SayfaRepository } from '../Infrastructure/repositories/SayfaRepository.js';
import { sayisalId } from '../Infrastructure/utils/sayisalId.js';

const sayfaRepo = new SayfaRepository();

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

function slugTemizle(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

function slugSegmenti(slug?: string) {
  if (!slug) return '';
  const parcalar = slugTemizle(slug).split('/').filter(Boolean);
  return parcalar[parcalar.length - 1] ?? slugTemizle(slug);
}

function tamSlugOlustur(ustSlug: string | null | undefined, segment: string) {
  const seg = slugOlustur(segment);
  if (!ustSlug) return seg;
  return `${ustSlug.replace(/\/+$/g, '')}/${seg}`;
}

function ustSlugYolu(slug: string): string | null {
  const parcalar = slugTemizle(slug).split('/').filter(Boolean);
  if (parcalar.length < 2) return null;
  return parcalar.slice(0, -1).join('/');
}

export class SayfaService {
  async listeleAdmin(siteId: number) {
    await this.hiyerarsiOnar(siteId);
    return sayfaRepo.findAdminBySiteId(siteId);
  }

  /** Slug yolundan eksik ustSayfaId baglantilarini tamamlar. */
  async hiyerarsiOnar(siteId: number) {
    const sayfalar = await sayfaRepo.findAdminBySiteId(siteId);
    for (const s of sayfalar) {
      if (s.ustSayfaId != null) continue;
      const ustSlug = ustSlugYolu(s.slug);
      if (!ustSlug) continue;
      const ust = await sayfaRepo.findBySlugKayit(siteId, ustSlug);
      if (!ust || ust.id === s.id) continue;
      await sayfaRepo.updateForSite(s.id, { ustSayfa: { connect: { id: ust.id } } });
    }
  }

  private async ustSayfaIdSlugdanCoz(
    siteId: number,
    slug: string,
    haricId?: number
  ): Promise<number | null> {
    const ustSlug = ustSlugYolu(slug);
    if (!ustSlug) return null;
    const ust = await sayfaRepo.findBySlugKayit(siteId, ustSlug);
    if (!ust || ust.id === haricId) return null;
    return ust.id;
  }

  async olustur(siteId: number, dto: SayfaOlusturDto) {
    let ustSayfaId = dto.ustSayfaId ?? null;
    let ustSlug: string | null = null;

    if (ustSayfaId != null) {
      const ust = await sayfaRepo.findByIdAndSiteId(ustSayfaId, siteId);
      if (!ust) throw new Error('Ust sayfa bulunamadi');
      ustSlug = ust.slug;
    } else if (dto.slug?.includes('/')) {
      ustSayfaId = await this.ustSayfaIdSlugdanCoz(siteId, dto.slug);
      if (ustSayfaId != null) {
        const ust = await sayfaRepo.findByIdAndSiteId(ustSayfaId, siteId);
        ustSlug = ust?.slug ?? null;
      }
    }

    const segment = dto.slug ? slugSegmenti(dto.slug) : slugOlustur(dto.baslik);
    const slug = tamSlugOlustur(ustSlug, segment);

    if (ustSayfaId == null) {
      ustSayfaId = await this.ustSayfaIdSlugdanCoz(siteId, slug);
    }

    const mevcut = await sayfaRepo.findBySlugKayit(siteId, slug);
    if (mevcut) throw new Error('Bu slug zaten kullaniliyor');

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
      ustSayfaId,
      altMenuGorunum: dto.altMenuGorunum ?? 'dikey',
      altMenuTetikleyici: dto.altMenuTetikleyici ?? 'hover',
    });
  }

  async guncelle(siteId: number, sayfaId: number, dto: SayfaGuncelleDto) {
    const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!mevcut) throw new Error('Sayfa bulunamadi');

    if (dto.ustSayfaId !== undefined && dto.ustSayfaId != null) {
      if (dto.ustSayfaId === sayfaId) throw new Error('Sayfa kendi ust sayfasi olamaz');
      await this.ustSayfaDogrula(siteId, dto.ustSayfaId, sayfaId);
    }

    const data: Prisma.SayfaUpdateInput = {};
    if (dto.baslik !== undefined) data.baslik = dto.baslik;

    let yeniSlug = mevcut.slug;
    let ustSayfaId =
      dto.ustSayfaId !== undefined ? dto.ustSayfaId : (mevcut.ustSayfaId ?? null);

    if (dto.ustSayfaId !== undefined) {
      if (dto.ustSayfaId === sayfaId) throw new Error('Sayfa kendi ust sayfasi olamaz');
      ustSayfaId = dto.ustSayfaId;
      if (dto.ustSayfaId == null) {
        data.ustSayfa = { disconnect: true };
      }
    }

    let ustSlug: string | null = null;
    if (ustSayfaId != null) {
      const ust = await sayfaRepo.findByIdAndSiteId(ustSayfaId, siteId);
      if (!ust) throw new Error('Ust sayfa bulunamadi');
      if (ust.slug === mevcut.slug || ust.slug.startsWith(`${mevcut.slug}/`)) {
        throw new Error('Gecersiz ust sayfa secimi');
      }
      ustSlug = ust.slug;
      data.ustSayfa = { connect: { id: ustSayfaId } };
    }

    if (dto.slug !== undefined || dto.ustSayfaId !== undefined) {
      const segment =
        dto.slug !== undefined
          ? slugSegmenti(dto.slug)
          : dto.baslik
            ? slugOlustur(dto.baslik)
            : slugSegmenti(mevcut.slug);
      yeniSlug = tamSlugOlustur(ustSlug, segment || slugSegmenti(mevcut.slug));

      const cakisan = await sayfaRepo.findBySlugKayit(siteId, yeniSlug);
      if (cakisan && cakisan.id !== sayfaId) throw new Error('Bu slug zaten kullaniliyor');

      data.slug = yeniSlug;
    }

    if (ustSayfaId == null && dto.ustSayfaId !== null && yeniSlug.includes('/')) {
      const inferred = await this.ustSayfaIdSlugdanCoz(siteId, yeniSlug, sayfaId);
      if (inferred != null) {
        data.ustSayfa = { connect: { id: inferred } };
      }
    }

    if (dto.icerik !== undefined) data.icerik = dto.icerik;
    if (dto.kapakGorsel !== undefined) data.kapakGorsel = dto.kapakGorsel;
    if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle;
    if (dto.seoDesc !== undefined) data.seoDesc = dto.seoDesc;
    if (dto.yayinda !== undefined) data.yayinda = dto.yayinda;
    if (dto.menudeGoster !== undefined) data.menudeGoster = dto.menudeGoster;
    if (dto.sira !== undefined) data.sira = dto.sira;
    if (dto.acilisModu !== undefined) data.acilisModu = dto.acilisModu;
    if (dto.altMenuGorunum !== undefined) data.altMenuGorunum = dto.altMenuGorunum;
    if (dto.altMenuTetikleyici !== undefined) data.altMenuTetikleyici = dto.altMenuTetikleyici;

    const guncellenen = await sayfaRepo.updateForSite(sayfaId, data);

    if (yeniSlug !== mevcut.slug) {
      await this.altSluglariGuncelle(siteId, mevcut.slug, yeniSlug);
    }

    return guncellenen;
  }

  private async altSluglariGuncelle(siteId: number, eskiPrefix: string, yeniPrefix: string) {
    const tum = await sayfaRepo.findAdminBySiteId(siteId);
    for (const s of tum) {
      if (s.id && s.slug.startsWith(`${eskiPrefix}/`)) {
        const yeni = s.slug.replace(eskiPrefix, yeniPrefix);
        await sayfaRepo.updateForSite(s.id, { slug: yeni });
      }
    }
  }

  private async ustSayfaDogrula(siteId: number, ustSayfaId: number, sayfaId?: number) {
    const ust = await sayfaRepo.findByIdAndSiteId(ustSayfaId, siteId);
    if (!ust) throw new Error('Ust sayfa bulunamadi');
    const ustKayit = ust as typeof ust & { ustSayfaId?: number | null };
    if (ustKayit.ustSayfaId != null) throw new Error('Alt sayfa baska bir alt sayfanin altina eklenemez');
    if (sayfaId != null) {
      const altSayfaVar = await sayfaRepo.altSayfaVarMi(sayfaId, siteId);
      if (altSayfaVar) throw new Error('Alt sayfalari olan bir sayfa baska sayfanin altina tasinamaz');
    }
  }

  async sil(siteId: number, sayfaId: number) {
    const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!mevcut) throw new Error('Sayfa bulunamadi');

    const altSayi = await sayfaRepo.countChildren(siteId, sayfaId);
    if (altSayi > 0) throw new Error('Alt sayfalari olan bir sayfa silinemez');

    await sayfaRepo.deleteForSite(sayfaId, siteId);
  }

  async menuGuncelle(siteId: number, dto: MenuGuncelleDto) {
    for (const oge of dto.ogeler) {
      const id = sayisalId(oge.id);
      const kayit = await sayfaRepo.findByIdAndSiteId(id, siteId);
      if (!kayit) continue;
      await sayfaRepo.updateForSite(id, {
        sira: oge.sira,
        menudeGoster: oge.menudeGoster,
      });
    }
    return sayfaRepo.findAdminBySiteId(siteId);
  }
}
