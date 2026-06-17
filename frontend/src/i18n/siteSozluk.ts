/** Site (header/footer) çeviri anahtarları — panel çevirisi gibi JSON ile düzenlenir */
export const SITE_CEVIRI_ANAHTARLARI = [
  'site.anaSayfa',
  'site.urunler',
  'site.blog',
  'site.hakkimizda',
  'site.iletisim',
  'site.hesabim',
  'site.sepet',
  'site.favoriler',
] as const;

export type SiteCeviriAnahtar = (typeof SITE_CEVIRI_ANAHTARLARI)[number];

export const SITE_VARSAYILAN_CEVIRILER: Record<string, Record<string, string>> = {
  TR: {
    'site.anaSayfa': 'Ana Sayfa',
    'site.urunler': 'Ürünler',
    'site.blog': 'Blog',
    'site.hakkimizda': 'Hakkımızda',
    'site.iletisim': 'İletişim',
    'site.hesabim': 'Hesabım',
    'site.sepet': 'Sepetim',
    'site.favoriler': 'Favoriler',
  },
  EN: {
    'site.anaSayfa': 'Home',
    'site.urunler': 'Products',
    'site.blog': 'Blog',
    'site.hakkimizda': 'About Us',
    'site.iletisim': 'Contact',
    'site.hesabim': 'My Account',
    'site.sepet': 'Cart',
    'site.favoriler': 'Favorites',
  },
  DE: {
    'site.anaSayfa': 'Startseite',
    'site.urunler': 'Produkte',
    'site.blog': 'Blog',
    'site.hakkimizda': 'Über uns',
    'site.iletisim': 'Kontakt',
    'site.hesabim': 'Mein Konto',
    'site.sepet': 'Warenkorb',
    'site.favoriler': 'Favoriten',
  },
};

export function siteJsonIceAktar(metin: string): Record<string, string> {
  const veri = JSON.parse(metin) as unknown;
  if (!veri || typeof veri !== 'object' || Array.isArray(veri)) {
    throw new Error('JSON bir nesne olmalı');
  }
  const sonuc: Record<string, string> = {};
  for (const [k, v] of Object.entries(veri as Record<string, unknown>)) {
    if (typeof v === 'string') sonuc[k] = v;
  }
  return sonuc;
}

export function sayfaCeviriAnahtar(slug: string) {
  return `sayfa.${slug}`;
}

/** Bilinen sayfa slug → site.* çeviri anahtarı */
export const SLUG_SITE_ANAHTAR: Record<string, string> = {
  'ana-sayfa': 'site.anaSayfa',
  urunler: 'site.urunler',
  blog: 'site.blog',
  hakkimizda: 'site.hakkimizda',
  iletisim: 'site.iletisim',
};

export function siteCeviriBirlestir(
  dilKodu: string,
  ozel?: Record<string, string> | null,
  sayfaBasliklari?: { slug: string; baslik: string }[],
  varsayilanDil = 'TR'
): Record<string, string> {
  const varsayilan = SITE_VARSAYILAN_CEVIRILER[dilKodu] ?? SITE_VARSAYILAN_CEVIRILER.TR ?? {};
  const sonuc: Record<string, string> = { ...varsayilan, ...(ozel ?? {}) };

  for (const s of sayfaBasliklari ?? []) {
    const sayfaKey = sayfaCeviriAnahtar(s.slug);
    if (sonuc[sayfaKey]) continue;

    const siteKey = SLUG_SITE_ANAHTAR[s.slug];
    if (siteKey && sonuc[siteKey]) {
      sonuc[sayfaKey] = sonuc[siteKey];
      continue;
    }

    if (dilKodu === varsayilanDil) {
      sonuc[sayfaKey] = s.baslik;
    }
  }

  return sonuc;
}
