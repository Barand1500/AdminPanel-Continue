import { adminKategoriler, adminModulleri } from '@/data/adminMenuYapisi';
import type { AdminModul } from '@/types/admin';

export const VARSAYILAN_HIZLI_ERISIM: string[] = adminModulleri
  .filter((m) => m.kategori === 'Hızlı Erişim' && m.id !== 'dashboard')
  .map((m) => m.id);

export const HIZLI_ERISIM_SECILEBILIR: AdminModul[] = adminModulleri.filter((m) => m.id !== 'dashboard');

export function hizliErisimModulleri(ids: string[] | undefined): AdminModul[] {
  const kaynak = ids && ids.length > 0 ? ids : VARSAYILAN_HIZLI_ERISIM;
  return kaynak
    .map((id) => adminModulleri.find((m) => m.id === id))
    .filter((m): m is AdminModul => Boolean(m));
}

export function hizliErisimKategoriler() {
  return adminKategoriler
    .map((kategori) => ({
      kategori,
      moduller: HIZLI_ERISIM_SECILEBILIR.filter((m) => m.kategori === kategori),
    }))
    .filter((g) => g.moduller.length > 0);
}
