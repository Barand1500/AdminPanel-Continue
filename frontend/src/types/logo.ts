export type LogoBoyutu = 'kucuk' | 'orta' | 'buyuk';

export const LOGO_BOYUT_ETIKET: Record<LogoBoyutu, string> = {
  kucuk: 'Küçük',
  orta: 'Orta',
  buyuk: 'Büyük',
};

export const VARSAYILAN_LOGO_BOYUTU: LogoBoyutu = 'orta';

export function logoBoyutuNormalize(boyut?: string | null): LogoBoyutu {
  if (boyut === 'kucuk' || boyut === 'buyuk') return boyut;
  return 'orta';
}

const BOYUT_SINIFLARI: Record<'header' | 'footer', Record<LogoBoyutu, string>> = {
  header: {
    kucuk: 'h-8 max-h-8 max-w-[96px]',
    orta: 'h-10 max-h-10 max-w-[120px]',
    buyuk: 'h-14 max-h-14 max-w-[160px]',
  },
  footer: {
    kucuk: 'h-8 max-h-8 max-w-[88px]',
    orta: 'h-10 max-h-10 max-w-[110px]',
    buyuk: 'h-12 max-h-12 max-w-[140px]',
  },
};

export function logoBoyutSinifi(boyut: LogoBoyutu, yer: 'header' | 'footer'): string {
  return `w-auto shrink-0 object-contain ${BOYUT_SINIFLARI[yer][boyut]}`;
}

export function headerLogoUrl(
  ayarlar?: { logoUrl?: string | null; headerAyarlariJson?: { logoUrl?: string | null } | null } | null
): string | null {
  return ayarlar?.headerAyarlariJson?.logoUrl ?? ayarlar?.logoUrl ?? null;
}

/** Footer ve genel marka alanları — site logosu yoksa header logosuna düşer */
export function siteLogoUrl(
  ayarlar?: { logoUrl?: string | null; headerAyarlariJson?: { logoUrl?: string | null } | null } | null
): string | null {
  return ayarlar?.logoUrl ?? ayarlar?.headerAyarlariJson?.logoUrl ?? null;
}
