import { sayfaSegmentSlug } from '@/utils/sayfaAgaci';
import type { DilDestegiAyarlari } from '@/types/header';

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
  return `sayfa.${slug.replace(/^\/+|\/+$/g, '')}`;
}

/** Menü metni için çeviri anahtarı (sayfa linki olmayan öğeler dahil) */
export function menuMetinCeviriAnahtar(metin: string): string | null {
  const normalized = metin
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized ? `menu.${normalized}` : null;
}

/** Bir sayfa slug'ı için olası çeviri anahtarları (iç içe slug desteği) */
export function sayfaSlugCeviriAnahtarlari(slug: string): string[] {
  const temiz = slug.replace(/^\/+|\/+$/g, '');
  const keys = new Set<string>();
  keys.add(sayfaCeviriAnahtar(temiz));
  const seg = sayfaSegmentSlug(temiz);
  if (seg && seg !== temiz) keys.add(sayfaCeviriAnahtar(seg));
  return [...keys];
}

/** Bilinen sayfa slug → site.* çeviri anahtarı */
export const SLUG_SITE_ANAHTAR: Record<string, string> = {
  'ana-sayfa': 'site.anaSayfa',
  urunler: 'site.urunler',
  blog: 'site.blog',
  hakkimizda: 'site.hakkimizda',
  iletisim: 'site.iletisim',
};

/** Slug / menü metni için otomatik dil önerileri (yeni sayfalar) */
const SLUG_CEVIRI_ONERI: Record<string, Record<string, string>> = {
  EN: {
    hastanelerimiz: 'Our Hospitals',
    hastane: 'Hospital',
    hizmetler: 'Services',
    hizmet: 'Service',
    doktorlarimiz: 'Our Doctors',
    doktorlar: 'Doctors',
    kurumsal: 'Corporate',
    randevu: 'Appointment',
    galeri: 'Gallery',
    haberler: 'News',
    blog: 'Blog',
    iletisim: 'Contact',
    hakkimizda: 'About Us',
  },
  DE: {
    hastanelerimiz: 'Unsere Krankenhäuser',
    hizmetler: 'Leistungen',
    doktorlarimiz: 'Unsere Ärzte',
    kurumsal: 'Unternehmen',
    iletisim: 'Kontakt',
    hakkimizda: 'Über uns',
  },
};

const TR_KOK_CEVIRI: Record<string, Record<string, string>> = {
  EN: {
    hastane: 'Hospitals',
    hizmet: 'Services',
    doktor: 'Doctors',
    klinik: 'Clinics',
  },
  DE: {
    hastane: 'Krankenhäuser',
    hizmet: 'Leistungen',
    doktor: 'Ärzte',
    klinik: 'Kliniken',
  },
};

/** Varsayılan dil dışındaki diller için başlık önerisi */
export function dilBaslikOner(dilKodu: string, slug: string, trBaslik: string): string | undefined {
  if (dilKodu === 'TR') return trBaslik;

  const tam = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  const seg = sayfaSegmentSlug(tam).toLowerCase();
  const oneriMap = SLUG_CEVIRI_ONERI[dilKodu];

  if (oneriMap?.[tam]) return oneriMap[tam];
  if (oneriMap?.[seg]) return oneriMap[seg];

  const siteKey = SLUG_SITE_ANAHTAR[tam] ?? SLUG_SITE_ANAHTAR[seg];
  if (siteKey) {
    const v = SITE_VARSAYILAN_CEVIRILER[dilKodu]?.[siteKey];
    if (v) return v;
  }

  if (seg.endsWith('lerimiz')) {
    const kok = seg.slice(0, -7);
    const kokCeviri = TR_KOK_CEVIRI[dilKodu]?.[kok] ?? oneriMap?.[kok];
    if (kokCeviri) {
      return dilKodu === 'EN' ? `Our ${kokCeviri}` : kokCeviri;
    }
  }

  const menuKey = menuMetinCeviriAnahtar(trBaslik);
  if (menuKey && oneriMap) {
    const mk = menuKey.replace('menu.', '');
    if (oneriMap[mk]) return oneriMap[mk];
  }

  return undefined;
}

function ceviriAnahtarDoldur(
  sonuc: Record<string, string>,
  anahtar: string,
  dilKodu: string,
  varsayilanDil: string,
  trBaslik: string,
  slug: string,
  ozel?: Record<string, string> | null,
  tumCeviriler?: Record<string, Record<string, string>> | null
) {
  if (sonuc[anahtar]) return;

  if (ozel?.[anahtar]) {
    sonuc[anahtar] = ozel[anahtar];
    return;
  }

  if (tumCeviriler?.[dilKodu]?.[anahtar]) {
    sonuc[anahtar] = tumCeviriler[dilKodu]![anahtar];
    return;
  }

  const slugPart = anahtar.startsWith('sayfa.') ? anahtar.slice(6) : '';
  if (slugPart) {
    const siteKey = SLUG_SITE_ANAHTAR[slugPart] ?? SLUG_SITE_ANAHTAR[sayfaSegmentSlug(slugPart)];
    if (siteKey && sonuc[siteKey]) {
      sonuc[anahtar] = sonuc[siteKey];
      return;
    }
  }

  const oneri = dilBaslikOner(dilKodu, slug || slugPart, trBaslik);
  if (oneri) {
    sonuc[anahtar] = oneri;
    return;
  }

  if (dilKodu === varsayilanDil) {
    sonuc[anahtar] = trBaslik;
  }
}

export function siteCeviriBirlestir(
  dilKodu: string,
  ozel?: Record<string, string> | null,
  sayfaBasliklari?: { slug: string; baslik: string }[],
  varsayilanDil = 'TR',
  menuMetinleri?: string[],
  tumCeviriler?: Record<string, Record<string, string>> | null
): Record<string, string> {
  const varsayilan = SITE_VARSAYILAN_CEVIRILER[dilKodu] ?? SITE_VARSAYILAN_CEVIRILER.TR ?? {};
  const sonuc: Record<string, string> = { ...varsayilan, ...(ozel ?? {}) };

  for (const s of sayfaBasliklari ?? []) {
    for (const sayfaKey of sayfaSlugCeviriAnahtarlari(s.slug)) {
      ceviriAnahtarDoldur(sonuc, sayfaKey, dilKodu, varsayilanDil, s.baslik, s.slug, ozel, tumCeviriler);
    }

    const menuKey = menuMetinCeviriAnahtar(s.baslik);
    if (menuKey) {
      ceviriAnahtarDoldur(sonuc, menuKey, dilKodu, varsayilanDil, s.baslik, s.slug, ozel, tumCeviriler);
    }
  }

  for (const metin of menuMetinleri ?? []) {
    const menuKey = menuMetinCeviriAnahtar(metin);
    if (!menuKey) continue;
    ceviriAnahtarDoldur(sonuc, menuKey, dilKodu, varsayilanDil, metin, '', ozel, tumCeviriler);
  }

  return sonuc;
}

/** Menü / sayfa kaydında dil çevirilerine eksik anahtarları ekler (mevcut çeviriler korunur) */
export function siteCevirileriSenkronize(
  dilDestegi: DilDestegiAyarlari,
  kaynaklar: { slug: string; baslik: string }[],
  menuMetinleri: string[] = []
): Record<string, Record<string, string>> {
  const varsayilan = dilDestegi.varsayilanDil;
  const ceviriler: Record<string, Record<string, string>> = {};

  for (const dil of dilDestegi.diller) {
    ceviriler[dil.kod] = {
      ...(SITE_VARSAYILAN_CEVIRILER[dil.kod] ?? {}),
      ...(dilDestegi.ceviriler?.[dil.kod] ?? {}),
    };
  }

  const tumMetinler = new Set<string>(menuMetinleri);
  for (const s of kaynaklar) tumMetinler.add(s.baslik);

  for (const s of kaynaklar) {
    for (const sayfaKey of sayfaSlugCeviriAnahtarlari(s.slug)) {
      if (!ceviriler[varsayilan]) ceviriler[varsayilan] = {};
      if (!ceviriler[varsayilan][sayfaKey]) ceviriler[varsayilan][sayfaKey] = s.baslik;

      for (const dil of dilDestegi.diller) {
        if (dil.kod === varsayilan) continue;
        if (!ceviriler[dil.kod]) ceviriler[dil.kod] = {};
        if (ceviriler[dil.kod][sayfaKey]) continue;
        const oneri = dilBaslikOner(dil.kod, sayfaKey.replace('sayfa.', ''), s.baslik);
        if (oneri) ceviriler[dil.kod][sayfaKey] = oneri;
      }
    }
  }

  for (const metin of tumMetinler) {
    const menuKey = menuMetinCeviriAnahtar(metin);
    if (!menuKey) continue;

    if (!ceviriler[varsayilan]) ceviriler[varsayilan] = {};
    if (!ceviriler[varsayilan][menuKey]) ceviriler[varsayilan][menuKey] = metin;

    for (const dil of dilDestegi.diller) {
      if (dil.kod === varsayilan) continue;
      if (!ceviriler[dil.kod]) ceviriler[dil.kod] = {};
      if (ceviriler[dil.kod][menuKey]) continue;
      const oneri = dilBaslikOner(dil.kod, menuKey.replace('menu.', ''), metin);
      if (oneri) ceviriler[dil.kod][menuKey] = oneri;
    }
  }

  return ceviriler;
}
