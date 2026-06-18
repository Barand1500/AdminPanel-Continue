import type { Prisma } from '@prisma/client';
import type { MenuGuncelleDto, SayfaGuncelleDto, SayfaOlusturDto, SayfaTasiDto } from '../Application/DTOs/SayfaDto.js';
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
      ikon: dto.ikon ?? null,
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
      await this.donguKontrol(siteId, sayfaId, dto.ustSayfaId);
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
    if (dto.ikon !== undefined) data.ikon = dto.ikon;
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

  private async donguKontrol(siteId: number, sayfaId: number, hedefUstId: number) {
    let current: number | null = hedefUstId;
    while (current != null) {
      if (current === sayfaId) throw new Error('Sayfa kendi alt agacina tasinamaz');
      const kayit = await sayfaRepo.findByIdAndSiteId(current, siteId);
      if (!kayit) break;
      current = kayit.ustSayfaId ?? null;
    }
  }

  async tasi(siteId: number, sayfaId: number, dto: SayfaTasiDto) {
    const mevcut = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!mevcut) throw new Error('Sayfa bulunamadi');

    const yeniUstId = dto.ustSayfaId ?? null;
    if (yeniUstId === sayfaId) throw new Error('Sayfa kendi ust sayfasi olamaz');

    if (yeniUstId != null) {
      await this.donguKontrol(siteId, sayfaId, yeniUstId);
    }

    let ustSlug: string | null = null;
    if (yeniUstId != null) {
      const ust = await sayfaRepo.findByIdAndSiteId(yeniUstId, siteId);
      if (!ust) throw new Error('Ust sayfa bulunamadi');
      if (ust.slug === mevcut.slug || ust.slug.startsWith(`${mevcut.slug}/`)) {
        throw new Error('Gecersiz ust sayfa secimi');
      }
      ustSlug = ust.slug;
    }

    const eskiSlug = mevcut.slug;
    const segment = slugSegmenti(mevcut.slug);
    const yeniSlug = tamSlugOlustur(ustSlug, segment);

    const cakisan = await sayfaRepo.findBySlugKayit(siteId, yeniSlug);
    if (cakisan && cakisan.id !== sayfaId) throw new Error('Bu slug zaten kullaniliyor');

    let yeniSira = dto.sira;
    if (yeniSira === undefined && dto.hedefSayfaId != null) {
      const hedef = await sayfaRepo.findByIdAndSiteId(dto.hedefSayfaId, siteId);
      if (hedef) {
        if (dto.konum === 'once') yeniSira = hedef.sira;
        else if (dto.konum === 'sonra') yeniSira = hedef.sira + 1;
        else yeniSira = hedef.sira;
      }
    }
    if (yeniSira === undefined) {
      const tum = await sayfaRepo.findAdminBySiteId(siteId);
      const kardesler = tum.filter((s) => (s.ustSayfaId ?? null) === yeniUstId && s.id !== sayfaId);
      yeniSira =
        kardesler.length > 0 ? Math.max(...kardesler.map((s) => s.sira)) + 1 : 0;
    }

    const data: Prisma.SayfaUpdateInput = { slug: yeniSlug, sira: yeniSira };
    if (yeniUstId == null) {
      data.ustSayfa = { disconnect: true };
    } else {
      data.ustSayfa = { connect: { id: yeniUstId } };
    }

    await sayfaRepo.updateForSite(sayfaId, data);
    if (yeniSlug !== eskiSlug) {
      await this.altSluglariGuncelle(siteId, eskiSlug, yeniSlug);
    }

    const guncel = await sayfaRepo.findByIdAndSiteId(sayfaId, siteId);
    if (!guncel) throw new Error('Sayfa bulunamadi');
    return guncel;
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
