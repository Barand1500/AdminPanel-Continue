import { adminHeaders, adminJsonFetch } from './adminFetch';

export type RolKodu = string;

export interface AdminKullanici {
  id: string;
  email: string;
  ad: string;
  rol: RolKodu;
  siteId: string | null;
  aktif: boolean;
  olusturma: string;
  guncelleme: string;
  siteAd: string | null;
  siteSlug: string | null;
}

export interface AdminSiteOzet {
  id: string;
  ad: string;
  slug: string;
}

export interface KullaniciFormDegeri {
  email: string;
  ad: string;
  sifre: string;
  rol: RolKodu;
  siteId: string;
  aktif: boolean;
}

export async function adminKullanicilariGetir(): Promise<AdminKullanici[]> {
  const veri = await adminJsonFetch<{ kullanicilar: AdminKullanici[] }>('/kullanicilar', {
    headers: adminHeaders(),
  });
  return veri.kullanicilar;
}

export async function adminKullaniciSiteleriGetir(): Promise<AdminSiteOzet[]> {
  const veri = await adminJsonFetch<{ siteler: AdminSiteOzet[] }>('/kullanicilar/siteler', {
    headers: adminHeaders(),
  });
  return veri.siteler;
}

export async function adminKullaniciOlustur(form: KullaniciFormDegeri): Promise<AdminKullanici> {
  const veri = await adminJsonFetch<{ kullanici: AdminKullanici }>('/kullanicilar', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form, true)),
  });
  return veri.kullanici;
}

export async function adminKullaniciGuncelle(
  id: string,
  form: KullaniciFormDegeri,
  sifreDegisti: boolean
): Promise<AdminKullanici> {
  const veri = await adminJsonFetch<{ kullanici: AdminKullanici }>(`/kullanicilar/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form, sifreDegisti)),
  });
  return veri.kullanici;
}

export async function adminKullaniciSil(id: string): Promise<void> {
  await adminJsonFetch(`/kullanicilar/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export const VARSAYILAN_ROL_ETIKETLERI: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  AJANS_ADMIN: 'Ajans Admin',
  MUSTERI_ADMIN: 'Musteri Admin',
  EDITOR: 'Editor',
  SEO_EDITOR: 'SEO Editoru',
  GORUNTULEME: 'Sadece Goruntuleme',
};

function payloadHazirla(form: KullaniciFormDegeri, sifreDahil: boolean) {
  const payload: Record<string, unknown> = {
    email: form.email.trim(),
    ad: form.ad.trim(),
    rol: form.rol,
    aktif: form.aktif,
    siteId: form.siteId || null,
  };
  if (sifreDahil && form.sifre.trim()) {
    payload.sifre = form.sifre;
  }
  return payload;
}
