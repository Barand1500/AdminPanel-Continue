import { adminHeaders, adminJsonFetch } from './adminFetch';
import type {
  FirsatFormDegeri,
  GrupFormDegeri,
  KategoriFormDegeri,
  MarkaFormDegeri,
  OzellikDegeri,
  OzellikFormDegeri,
  RozetFormDegeri,
  SablonFormDegeri,
  TopluGorselEslestirme,
  UrunFirsat,
  UrunKategori,
  UrunMarka,
  UrunOzellik,
  UrunOzellikGrup,
  UrunOzellikSablon,
  UrunRozet,
  UrunYorum,
  VitrinAyarlari,
} from '@/types/urunYonetimi';

// Kategoriler
export async function kategorileriGetir(): Promise<UrunKategori[]> {
  const veri = await adminJsonFetch<{ kategoriler: UrunKategori[] }>('/urun-kategorileri', {
    headers: adminHeaders(),
  });
  return veri.kategoriler;
}

export async function kategoriOlustur(form: KategoriFormDegeri): Promise<UrunKategori> {
  const veri = await adminJsonFetch<{ kategori: UrunKategori }>('/urun-kategorileri', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(kategoriPayload(form)),
  });
  return veri.kategori;
}

export async function kategoriGuncelle(id: string, form: Partial<KategoriFormDegeri>): Promise<UrunKategori> {
  const veri = await adminJsonFetch<{ kategori: UrunKategori }>(`/urun-kategorileri/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(kategoriPayload(form)),
  });
  return veri.kategori;
}

export async function kategoriSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-kategorileri/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function kategoriPayload(form: Partial<KategoriFormDegeri>) {
  return {
    ad: form.ad?.trim(),
    slug: form.slug?.trim() || undefined,
    parentId: form.parentId,
    gorselUrl: form.gorselUrl?.trim() || null,
    ikon: form.ikon,
    gizli: form.gizli,
    aktif: form.aktif,
    sira: form.sira,
  };
}

// Markalar
export async function markalariGetir(): Promise<UrunMarka[]> {
  const veri = await adminJsonFetch<{ markalar: UrunMarka[] }>('/urun-markalari', {
    headers: adminHeaders(),
  });
  return veri.markalar;
}

export async function markaOlustur(form: MarkaFormDegeri): Promise<UrunMarka> {
  const veri = await adminJsonFetch<{ marka: UrunMarka }>('/urun-markalari', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(markaPayload(form)),
  });
  return veri.marka;
}

export async function markaGuncelle(id: string, form: Partial<MarkaFormDegeri>): Promise<UrunMarka> {
  const veri = await adminJsonFetch<{ marka: UrunMarka }>(`/urun-markalari/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(markaPayload(form)),
  });
  return veri.marka;
}

export async function markaSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-markalari/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function markaPayload(form: Partial<MarkaFormDegeri>) {
  return {
    ad: form.ad?.trim(),
    slug: form.slug?.trim() || undefined,
    gorselUrl: form.gorselUrl?.trim() || null,
    ikon: form.ikon,
    aktif: form.aktif,
    sira: form.sira,
  };
}

// Rozetler
export async function rozetleriGetir(): Promise<UrunRozet[]> {
  const veri = await adminJsonFetch<{ rozetler: UrunRozet[] }>('/urun-rozetleri', {
    headers: adminHeaders(),
  });
  return veri.rozetler;
}

export async function rozetOlustur(form: RozetFormDegeri): Promise<UrunRozet> {
  const veri = await adminJsonFetch<{ rozet: UrunRozet }>('/urun-rozetleri', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(rozetPayload(form)),
  });
  return veri.rozet;
}

export async function rozetGuncelle(id: string, form: Partial<RozetFormDegeri>): Promise<UrunRozet> {
  const veri = await adminJsonFetch<{ rozet: UrunRozet }>(`/urun-rozetleri/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(rozetPayload(form)),
  });
  return veri.rozet;
}

export async function rozetSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-rozetleri/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function rozetPayload(form: Partial<RozetFormDegeri>) {
  return {
    ad: form.ad?.trim(),
    tip: form.tip,
    hazirKod: form.hazirKod,
    renk: form.renk,
    gorselUrl: form.gorselUrl?.trim() || null,
    ikon: form.ikon,
    aktif: form.aktif,
    sira: form.sira,
  };
}

// Özellikler
export async function ozellikAgaciniGetir(): Promise<UrunOzellikSablon[]> {
  const veri = await adminJsonFetch<{ sablonlar: UrunOzellikSablon[] }>('/urun-ozellikleri', {
    headers: adminHeaders(),
  });
  return veri.sablonlar;
}

export async function sablonOlustur(form: SablonFormDegeri): Promise<UrunOzellikSablon> {
  const veri = await adminJsonFetch<{ sablon: UrunOzellikSablon }>('/urun-ozellik-sablonlari', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ ad: form.ad.trim(), sira: form.sira }),
  });
  return veri.sablon;
}

export async function sablonSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-ozellik-sablonlari/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function grupOlustur(form: GrupFormDegeri): Promise<UrunOzellikGrup> {
  const veri = await adminJsonFetch<{ grup: UrunOzellikGrup }>('/urun-ozellik-gruplari', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      sablonId: form.sablonId,
      kategoriId: form.kategoriId,
      ad: form.ad.trim(),
      sira: form.sira,
    }),
  });
  return veri.grup;
}

export async function grupGuncelle(id: string, form: Partial<GrupFormDegeri>): Promise<UrunOzellikGrup> {
  const veri = await adminJsonFetch<{ grup: UrunOzellikGrup }>(`/urun-ozellik-gruplari/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({
      sablonId: form.sablonId,
      kategoriId: form.kategoriId,
      ad: form.ad?.trim(),
      sira: form.sira,
    }),
  });
  return veri.grup;
}

export async function grupSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-ozellik-gruplari/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function ozellikOlustur(form: OzellikFormDegeri): Promise<UrunOzellik> {
  const veri = await adminJsonFetch<{ ozellik: UrunOzellik }>('/urun-ozellikleri', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      grupId: form.grupId,
      ad: form.ad.trim(),
      gorselUrl: form.gorselUrl.trim() || null,
      ikon: form.ikon,
      sira: form.sira,
    }),
  });
  return veri.ozellik;
}

export async function ozellikGuncelle(id: string, form: Partial<OzellikFormDegeri>): Promise<UrunOzellik> {
  const veri = await adminJsonFetch<{ ozellik: UrunOzellik }>(`/urun-ozellikleri/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({
      grupId: form.grupId,
      ad: form.ad?.trim(),
      gorselUrl: form.gorselUrl?.trim() || null,
      ikon: form.ikon,
      sira: form.sira,
    }),
  });
  return veri.ozellik;
}

export async function ozellikSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-ozellikleri/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Fırsatlar
export async function firsatlariGetir(): Promise<UrunFirsat[]> {
  const veri = await adminJsonFetch<{ firsatlar: UrunFirsat[] }>('/urun-firsatlari', {
    headers: adminHeaders(),
  });
  return veri.firsatlar;
}

export async function firsatOlustur(form: FirsatFormDegeri): Promise<UrunFirsat> {
  const veri = await adminJsonFetch<{ firsat: UrunFirsat }>('/urun-firsatlari', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(firsatPayload(form)),
  });
  return veri.firsat;
}

export async function firsatGuncelle(id: string, form: Partial<FirsatFormDegeri>): Promise<UrunFirsat> {
  const veri = await adminJsonFetch<{ firsat: UrunFirsat }>(`/urun-firsatlari/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(firsatPayload(form)),
  });
  return veri.firsat;
}

export async function firsatSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-firsatlari/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function firsatPayload(form: Partial<FirsatFormDegeri>) {
  return {
    ad: form.ad?.trim(),
    aciklama: form.aciklama?.trim() || null,
    indirimYuzde: form.indirimYuzde,
    indirimTutar: form.indirimTutar,
    baslangic: form.baslangic ? new Date(form.baslangic).toISOString() : null,
    bitis: form.bitis ? new Date(form.bitis).toISOString() : null,
    aktif: form.aktif,
    urunIds: form.urunIds,
  };
}

// Yorumlar
export async function yorumlariGetir(): Promise<UrunYorum[]> {
  const veri = await adminJsonFetch<{ yorumlar: UrunYorum[] }>('/urun-yorumlari', {
    headers: adminHeaders(),
  });
  return veri.yorumlar;
}

export async function yorumOnayla(id: string, onaylandi: boolean): Promise<UrunYorum> {
  const veri = await adminJsonFetch<{ yorum: UrunYorum }>(`/urun-yorumlari/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ onaylandi }),
  });
  return veri.yorum;
}

export async function yorumSil(id: string): Promise<void> {
  await adminJsonFetch(`/urun-yorumlari/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Toplu görsel
export async function topluGorselYukle(eslestirmeler: TopluGorselEslestirme[]): Promise<{ guncellenen: number }> {
  return adminJsonFetch<{ guncellenen: number }>('/urunler/toplu-gorsel', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ eslestirmeler }),
  });
}

// Vitrin
export async function vitrinGetir(): Promise<VitrinAyarlari> {
  return adminJsonFetch<VitrinAyarlari>('/urun-vitrin', { headers: adminHeaders() });
}

export async function vitrinKaydet(ayarlar: VitrinAyarlari): Promise<VitrinAyarlari> {
  return adminJsonFetch<VitrinAyarlari>('/urun-vitrin', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(ayarlar),
  });
}

export type { OzellikDegeri };
