import type { BlogGuncelleDto, BlogOlusturDto } from '../Application/DTOs/BlogDto.js';
import { BlogRepository } from '../Infrastructure/repositories/BlogRepository.js';

const blogRepo = new BlogRepository();

function slugOlustur(baslik: string) {
  return baslik
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function linktenSlug(link?: string | null): string | null {
  if (!link?.trim()) return null;
  const temiz = link
    .trim()
    .toLowerCase()
    .replace(/^\/blog\//, '')
    .replace(/^#+$/, '');
  if (!temiz) return null;
  return temiz.replace(/[^a-z0-9-]/g, '');
}

interface KaruselBlogKart {
  id?: string;
  baslik?: string;
  gorselUrl?: string;
  link?: string;
  ozet?: string;
  kategori?: string;
}

export class BlogService {
  async listeleAdmin(siteId: number) {
    return blogRepo.findAdminBySiteId(siteId);
  }

  async listelePublic(siteId: number) {
    const bloglar = await blogRepo.findPublicBySiteId(siteId);
    return bloglar.map((b) => ({
      ...b,
      olusturma: b.olusturma.toISOString(),
    }));
  }

  async getBySlugPublic(siteId: number, slug: string) {
    const blog = await blogRepo.findPublicBySlug(siteId, slug);
    if (!blog) return null;
    return {
      ...blog,
      olusturma: blog.olusturma.toISOString(),
      guncelleme: blog.guncelleme.toISOString(),
    };
  }

  async olustur(siteId: number, dto: BlogOlusturDto) {
    const slug = dto.slug ?? slugOlustur(dto.baslik);
    return blogRepo.createForSite(siteId, {
      baslik: dto.baslik,
      slug,
      ozet: dto.ozet,
      icerik: dto.icerik ?? '',
      kapakGorsel: dto.kapakGorsel,
      yazar: dto.yazar,
      kategori: dto.kategori,
      yayinda: dto.yayinda,
      oneCikan: dto.oneCikan,
      seoTitle: dto.seoTitle,
      seoDesc: dto.seoDesc,
    });
  }

  async guncelle(siteId: number, blogId: number, dto: BlogGuncelleDto) {
    const mevcut = await blogRepo.findByIdAndSiteId(blogId, siteId);
    if (!mevcut) throw new Error('Blog yazisi bulunamadi');

    return blogRepo.updateForSite(blogId, {
      baslik: dto.baslik,
      slug: dto.slug ?? (dto.baslik ? slugOlustur(dto.baslik) : undefined),
      ozet: dto.ozet,
      icerik: dto.icerik,
      kapakGorsel: dto.kapakGorsel,
      yazar: dto.yazar,
      kategori: dto.kategori,
      yayinda: dto.yayinda,
      oneCikan: dto.oneCikan,
      seoTitle: dto.seoTitle,
      seoDesc: dto.seoDesc,
    });
  }

  async sil(siteId: number, blogId: number) {
    const mevcut = await blogRepo.findByIdAndSiteId(blogId, siteId);
    if (!mevcut) throw new Error('Blog yazisi bulunamadi');
    await blogRepo.deleteForSite(blogId, siteId);
  }

  /** Blog karusel widget kartlarını Blog & Haberler modülüne yazar (upsert). */
  async karuselKartlariniSenkronizeEt(siteId: number, kartlar: KaruselBlogKart[]) {
    for (const kart of kartlar) {
      const baslik = kart.baslik?.trim();
      if (!baslik) continue;

      const slug = linktenSlug(kart.link) ?? slugOlustur(baslik);
      if (!slug) continue;

      const mevcut = await blogRepo.findBySlugAndSiteId(siteId, slug);
      const veri = {
        baslik,
        slug,
        ozet: kart.ozet?.trim() || baslik,
        icerik: kart.ozet?.trim()
          ? `<p>${kart.ozet.trim()}</p>`
          : `<p>${baslik}</p>`,
        kapakGorsel: kart.gorselUrl?.trim() || null,
        kategori: kart.kategori?.trim() || null,
        yayinda: true,
      };

      if (mevcut) {
        await blogRepo.updateForSite(mevcut.id, veri);
      } else {
        await blogRepo.createForSite(siteId, veri);
      }
    }
  }
}
