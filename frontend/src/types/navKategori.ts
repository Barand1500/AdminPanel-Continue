export interface NavKategoriKayit {
  id: string;
  siteId?: string;
  ustKategoriId: string | null;
  baslik: string;
  slug: string;
  yol: string | null;
  gorselUrl: string | null;
  ikon: string | null;
  aktif: boolean;
  sira: number;
  olusturma?: string;
  guncelleme?: string;
}

export interface NavKategoriFormDegeri {
  baslik: string;
  slug: string;
  yol: string;
  gorselUrl: string;
  ikon: string;
  aktif: boolean;
  sira: number;
  ustKategoriId: string | null;
}

/** Header mega menü ağacı */
export interface NavKategoriAgacDugumu {
  id: string;
  baslik: string;
  slug: string;
  yol?: string;
  altKategoriler?: NavKategoriAgacDugumu[];
}
