import { adminHeaders, adminJsonFetch } from './adminFetch';

export type YetkiKodu =
  | 'goruntuleme'
  | 'ekleme'
  | 'duzenleme'
  | 'silme'
  | 'yayinlama'
  | 'dosya_yukleme'
  | 'seo_duzenleme'
  | 'tema_duzenleme'
  | 'kullanici_yonetimi';

export interface RolTanimi {
  kod: string;
  baslik: string;
  aciklama: string;
  yetkiler: YetkiKodu[];
  sistemRolu?: boolean;
}

export interface YetkiTanimi {
  kod: YetkiKodu;
  etiket: string;
}

export async function adminRolleriGetir(): Promise<{ roller: RolTanimi[]; yetkiler: YetkiTanimi[] }> {
  return adminJsonFetch('/roller', { headers: adminHeaders() });
}

export async function adminRolleriKaydet(
  roller: RolTanimi[]
): Promise<{ roller: RolTanimi[]; yetkiler: YetkiTanimi[] }> {
  return adminJsonFetch('/roller', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ roller }),
  });
}

export function baslikdanKodUret(baslik: string, mevcutKodlar: string[]): string {
  const temiz = baslik
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  let kod = temiz || 'YENI_ROL';
  if (!mevcutKodlar.includes(kod)) return kod;
  let sayac = 2;
  while (mevcutKodlar.includes(`${kod}_${sayac}`)) sayac += 1;
  return `${kod}_${sayac}`;
}
