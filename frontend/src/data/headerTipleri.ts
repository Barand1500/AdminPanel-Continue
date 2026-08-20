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
  'imza-kurumsal',
  'yuzen-hap',
  'masthead',
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
  {
    id: 'klasik',
    ad: 'Klasik',
    aciklama:
      'Üstte ince iletişim bandı, altında logo solda ve menü. En altta kategoriler ile arama durur. Çok ürünlü e-ticaret siteleri için alışılmış düzen.',
    ilham: 'Trendyol',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'sade',
    ad: 'Sade',
    aciklama:
      'Logo ortada, altında ince bir menü şeridi. Az öğe, bol boşluk. Sakin marka ve vitrin siteleri için.',
    ilham: 'Apple',
    ustBant: false,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'kompakt',
    ad: 'Kompakt',
    aciklama:
      'Tek koyu şerit, yatay hap şeklinde kategoriler. Az yer kaplar; spor ve moda markalarına yakışır.',
    ilham: 'Nike',
    ustBant: false,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'merkez-logo',
    ad: 'Merkez Logo',
    aciklama:
      'Logo tam ortada, menü linkleri sağa ve sola bölünür. Butik ve moda sitelerinde sık kullanılan bir düzen.',
    ilham: 'Zara',
    ustBant: true,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'arama-odakli',
    ad: 'Arama Odaklı',
    aciklama:
      'Arama kutusu en üstte geniş durur; ürün bulmak öne çıkar. Katalog ve pazaryeri tipi siteler için.',
    ilham: 'Amazon',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'modern',
    ad: 'Modern',
    aciklama:
      'Solda logo, sağda belirgin bir aksiyon butonu. Hizmet, yazılım ve kurumsal tanıtım siteleri için.',
    ilham: 'Stripe',
    ustBant: false,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'kurumsal',
    ad: 'Kurumsal',
    aciklama:
      'Güçlü üst iletişim bandı, destek metni ve net menü. Şirket ve B2B sitelerinde güven verir.',
    ilham: 'Microsoft',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'mega-menu',
    ad: 'Mega Menü',
    aciklama:
      'Kategoriler açılınca geniş bir panel gelir. Çok ürün grubu olan mağazalarda gezintiyi kolaylaştırır.',
    ilham: 'Teknosa',
    ustBant: true,
    kategoriArama: true,
    ekAyarlari: true,
  },
  {
    id: 'seffaf-hero',
    ad: 'Hero Overlay',
    aciklama:
      'Sayfa açılışında header şeffaf durur, kaydırınca dolu hale gelir. Tam ekran giriş görseli olan siteler için.',
    ilham: 'Tesla',
    ustBant: false,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'imza-kurumsal',
    ad: 'İmza Kurumsal',
    aciklama:
      'Üstte iletişim bandı, altında ikonlu menü, katalog butonu ve arama. Kurumsal imza görünümü.',
    ilham: 'Kurumsal site',
    ustBant: true,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'yuzen-hap',
    ad: 'Yüzen Hap',
    aciklama:
      'Sayfanın kenarına yapışmaz; üstte yüzen, cam efektli bir hap. Logo, menü ve buton aynı kapsülün içinde durur. Uygulama ve stüdyo siteleri için.',
    ilham: 'Linear',
    ustBant: false,
    kategoriArama: false,
    ekAyarlari: true,
  },
  {
    id: 'masthead',
    ad: 'Masthead',
    aciklama:
      'Ortada büyük marka adı, altında çizgi ve serif menü. Gazete / dergi vitrini gibi durur; e-ticaret şeritlerinden bilinçli olarak ayrıdır.',
    ilham: 'The New York Times',
    ustBant: false,
    kategoriArama: false,
    ekAyarlari: true,
  },
];

export function headerTipiNormalize(tip?: string | null): HeaderTipi {
  if (tip === 'split') return 'imza-kurumsal';
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
    aramaAcilis: 'alt',
    ustBantKaydirincaGizlePc: false,
    ustBantKaydirincaGizleMobil: false,
    kullaniciGoster: true,
    temaGosterPc: true,
    temaGosterMobil: true,
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
    case 'yuzen-hap':
      return { ...ortak, aramaModu: 'ikon', aramaGoster: true, ctaMetni: 'Başla', ctaLink: '/iletisim' };
    case 'masthead':
      return { ...ortak, aramaGoster: false, destekMetni: 'Günlük yayın' };
    case 'imza-kurumsal':
      return {
        ...ortak,
        sabit: true,
        arkaPlanRengi: '#0b2a77',
        ustBantRengi: '#08245f',
        metinRengi: '#ffffff',
        butonRengi: '#eef4ff',
        aramaModu: 'ikon',
        aramaGoster: true,
        kullaniciGoster: false,
        ctaMetni: 'Katalog',
        ctaLink: '/katalog',
      };
    default: return ortak;
  }
}

export function tipEkBirlestir(tip: HeaderTipi, mevcut?: HeaderTipEkAyarlari | null): HeaderTipEkAyarlari {
  return { ...varsayilanTipEk(tip), ...mevcut };
}
