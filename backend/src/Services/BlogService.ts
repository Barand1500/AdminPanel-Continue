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
}
