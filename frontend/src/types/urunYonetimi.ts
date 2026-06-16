export type GorunumTipi = 'grid' | 'liste' | 'kompakt';

export type RozetTipi = 'hazir' | 'ozel';

export interface UrunKategori {
  id: string;
  siteId: string;
  parentId: string | null;
  ad: string;
  slug: string;
  gorselUrl: string | null;
  ikon: string | null;
  gizli: boolean;
  aktif: boolean;
  sira: number;
  olusturma: string;
  guncelleme: string;
}

export interface KategoriFormDegeri {
  ad: string;
  slug: string;
  parentId: string | null;
  gorselUrl: string;
  ikon: string | null;
  gizli: boolean;
  aktif: boolean;
  sira: number;
}

export interface UrunMarka {
  id: string;
  siteId: string;
  ad: string;
  slug: string;
  gorselUrl: string | null;
  ikon: string | null;
  aktif: boolean;
  sira: number;
  olusturma: string;
  guncelleme: string;
}

export interface MarkaFormDegeri {
  ad: string;
  slug: string;
  gorselUrl: string;
  ikon: string | null;
  aktif: boolean;
  sira: number;
}

export interface UrunRozet {
  id: string;
  siteId: string;
  ad: string;
  tip: RozetTipi;
  hazirKod: string | null;
  renk: string | null;
  gorselUrl: string | null;
  ikon: string | null;
  aktif: boolean;
  sira: number;
  olusturma: string;
  guncelleme: string;
}

export interface RozetFormDegeri {
  ad: string;
  tip: RozetTipi;
  hazirKod: string | null;
  renk: string | null;
  gorselUrl: string;
  ikon: string | null;
  aktif: boolean;
  sira: number;
}

export interface UrunOzellik {
  id: string;
  siteId: string;
  grupId: string;
  ad: string;
  gorselUrl: string | null;
  ikon: string | null;
  sira: number;
  olusturma: string;
  guncelleme: string;
}

export interface UrunOzellikGrup {
  id: string;
  siteId: string;
  sablonId: string;
  kategoriId: string | null;
  ad: string;
  sira: number;
  olusturma: string;
  guncelleme: string;
  ozellikler: UrunOzellik[];
}

export interface UrunOzellikSablon {
  id: string;
  siteId: string;
  ad: string;
  sira: number;
  olusturma: string;
  guncelleme: string;
  gruplar: UrunOzellikGrup[];
}

export interface SablonFormDegeri {
  ad: string;
  sira: number;
}

export interface GrupFormDegeri {
  sablonId: string;
  kategoriId: string | null;
  ad: string;
  sira: number;
}

export interface OzellikFormDegeri {
  grupId: string;
  ad: string;
  gorselUrl: string;
  ikon: string | null;
  sira: number;
}

export interface UrunFirsat {
  id: string;
  siteId: string;
  ad: string;
  aciklama: string | null;
  indirimYuzde: number | null;
  indirimTutar: number | null;
  baslangic: string | null;
  bitis: string | null;
  aktif: boolean;
  urunIds: string[];
  olusturma: string;
  guncelleme: string;
}

export interface FirsatFormDegeri {
  ad: string;
  aciklama: string;
  indirimYuzde: number | null;
  indirimTutar: number | null;
  baslangic: string;
  bitis: string;
  aktif: boolean;
  urunIds: string[];
}

export interface UrunYorum {
  id: string;
  siteId: string;
  urunId: string;
  ad: string;
  email: string | null;
  puan: number;
  yorum: string;
  onaylandi: boolean;
  olusturma: string;
  guncelleme: string;
  urun?: { id: string; ad: string };
}

export interface OzellikDegeri {
  ozellikId: string;
  deger: string;
}

export interface TopluGorselEslestirme {
  urunId: string;
  gorselUrl: string;
}

export interface VitrinAyarlari {
  varsayilanGorunum: GorunumTipi;
}

export const HAZIR_ROZETLER = [
  { kod: 'yeni', ad: 'Yeni', renk: '#22c55e' },
  { kod: 'cok-satan', ad: 'Çok Satan', renk: '#f97316' },
  { kod: 'indirim', ad: 'İndirim', renk: '#ef4444' },
  { kod: 'kampanya', ad: 'Kampanya', renk: '#8b5cf6' },
  { kod: 'stok-az', ad: 'Stok Az', renk: '#eab308' },
  { kod: 'ucretsiz-kargo', ad: 'Ücretsiz Kargo', renk: '#3b82f6' },
] as const;

export const GORUNUM_TIPLERI: { id: GorunumTipi; ad: string; aciklama: string }[] = [
  { id: 'grid', ad: 'Grid', aciklama: 'Kart görünümü' },
  { id: 'liste', ad: 'Liste', aciklama: 'Satır görünümü' },
  { id: 'kompakt', ad: 'Kompakt', aciklama: 'Yoğun liste' },
];

export type UrunYonetimiSekmeId =
  | 'kategoriler'
  | 'markalar'
  | 'rozetler'
  | 'ozellikler'
  | 'firsatlar'
  | 'urun-listesi'
  | 'toplu-gorsel'
  | 'yorumlar';
