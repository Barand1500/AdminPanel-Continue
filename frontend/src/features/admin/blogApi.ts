import { adminHeaders, adminJsonFetch } from './adminFetch';

export interface AdminBlog {
  id: string;
  baslik: string;
  slug: string;
  ozet?: string | null;
  icerik: string;
  kapakGorsel?: string | null;
  yazar?: string | null;
  kategori?: string | null;
  yayinda: boolean;
  oneCikan: boolean;
  seoTitle?: string | null;
  seoDesc?: string | null;
  olusturma: string;
  guncelleme: string;
}

export interface BlogFormDegeri {
  baslik: string;
  slug: string;
  ozet: string;
  icerik: string;
  kapakGorsel: string;
  yazar: string;
  kategori: string;
  yayinda: boolean;
  oneCikan: boolean;
  seoTitle: string;
  seoDesc: string;
}

export async function adminBloglariGetir(): Promise<AdminBlog[]> {
  const veri = await adminJsonFetch<{ bloglar: AdminBlog[] }>('/blog', { headers: adminHeaders() });
  return veri.bloglar;
}

export async function adminBlogOlustur(form: BlogFormDegeri): Promise<AdminBlog> {
  const veri = await adminJsonFetch<{ blog: AdminBlog }>('/blog', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  return veri.blog;
}

export async function adminBlogGuncelle(id: string, form: BlogFormDegeri): Promise<AdminBlog> {
  const veri = await adminJsonFetch<{ blog: AdminBlog }>(`/blog/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  return veri.blog;
}

export async function adminBlogSil(id: string): Promise<void> {
  await adminJsonFetch(`/blog/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function payloadHazirla(form: BlogFormDegeri) {
  return {
    baslik: form.baslik.trim(),
    slug: form.slug.trim() || undefined,
    ozet: form.ozet.trim() || null,
    icerik: form.icerik,
    kapakGorsel: form.kapakGorsel.trim() || null,
    yazar: form.yazar.trim() || null,
    kategori: form.kategori.trim() || null,
    yayinda: form.yayinda,
    oneCikan: form.oneCikan,
    seoTitle: form.seoTitle.trim() || null,
    seoDesc: form.seoDesc.trim() || null,
  };
}
