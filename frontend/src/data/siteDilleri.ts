import type { DilDestegiAyarlari, SiteDilKaydi } from '@/types/header';

export const VARSAYILAN_SITE_DILLERI: SiteDilKaydi[] = [
  { kod: 'TR', ad: 'Türkçe', bayrak: '🇹🇷', aktif: true, sira: 0 },
  { kod: 'EN', ad: 'English', bayrak: '🇬🇧', aktif: true, sira: 1 },
  { kod: 'DE', ad: 'Deutsch', bayrak: '🇩🇪', aktif: true, sira: 2 },
  { kod: 'FR', ad: 'Français', bayrak: '🇫🇷', aktif: false, sira: 3 },
  { kod: 'AR', ad: 'العربية', bayrak: '🇸🇦', aktif: false, sira: 4 },
  { kod: 'RU', ad: 'Русский', bayrak: '🇷🇺', aktif: false, sira: 5 },
  { kod: 'RO', ad: 'Română', bayrak: '🇷🇴', aktif: false, sira: 6 },
];

export function dilDestegiBirlestir(ham?: Partial<DilDestegiAyarlari> | null): DilDestegiAyarlari {
  const varsayilan: DilDestegiAyarlari = {
    aktif: false,
    gorunum: 'kod',
    varsayilanDil: 'TR',
    diller: VARSAYILAN_SITE_DILLERI,
  };
  if (!ham) return varsayilan;

  const diller = (ham.diller ?? varsayilan.diller).map((d) => {
    const sablon = VARSAYILAN_SITE_DILLERI.find((v) => v.kod === d.kod);
    return { ...(sablon ?? d), ...d };
  });

  return {
    aktif: ham.aktif ?? varsayilan.aktif,
    gorunum: ham.gorunum === 'bayrak' ? 'bayrak' : 'kod',
    varsayilanDil: ham.varsayilanDil ?? varsayilan.varsayilanDil,
    diller: diller.length ? diller : varsayilan.diller,
  };
}

export function aktifDiller(ayar: DilDestegiAyarlari): SiteDilKaydi[] {
  return [...ayar.diller]
    .filter((d) => d.aktif)
    .sort((a, b) => a.sira - b.sira || a.kod.localeCompare(b.kod));
}

export const SITE_DIL_STORAGE = 'site-dil';
