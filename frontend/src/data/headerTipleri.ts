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
  /** Üst bant sekmesi gösterilsin mi */
  ustBant: boolean;
  /** Kategori & arama sekmesi */
  kategoriArama: boolean;
  /** Ek ayarlar sekmesi */
  ekAyarlari: boolean;
}

export const HEADER_TIP_TANIMLARI: HeaderTipTanimi[] = [
  {
    id: 'klasik',
    ad: 'Klasik E-ticaret',
    aciklama: 'Üst bilgi bandı, logo sol, menü orta, altta kategori ve arama.',
    ilham: 'Trendyol / Hepsiburada',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: false,
  },
  {
    id: 'sade',
    ad: 'Sade / Minimal',
    aciklama: 'Tek ince satır, az öğe, arama ikon olarak veya gizli.',
    ilham: 'Apple / Linear',
    ustBant: false,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'kompakt',
    ad: 'Kompakt',
    aciklama: 'Düşük yükseklik, her şey tek satırda sıkışık düzen.',
    ilham: 'Nike / Adidas',
    ustBant: false,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'merkez-logo',
    ad: 'Merkez Logo',
    aciklama: 'Logo ortada, menü sol ve sağa bölünmüş lüks düzen.',
    ilham: 'Louis Vuitton / Zara',
    ustBant: true,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'arama-odakli',
    ad: 'Arama Odaklı',
    aciklama: 'Geniş arama kutusu üstte, logo ikincil konumda.',
    ilham: 'Amazon / Etsy',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'modern',
    ad: 'Modern SaaS',
    aciklama: 'Bol boşluk, CTA butonu, temiz tech görünümü.',
    ilham: 'Stripe / Vercel',
    ustBant: false,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'kurumsal',
    ad: 'Kurumsal / B2B',
    aciklama: 'Güçlü üst iletişim bandı, resmi alt navigasyon.',
    ilham: 'Microsoft / SAP',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'mega-menu',
    ad: 'Mega Menü',
    aciklama: 'Geniş kategori alanı, detaylı dropdown vurgusu.',
    ilham: 'MediaMarkt / Teknosa',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'seffaf-hero',
    ad: 'Şeffaf Hero',
    aciklama: 'Sayfa üstünde şeffaf header, scroll sonrası katı arka plan.',
    ilham: 'Tesla / Airbnb',
    ustBant: false,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'split',
    ad: 'Split',
    aciklama: 'Sol logo+kategori, sağ arama+ikonlar, menü ayrı satır.',
    ilham: 'IKEA / Decathlon',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
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
    case 'sade':
      return { ...ortak, aramaModu: 'ikon', aramaGoster: false };
    case 'kompakt':
      return { ...ortak, kompaktYukseklik: 40, aramaModu: 'ikon' };
    case 'modern':
      return { ...ortak, ctaMetni: 'İletişim', ctaLink: '/iletisim', aramaGoster: false };
    case 'seffaf-hero':
      return { ...ortak, seffafBaslangic: true, scrollSonrasiStil: 'beyaz', aramaModu: 'ikon' };
    case 'merkez-logo':
      return { ...ortak, ikinciLogoUrl: null, menuBolmeNoktasi: 50 };
    case 'split':
      return { ...ortak, ikinciLogoUrl: null };
    default:
      return ortak;
  }
}

export function tipEkBirlestir(
  tip: HeaderTipi,
  mevcut?: HeaderTipEkAyarlari | null
): HeaderTipEkAyarlari {
  return { ...varsayilanTipEk(tip), ...mevcut };
}
