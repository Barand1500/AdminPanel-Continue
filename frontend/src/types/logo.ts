export type LogoBoyutu = 'kucuk' | 'orta' | 'buyuk' | 'cok_buyuk' | 'mega_buyuk';

export const LOGO_BOYUT_ETIKET: Record<LogoBoyutu, string> = {
  kucuk: 'Küçük',
  orta: 'Orta',
  buyuk: 'Büyük',
  cok_buyuk: 'Çok Büyük',
  mega_buyuk: 'Mega Büyük',
};

export const VARSAYILAN_LOGO_BOYUTU: LogoBoyutu = 'orta';

export function logoBoyutuNormalize(boyut?: string | null): LogoBoyutu {
  if (
    boyut === 'kucuk' ||
    boyut === 'buyuk' ||
    boyut === 'cok_buyuk' ||
    boyut === 'mega_buyuk'
  ) {
    return boyut;
  }
  return 'orta';
}

const BOYUT_SINIFLARI: Record<'header' | 'footer', Record<LogoBoyutu, string>> = {
  header: {
    kucuk: 'h-8 max-h-8 max-w-[96px]',
    orta: 'h-10 max-h-10 max-w-[120px]',
    buyuk: 'h-14 max-h-14 max-w-[160px]',
    cok_buyuk: 'h-[4.5rem] max-h-[4.5rem] max-w-[240px]',
    mega_buyuk: 'h-24 max-h-24 max-w-[320px]',
  },
  footer: {
    kucuk: 'h-8 max-h-8 max-w-[88px]',
    orta: 'h-10 max-h-10 max-w-[110px]',
    buyuk: 'h-12 max-h-12 max-w-[140px]',
    cok_buyuk: 'h-14 max-h-14 max-w-[180px]',
    mega_buyuk: 'h-16 max-h-16 max-w-[220px]',
  },
};

/** Merkez logo header düzeninde kapsayıcı genişliği */
export function headerMarkaKapSinifi(boyut: LogoBoyutu): string {
  const map: Record<LogoBoyutu, string> = {
    kucuk: 'max-w-[120px]',
    orta: 'max-w-[160px]',
    buyuk: 'max-w-[200px]',
    cok_buyuk: 'max-w-[280px]',
    mega_buyuk: 'max-w-[360px]',
  };
  return map[boyut];
}

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
