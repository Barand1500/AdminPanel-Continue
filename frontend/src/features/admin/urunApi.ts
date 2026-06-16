import type { Urun } from '@/types/site';
import type { GorunumTipi, OzellikDegeri } from '@/types/urunYonetimi';
import { adminHeaders, adminJsonFetch } from './adminFetch';

export interface AdminUrun extends Urun {
  kategoriId?: string | null;
  markaId?: string | null;
  rozetIds?: string[];
  gorunumTipi?: GorunumTipi;
  gorseller?: string[];
  ozellikDegerleri?: OzellikDegeri[];
  gorsellerJson?: unknown;
  rozetIdsJson?: unknown;
  ozellikDegerleriJson?: unknown;
}

export interface UrunFormDegeri {
  ad: string;
  fiyat: number;
  aciklama: string;
  gorselUrl: string;
  kategori: string;
  kategoriId: string | null;
  markaId: string | null;
  rozetIds: string[];
  gorunumTipi: GorunumTipi;
  gorseller: string[];
  ozellikDegerleri: OzellikDegeri[];
  yeni: boolean;
  cokSatan: boolean;
  stokta: boolean;
  aktif: boolean;
  sira: number;
}

function urunNormalize(u: AdminUrun): AdminUrun {
  const gorseller = Array.isArray(u.gorseller)
    ? u.gorseller
    : Array.isArray(u.gorsellerJson)
      ? (u.gorsellerJson as string[])
      : [];
  const rozetIds = Array.isArray(u.rozetIds)
    ? u.rozetIds
    : Array.isArray(u.rozetIdsJson)
      ? (u.rozetIdsJson as string[])
      : [];
  const ozellikDegerleri = Array.isArray(u.ozellikDegerleri)
    ? u.ozellikDegerleri
    : Array.isArray(u.ozellikDegerleriJson)
      ? (u.ozellikDegerleriJson as OzellikDegeri[])
      : [];
  return {
    ...u,
    gorseller,
    rozetIds,
    ozellikDegerleri,
    gorunumTipi: (u.gorunumTipi as GorunumTipi) ?? 'grid',
  };
}

function formPayload(form: UrunFormDegeri) {
  return {
    ad: form.ad.trim(),
    fiyat: form.fiyat,
    aciklama: form.aciklama.trim() || null,
    gorselUrl: form.gorselUrl.trim() || null,
    gorseller: form.gorseller.filter(Boolean),
    kategori: form.kategori.trim() || null,
    kategoriId: form.kategoriId,
    markaId: form.markaId,
    rozetIds: form.rozetIds,
    gorunumTipi: form.gorunumTipi,
    ozellikDegerleri: form.ozellikDegerleri,
    yeni: form.yeni,
    cokSatan: form.cokSatan,
    stokta: form.stokta,
    aktif: form.aktif,
    sira: form.sira,
  };
}

export async function adminUrunleriGetir(): Promise<AdminUrun[]> {
  const veri = await adminJsonFetch<{ urunler: AdminUrun[] }>('/urunler', { headers: adminHeaders() });
  return veri.urunler.map(urunNormalize);
}

export async function adminUrunOlustur(form: UrunFormDegeri): Promise<AdminUrun> {
  const veri = await adminJsonFetch<{ urun: AdminUrun }>('/urunler', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(formPayload(form)),
  });
  return urunNormalize(veri.urun);
}

export async function adminUrunGuncelle(id: string, form: UrunFormDegeri): Promise<AdminUrun> {
  const veri = await adminJsonFetch<{ urun: AdminUrun }>(`/urunler/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(formPayload(form)),
  });
  return urunNormalize(veri.urun);
}

export function urunFormdanDoldur(u: AdminUrun): UrunFormDegeri {
  return {
    ad: u.ad,
    fiyat: u.fiyat,
    aciklama: u.aciklama ?? '',
    gorselUrl: u.gorselUrl ?? '',
    kategori: u.kategori ?? '',
    kategoriId: u.kategoriId ?? null,
    markaId: u.markaId ?? null,
    rozetIds: u.rozetIds ?? [],
    gorunumTipi: u.gorunumTipi ?? 'grid',
    gorseller: u.gorseller ?? [],
    ozellikDegerleri: u.ozellikDegerleri ?? [],
    yeni: u.yeni,
    cokSatan: u.cokSatan,
    stokta: u.stokta,
    aktif: u.aktif ?? true,
    sira: u.sira,
  };
}
