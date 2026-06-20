/** Admin input alanı için ham metin */
export function sayacDegerInput(deger: number | string | undefined | null): string {
  if (deger === undefined || deger === null || deger === '') return '';
  return String(deger);
}

/** Sayaç değerini ekranda olduğu gibi gösterir (01 zorlaması yok). */
export function sayacDegerGoster(deger: number | string | undefined | null): string {
  if (deger === undefined || deger === null) return '0';
  const metin = String(deger).trim();
  return metin === '' ? '0' : metin;
}

/** Admin girdisinden ham metni saklar; ondalık ve tek haneli değerlere izin verir. */
export function sayacDegerKaydet(ham: string): number | string {
  const metin = ham.trim();
  if (metin === '') return '';
  if (/^-?\d+$/.test(metin)) return Number(metin);
  return metin;
}

export const SAYAC_VARSAYILAN_IKONLAR = ['⚡', '🔌', '💳', '🎨', '📊', '🚀', '🛡️', '⭐'] as const;
