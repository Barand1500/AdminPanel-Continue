import type { SiteDilKaydi } from '@/types/header';

const DIL_BAYRAK_ISO: Record<string, string> = {
  TR: 'tr',
  EN: 'gb',
  GB: 'gb',
  DE: 'de',
  FR: 'fr',
  AR: 'sa',
  RU: 'ru',
  RO: 'ro',
  IT: 'it',
  ES: 'es',
  NL: 'nl',
  PT: 'pt',
  AZ: 'az',
  US: 'us',
};

function emojiUlkeKodu(bayrak?: string): string | null {
  if (!bayrak) return null;
  const harfler = [...bayrak];
  if (harfler.length < 2) return null;
  const a = harfler[0].codePointAt(0);
  const b = harfler[1].codePointAt(0);
  if (!a || !b || a < 0x1f1e6 || a > 0x1f1ff || b < 0x1f1e6 || b > 0x1f1ff) return null;
  return String.fromCharCode(a - 0x1f1e6 + 65, b - 0x1f1e6 + 65).toLowerCase();
}

export function dilBayrakIso(dil: Pick<SiteDilKaydi, 'kod' | 'bayrak'>): string | null {
  const kod = dil.kod?.trim().toUpperCase();
  if (kod && DIL_BAYRAK_ISO[kod]) return DIL_BAYRAK_ISO[kod];
  return emojiUlkeKodu(dil.bayrak);
}

export function dilBayrakGorselUrl(dil: Pick<SiteDilKaydi, 'kod' | 'bayrak'>, genislik = 40): string | null {
  const iso = dilBayrakIso(dil);
  if (!iso) return null;
  return `https://flagcdn.com/w${genislik}/${iso}.png`;
}

/** ISO 3166-1 alpha-2 ülke kodu için gerçek bayrak görseli adresi. */
export function ulkeBayrakGorselUrl(ulkeKodu: string, genislik = 40): string | null {
  const iso = ulkeKodu.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(iso)) return null;
  return `https://flagcdn.com/w${genislik}/${iso}.png`;
}
