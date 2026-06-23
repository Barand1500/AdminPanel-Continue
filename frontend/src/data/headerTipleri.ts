import type { HeaderTipEkAyarlari } from '@/types/header';

export const HEADER_TIPLERI = [
  'klasik',
  'sade',
  'kompakt',
  'merkez-logo',
  'arama-odakli',
  'modern',
  'kurumsal',
  'mega-menu',
  'seffaf-hero',
  'split',
] as const;

export type HeaderTipi = (typeof HEADER_TIPLERI)[number];

export interface HeaderTipTanimi {
  id: HeaderTipi;
  ad: string;
  aciklama: string;
  ilham: string;
  ustBant: boolean;
  kategoriArama: boolean;
  ekAyarlari: boolean;
}

export const HEADER_TIP_TANIMLARI: HeaderTipTanimi[] = [
  { id: 'klasik', ad: 'Klasik', aciklama: 'Üst bant + logo sol + menü + alt kategori/arama', ilham: 'Trendyol', ustBant: true, kategoriArama: true, ekAyarlari: false },
  { id: 'sade', ad: 'Sade', aciklama: 'İki katman: ortada logo, altta ince menü — Apple tarzı', ilham: 'Apple', ustBant: false, kategoriArama: true, ekAyarlari: true },
  { id: 'kompakt', ad: 'Kompakt', aciklama: 'Koyu bar + yatay pill kategoriler — Nike tarzı', ilham: 'Nike', ustBant: false, kategoriArama: true, ekAyarlari: true },
  { id: 'merkez-logo', ad: 'Merkez Logo', aciklama: 'Logo ortada, menü sol/sağ bölünmüş', ilham: 'Zara', ustBant: true, kategoriArama: false, ekAyarlari: true },
  { id: 'arama-odakli', ad: 'Arama Odaklı', aciklama: 'Geniş arama üstte', ilham: 'Amazon', ustBant: true, kategoriArama: true, ekAyarlari: true },
  { id: 'modern', ad: 'Modern', aciklama: 'CTA butonu, SaaS tarzı', ilham: 'Stripe', ustBant: false, kategoriArama: false, ekAyarlari: true },
  { id: 'kurumsal', ad: 'Kurumsal', aciklama: 'Güçlü üst bant + destek metni', ilham: 'Microsoft', ustBant: true, kategoriArama: true, ekAyarlari: true },
  { id: 'mega-menu', ad: 'Mega Menü', aciklama: 'Geniş kategori paneli', ilham: 'Teknosa', ustBant: true, kategoriArama: true, ekAyarlari: true },
  { id: 'seffaf-hero', ad: 'Hero Overlay', aciklama: 'Karanlık hero alanı + şeffaf header üstte', ilham: 'Tesla', ustBant: false, kategoriArama: false, ekAyarlari: true },
  { id: 'split', ad: 'Split', aciklama: 'Sol logo+kategori, sağ arama', ilham: 'IKEA', ustBant: true, kategoriArama: true, ekAyarlari: true },
];

export function headerTipiNormalize(tip?: string | null): HeaderTipi {
  if (tip && HEADER_TIPLERI.includes(tip as HeaderTipi)) return tip as HeaderTipi;
  return 'klasik';
}

export function headerTipTanimiBul(tip?: string | null): HeaderTipTanimi {
  const id = headerTipiNormalize(tip);
  return HEADER_TIP_TANIMLARI.find((t) => t.id === id) ?? HEADER_TIP_TANIMLARI[0];
}

export function varsayilanTipEk(tip: HeaderTipi): HeaderTipEkAyarlari {
  const ortak: HeaderTipEkAyarlari = {
    aramaGoster: true,
    aramaModu: 'tam',
    kullaniciGoster: true,
    kompaktYukseklik: 48,
    ctaMetni: '',
    ctaLink: '',
    ikinciLogoUrl: null,
    ikinciMarkaMetni: null,
    destekMetni: '',
    megaMenuKolon: 4,
    seffafBaslangic: true,
    scrollSonrasiStil: 'beyaz',
    menuBolmeNoktasi: 50,
  };
  switch (tip) {
    case 'sade': return { ...ortak, aramaModu: 'ikon', aramaGoster: false };
    case 'kompakt': return { ...ortak, kompaktYukseklik: 40, aramaModu: 'ikon' };
    case 'modern': return { ...ortak, ctaMetni: 'İletişim', ctaLink: '/iletisim', aramaGoster: false };
    case 'seffaf-hero': return { ...ortak, seffafBaslangic: true, aramaModu: 'ikon', ctaMetni: 'Sipariş Ver', ctaLink: '/siparis' };
    default: return ortak;
  }
}

export function tipEkBirlestir(tip: HeaderTipi, mevcut?: HeaderTipEkAyarlari | null): HeaderTipEkAyarlari {
  return { ...varsayilanTipEk(tip), ...mevcut };
}
