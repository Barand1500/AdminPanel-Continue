import type { FooterTipEkAyarlari } from '@/types/footer';

export const FOOTER_TIPLERI = [
  'klasik',
  'sade',
  'kurumsal',
  'magaza',
  'merkezi',
  'newsletter',
  'kompakt',
  'detayli',
] as const;

export type FooterTipi = (typeof FOOTER_TIPLERI)[number];

export interface FooterTipTanimi {
  id: FooterTipi;
  ad: string;
  aciklama: string;
  ilham: string;
  semaGoster: boolean;
  kolonlar: boolean;
  ekAyarlari: boolean;
}

export const FOOTER_TIP_TANIMLARI: FooterTipTanimi[] = [
  {
    id: 'klasik',
    ad: 'Klasik',
    aciklama: 'Marka + 3–4 link kolonu, güven bandı (e-ticaret)',
    ilham: 'Trendyol',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'sade',
    ad: 'Sade',
    aciklama: 'Tek satır linkler, minimal iletişim, ince telif',
    ilham: 'Apple',
    semaGoster: false,
    kolonlar: false,
    ekAyarlari: true,
  },
  {
    id: 'kurumsal',
    ad: 'Kurumsal',
    aciklama: 'Güven rozetleri vurgulu, resmi kolon düzeni',
    ilham: 'Microsoft',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: true,
  },
  {
    id: 'magaza',
    ad: 'Mağaza / Pazaryeri',
    aciklama: 'Pazaryeri logoları üst bantta belirgin',
    ilham: 'Hepsiburada',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'merkezi',
    ad: 'Merkezi',
    aciklama: 'Ortalanmış marka ve linkler, dikey düzen',
    ilham: 'Zara',
    semaGoster: false,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'newsletter',
    ad: 'Newsletter',
    aciklama: 'E-posta abonelik CTA alanı + kolonlar',
    ilham: 'Mailchimp',
    semaGoster: false,
    kolonlar: true,
    ekAyarlari: true,
  },
  {
    id: 'kompakt',
    ad: 'Kompakt',
    aciklama: 'İnce koyu tek satır — logo, linkler, telif',
    ilham: 'Nike',
    semaGoster: false,
    kolonlar: false,
    ekAyarlari: true,
  },
  {
    id: 'detayli',
    ad: 'Detaylı',
    aciklama: 'Tüm bantlar: kolon, pazaryeri, güven, kurlar',
    ilham: 'Amazon',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: false,
  },
];

export function footerTipiNormalize(tip?: string | null): FooterTipi {
  if (tip && FOOTER_TIPLERI.includes(tip as FooterTipi)) return tip as FooterTipi;
  return 'klasik';
}

export function footerTipTanimiBul(tip?: string | null): FooterTipTanimi {
  const id = footerTipiNormalize(tip);
  return FOOTER_TIP_TANIMLARI.find((t) => t.id === id) ?? FOOTER_TIP_TANIMLARI[0];
}

export function varsayilanFooterTipEk(tip: FooterTipi): FooterTipEkAyarlari {
  const ortak: FooterTipEkAyarlari = {
    newsletterBaslik: 'Bültenimize katılın',
    newsletterPlaceholder: 'E-posta adresiniz',
    newsletterButon: 'Abone ol',
    kompaktKoyuTema: true,
    guvenVurgu: false,
  };
  switch (tip) {
    case 'newsletter':
      return { ...ortak, newsletterBaslik: 'Yeniliklerden haberdar olun', newsletterButon: 'Kaydol' };
    case 'kurumsal':
      return { ...ortak, guvenVurgu: true };
    case 'kompakt':
      return { ...ortak, kompaktKoyuTema: true };
    case 'sade':
      return { ...ortak, kompaktKoyuTema: false };
    default:
      return ortak;
  }
}

export function footerTipEkBirlestir(
  tip: FooterTipi,
  mevcut?: FooterTipEkAyarlari | null
): FooterTipEkAyarlari {
  return { ...varsayilanFooterTipEk(tip), ...mevcut };
}
