import { adminHeaders, adminJsonFetch } from './adminFetch';
import { idString } from '@/utils/idKarsilastir';
import type { NavKategoriFormDegeri, NavKategoriKayit } from '@/types/navKategori';

export async function navKategorileriGetir(): Promise<NavKategoriKayit[]> {
  const veri = await adminJsonFetch<{ kategoriler: NavKategoriKayit[] }>('/nav-kategoriler', {
    headers: adminHeaders(),
  });
  return veri.kategoriler.map(normalize);
}

export async function navKategoriOlustur(form: NavKategoriFormDegeri): Promise<NavKategoriKayit> {
  const veri = await adminJsonFetch<{ kategori: NavKategoriKayit }>('/nav-kategoriler', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload(form)),
  });
  return normalize(veri.kategori);
}

export async function navKategoriGuncelle(
  id: string,
  form: NavKategoriFormDegeri
): Promise<NavKategoriKayit> {
  const veri = await adminJsonFetch<{ kategori: NavKategoriKayit }>(`/nav-kategoriler/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload(form)),
  });
  return normalize(veri.kategori);
}

export async function navKategoriSil(id: string): Promise<void> {
  await adminJsonFetch(`/nav-kategoriler/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function normalize(k: NavKategoriKayit): NavKategoriKayit {
  return {
    ...k,
    id: idString(k.id),
    ustKategoriId: k.ustKategoriId != null ? idString(k.ustKategoriId) : null,
  };
}

function payload(form: NavKategoriFormDegeri) {
  return {
    baslik: form.baslik.trim(),
    slug: form.slug.trim() || undefined,
    yol: form.yol.trim() || null,
    gorselUrl: form.gorselUrl.trim() || null,
    ikon: form.ikon.trim() || null,
    aktif: form.aktif,
    sira: form.sira,
    ustKategoriId: form.ustKategoriId ? Number(form.ustKategoriId) : null,
  };
}
