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
  'split',
  'cta-serit',
  'sosyal-sahne',
  'kartlar',
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
    aciklama:
      'Solda marka, yanında 3–4 link kolonu, altta güven bandı. Çok ürünlü e-ticaret sitelerinin alışılmış alt bilgisi.',
    ilham: 'Trendyol',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'sade',
    ad: 'Sade',
    aciklama:
      'Tek satır linkler, az iletişim, ince telif. Sakin marka sitelerinde sayfayı ağırlaştırmadan kapatır.',
    ilham: 'Apple',
    semaGoster: false,
    kolonlar: false,
    ekAyarlari: true,
  },
  {
    id: 'kurumsal',
    ad: 'Koyu Kurumsal',
    aciklama:
      'Koyu zemin, güven rozetleri ve resmi kolonlar. Şirket ve B2B sitelerinde ağır ve net durur.',
    ilham: 'Kurumsal site',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: true,
  },
  {
    id: 'magaza',
    ad: 'Mağaza / Pazaryeri',
    aciklama:
      'Pazaryeri logoları üstte belirgin; altında kolonlar. Çok satıcılı mağaza ve pazaryeri siteleri için.',
    ilham: 'Hepsiburada',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'merkezi',
    ad: 'Merkezi',
    aciklama:
      'Marka ve linkler ortalanır, dikey akar. Butik ve moda sitelerinde sık kullanılan bir kapanış.',
    ilham: 'Zara',
    semaGoster: false,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'newsletter',
    ad: 'Newsletter',
    aciklama:
      'E-posta abonelik kutusu öne çıkar, altında kolonlar. Bülten ve içerik siteleri için.',
    ilham: 'Mailchimp',
    semaGoster: false,
    kolonlar: true,
    ekAyarlari: true,
  },
  {
    id: 'kompakt',
    ad: 'Kompakt',
    aciklama:
      'İnce koyu tek satır: logo, birkaç link ve telif. Az yer kaplar; spor ve marka sitelerine yakışır.',
    ilham: 'Nike',
    semaGoster: false,
    kolonlar: false,
    ekAyarlari: true,
  },
  {
    id: 'detayli',
    ad: 'Detaylı',
    aciklama:
      'Kolon, pazaryeri, güven rozetleri ve kurlar birlikte durur. Katalog sitelerinde her şey altta toplanır.',
    ilham: 'Amazon',
    semaGoster: true,
    kolonlar: true,
    ekAyarlari: false,
  },
  {
    id: 'split',
    ad: 'Split Vitrin',
    aciklama:
      'Sol taraf renkli marka paneli, sağ taraf link kolonları. Eşit ızgara yerine ikiye bölünmüş bir sahne; stüdyo ve yazılım sitelerine yakışır.',
    ilham: 'Stripe',
    semaGoster: false,
    kolonlar: true,
    ekAyarlari: true,
  },
  {
    id: 'cta-serit',
    ad: 'Çağrı Bandı',
    aciklama:
      'Üstte tam genişlik renkli çağrı şeridi ve buton, altında ince link satırı. Bülten formu değil; ziyaretçiyi tek bir aksiyona çeker.',
    ilham: 'Webflow',
    semaGoster: false,
    kolonlar: true,
    ekAyarlari: true,
  },
  {
    id: 'sosyal-sahne',
    ad: 'Sosyal Sahne',
    aciklama:
      'Ortada büyük sosyal ikonlar, altında küçük marka. Kolon yok; yaratıcı ajans ve kişisel marka sitelerinde öne çıkar.',
    ilham: 'Behance',
    semaGoster: false,
    kolonlar: false,
    ekAyarlari: false,
  },
  {
    id: 'kartlar',
    ad: 'Kart \u0130zgara',
    aciklama:
      'Marka ve her kolon ayrı yuvarlak kartta durur. Düz sütunlardan farklı, kutu kutu bir düzen; hizmet sitelerinde okunur.',
    ilham: 'Notion',
    semaGoster: false,
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
    case 'cta-serit':
      return {
        ...ortak,
        ctaMetni: 'Projenizi konuşalım',
        ctaLink: '/iletisim',
        ctaAltMetin: 'Ücretsiz keşif görüşmesi',
        newsletterButon: 'İletişime geç',
      };
    case 'split':
      return { ...ortak, arkaPlanRengi: '#0f172a', metinRengi: '#ffffff' };
    case 'kurumsal':
      return {
        ...ortak,
        guvenVurgu: true,
        arkaPlanRengi: '#0b2a77',
        altBantRengi: '#08245f',
        metinRengi: '#ffffff',
        ikonArkaPlanRengi: '#08245f',
      };
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
