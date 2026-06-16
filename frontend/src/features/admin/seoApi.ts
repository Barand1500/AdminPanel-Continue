import { adminHeaders, adminJsonFetch } from './adminFetch';

export type SeoKayitTipi = 'kategori' | 'marka' | 'firsat' | 'urun' | 'sayfa';

export interface SeoKayit {
  id: string;
  etiket: string;
  url: string;
  seoTitle: string | null;
  seoDesc: string | null;
  tip: SeoKayitTipi;
  parentId?: string | null;
  slug?: string;
}

export interface SeoOzet {
  genel: {
    seoBaslik: string | null;
    seoAciklama: string | null;
    seoAnahtar: string | null;
    ogGorselUrl: string | null;
  };
  kategoriler: {
    id: string;
    ad: string;
    slug: string;
    parentId: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
  }[];
  markalar: {
    id: string;
    ad: string;
    slug: string;
    seoTitle: string | null;
    seoDesc: string | null;
  }[];
  firsatlar: {
    id: string;
    ad: string;
    slug: string;
    seoTitle: string | null;
    seoDesc: string | null;
  }[];
  sayfalar: {
    id: string;
    baslik: string;
    slug: string;
    seoTitle: string | null;
    seoDesc: string | null;
  }[];
  urunler: {
    id: string;
    ad: string;
    slug: string;
    seoTitle: string | null;
    seoDesc: string | null;
  }[];
}

export interface SeoGenelForm {
  seoBaslik: string;
  seoAciklama: string;
  seoAnahtar: string;
  ogGorselUrl: string;
}

function metaBody(seoTitle: string, seoDesc: string) {
  return {
    seoTitle: seoTitle.trim() || null,
    seoDesc: seoDesc.trim() || null,
  };
}

export async function seoOzetGetir(): Promise<SeoOzet> {
  return adminJsonFetch<SeoOzet>('/seo', { headers: adminHeaders() });
}

export async function seoGenelGuncelle(form: SeoGenelForm) {
  return adminJsonFetch('/seo/genel', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({
      seoBaslik: form.seoBaslik.trim() || null,
      seoAciklama: form.seoAciklama.trim() || null,
      seoAnahtar: form.seoAnahtar.trim() || null,
      ogGorselUrl: form.ogGorselUrl.trim() || null,
    }),
  });
}

export async function seoSayfaGuncelle(id: string, seoTitle: string, seoDesc: string) {
  return adminJsonFetch(`/seo/sayfa/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(metaBody(seoTitle, seoDesc)),
  });
}

export async function seoUrunGuncelle(id: string, seoTitle: string, seoDesc: string) {
  return adminJsonFetch(`/seo/urun/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(metaBody(seoTitle, seoDesc)),
  });
}

export async function seoKategoriGuncelle(id: string, seoTitle: string, seoDesc: string) {
  return adminJsonFetch(`/seo/kategori/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(metaBody(seoTitle, seoDesc)),
  });
}

export async function seoMarkaGuncelle(id: string, seoTitle: string, seoDesc: string) {
  return adminJsonFetch(`/seo/marka/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(metaBody(seoTitle, seoDesc)),
  });
}

export async function seoFirsatGuncelle(id: string, seoTitle: string, seoDesc: string) {
  return adminJsonFetch(`/seo/firsat/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(metaBody(seoTitle, seoDesc)),
  });
}

export async function seoKayitGuncelle(
  tip: SeoKayitTipi,
  id: string,
  seoTitle: string,
  seoDesc: string
) {
  switch (tip) {
    case 'sayfa':
      return seoSayfaGuncelle(id, seoTitle, seoDesc);
    case 'urun':
      return seoUrunGuncelle(id, seoTitle, seoDesc);
    case 'kategori':
      return seoKategoriGuncelle(id, seoTitle, seoDesc);
    case 'marka':
      return seoMarkaGuncelle(id, seoTitle, seoDesc);
    case 'firsat':
      return seoFirsatGuncelle(id, seoTitle, seoDesc);
  }
}

export function kategoriUrlOlustur(
  kategori: { slug: string; parentId: string | null },
  tumKategoriler: { id: string; slug: string; parentId: string | null }[]
): string {
  const parcalar: string[] = [kategori.slug];
  let parentId = kategori.parentId;
  while (parentId) {
    const parent = tumKategoriler.find((k) => k.id === parentId);
    if (!parent) break;
    parcalar.unshift(parent.slug);
    parentId = parent.parentId;
  }
  return `/${parcalar.join('/')}`;
}
