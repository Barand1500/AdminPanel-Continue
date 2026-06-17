import { logoBoyutuNormalize, VARSAYILAN_LOGO_BOYUTU, type LogoBoyutu } from './logo';

export type FooterSema = 'dort-kolon' | 'uc-kolon' | 'iki-kolon' | 'merkezi';
export type FooterLinkIkon = 'chevron' | 'ok' | 'bullet' | 'yok';

export interface FooterLink {
  id: string;
  ad: string;
  link: string;
  yeniSekme: boolean;
  aktif: boolean;
  sira: number;
}

export interface FooterKolon {
  id: string;
  baslik: string;
  aktif: boolean;
  sira: number;
  linkler: FooterLink[];
}

export interface FooterPazaryeriOgesi {
  id: string;
  ad: string;
  link: string;
  aktif: boolean;
  sira: number;
}

export interface FooterRozet {
  id: string;
  ikon: string;
  metin: string;
  aktif: boolean;
  sira: number;
}

export type FooterYuzucuButonTip = 'telefon' | 'whatsapp' | 'yukari' | 'link';

export interface FooterYuzucuButon {
  id: string;
  tip: FooterYuzucuButonTip;
  baslik: string;
  link: string;
  ikon: string;
  aktif: boolean;
  sira: number;
}

export const FOOTER_YUZUCU_TIP_ETIKET: Record<FooterYuzucuButonTip, string> = {
  telefon: 'Telefon',
  whatsapp: 'WhatsApp',
  yukari: 'Yukarı çık',
  link: 'Özel link',
};

export interface FooterAyarlari {
  sema: FooterSema;
  linkIkon: FooterLinkIkon;
  marka: {
    logoGoster: boolean;
    logoBoyutu: LogoBoyutu;
    sosyalGoster: boolean;
    bankaLinki: { aktif: boolean; ad: string; link: string; ikon: string };
    iletisimIkonlari: { adres: string; email: string; telefon: string; whatsapp: string };
  };
  kolonlar: FooterKolon[];
  pazaryeri: { aktif: boolean; ogeler: FooterPazaryeriOgesi[] };
  guvenBandi: { aktif: boolean; rozetler: FooterRozet[]; kurlarGoster: boolean };
  yuzucuButonlar: { aktif: boolean; ogeler: FooterYuzucuButon[] };
}

export const FOOTER_SEMA_ETIKET: Record<FooterSema, { ad: string; aciklama: string }> = {
  'dort-kolon': { ad: '4 Kolon', aciklama: 'Marka + 3 link kolonu (klasik)' },
  'uc-kolon': { ad: '3 Kolon', aciklama: 'Marka üstte, linkler altta' },
  'iki-kolon': { ad: '2 Kolon', aciklama: 'Marka ve linkler dengeli 2 sütun' },
  merkezi: { ad: 'Merkezi', aciklama: 'Ortalanmış, dikey düzen' },
};

export const FOOTER_LINK_IKON_ETIKET: Record<FooterLinkIkon, string> = {
  chevron: '› Chevron',
  ok: '→ Ok',
  bullet: '• Nokta',
  yok: 'İkonsuz',
};

export function yeniFooterId(): string {
  return crypto.randomUUID();
}

function linkOlustur(ad: string, link: string, sira: number): FooterLink {
  return { id: yeniFooterId(), ad, link, yeniSekme: false, aktif: true, sira };
}

function varsayilanYuzucuButonlar(): FooterYuzucuButon[] {
  return [
    { id: yeniFooterId(), tip: 'telefon', baslik: 'Bizi Arayın', link: '', ikon: '', aktif: true, sira: 0 },
    { id: yeniFooterId(), tip: 'whatsapp', baslik: 'WhatsApp', link: '', ikon: '', aktif: true, sira: 1 },
    { id: yeniFooterId(), tip: 'yukari', baslik: 'Yukarı', link: '', ikon: '', aktif: true, sira: 2 },
  ];
}

/** Eski boolean formatından ogeler dizisine geçiş */
function yuzucuButonlarNormalize(
  ham?: FooterAyarlari['yuzucuButonlar'] | { aktif?: boolean; telefon?: boolean; whatsapp?: boolean; yukari?: boolean; ogeler?: FooterYuzucuButon[] } | null
): { aktif: boolean; ogeler: FooterYuzucuButon[] } {
  const varsayilan = { aktif: true, ogeler: varsayilanYuzucuButonlar() };
  if (!ham) return varsayilan;

  if (ham.ogeler?.length) {
    return {
      aktif: ham.aktif ?? true,
      ogeler: [...ham.ogeler].sort((a, b) => a.sira - b.sira),
    };
  }

  const eski = ham as { aktif?: boolean; telefon?: boolean; whatsapp?: boolean; yukari?: boolean };
  if ('telefon' in eski || 'whatsapp' in eski || 'yukari' in eski) {
    const ogeler: FooterYuzucuButon[] = [];
    let sira = 0;
    if (eski.telefon !== false) {
      ogeler.push({
        id: yeniFooterId(),
        tip: 'telefon',
        baslik: 'Bizi Arayın',
        link: '',
        ikon: '',
        aktif: eski.telefon ?? true,
        sira: sira++,
      });
    }
    if (eski.whatsapp !== false) {
      ogeler.push({
        id: yeniFooterId(),
        tip: 'whatsapp',
        baslik: 'WhatsApp',
        link: '',
        ikon: '',
        aktif: eski.whatsapp ?? true,
        sira: sira++,
      });
    }
    if (eski.yukari !== false) {
      ogeler.push({
        id: yeniFooterId(),
        tip: 'yukari',
        baslik: 'Yukarı',
        link: '',
        ikon: '',
        aktif: eski.yukari ?? true,
        sira: sira++,
      });
    }
    return { aktif: eski.aktif ?? true, ogeler: ogeler.length ? ogeler : varsayilan.ogeler };
  }

  return varsayilan;
}

function kolonOlustur(baslik: string, sira: number, linkler: { ad: string; link: string }[]): FooterKolon {
  return {
    id: yeniFooterId(),
    baslik,
    aktif: true,
    sira,
    linkler: linkler.map((l, i) => linkOlustur(l.ad, l.link, i)),
  };
}

export function varsayilanFooterAyarlari(): FooterAyarlari {
  return {
    sema: 'dort-kolon',
    linkIkon: 'chevron',
    marka: {
      logoGoster: true,
      logoBoyutu: VARSAYILAN_LOGO_BOYUTU,
      sosyalGoster: true,
      bankaLinki: { aktif: true, ad: 'Banka Hesaplarımız', link: '/iletisim', ikon: '🏦' },
      iletisimIkonlari: { adres: '📍', email: '✉️', telefon: '📞', whatsapp: '💬' },
    },
    kolonlar: [
      kolonOlustur('Sık Kullanılanlar', 0, [
        { ad: 'Tüm Kategoriler', link: '/urunler' },
        { ad: 'Tüm Kampanyalar', link: '/urunler' },
        { ad: 'Markalar', link: '/urunler' },
        { ad: 'Çok Satanlar', link: '/urunler' },
        { ad: 'Yeni Ürünler', link: '/urunler' },
        { ad: 'Ana Sayfa', link: '/' },
        { ad: 'Hakkımızda', link: '/hakkimizda' },
      ]),
      kolonOlustur('Sözleşmeler', 1, [
        { ad: 'Üyelik Sözleşmesi', link: '/kvkk' },
        { ad: 'Ön Bilgilendirme Formu', link: '/gizlilik' },
        { ad: 'Mesafeli Satış Sözleşmesi', link: '/mesafeli-satis' },
        { ad: 'Teslimat, İptal ve İade Politikası', link: '/mesafeli-satis' },
        { ad: 'Aydınlatma Metni', link: '/kvkk' },
        { ad: 'Gizlilik Politikası', link: '/gizlilik' },
      ]),
      kolonOlustur('Bilgi / İletişim', 2, [
        { ad: 'Hakkımızda', link: '/hakkimizda' },
        { ad: 'İletişim', link: '/iletisim' },
        { ad: 'Hesabım', link: '/hesabim' },
      ]),
    ],
    pazaryeri: {
      aktif: true,
      ogeler: [
        { id: yeniFooterId(), ad: 'Hepsiburada', link: '', aktif: true, sira: 0 },
        { id: yeniFooterId(), ad: 'Trendyol', link: '', aktif: true, sira: 1 },
        { id: yeniFooterId(), ad: 'N11', link: '', aktif: true, sira: 2 },
        { id: yeniFooterId(), ad: 'Pazarama', link: '', aktif: true, sira: 3 },
      ],
    },
    guvenBandi: {
      aktif: true,
      kurlarGoster: true,
      rozetler: [
        { id: yeniFooterId(), ikon: '🔒', metin: '256 BIT SSL Güvenli Alışveriş', aktif: true, sira: 0 },
        { id: yeniFooterId(), ikon: '🛡️', metin: '3DS Secure', aktif: true, sira: 1 },
      ],
    },
    yuzucuButonlar: { aktif: true, ogeler: varsayilanYuzucuButonlar() },
  };
}

export function footerAyarlariBirlestir(
  ayarlar?: { footerAyarlariJson?: FooterAyarlari | null } | null
): FooterAyarlari {
  const varsayilan = varsayilanFooterAyarlari();
  const ham = ayarlar?.footerAyarlariJson;
  if (!ham) return varsayilan;

  return {
    sema: ham.sema ?? varsayilan.sema,
    linkIkon: ham.linkIkon ?? varsayilan.linkIkon,
    marka: {
      logoGoster: ham.marka?.logoGoster ?? varsayilan.marka.logoGoster,
      logoBoyutu: logoBoyutuNormalize(ham.marka?.logoBoyutu ?? varsayilan.marka.logoBoyutu),
      sosyalGoster: ham.marka?.sosyalGoster ?? varsayilan.marka.sosyalGoster,
      bankaLinki: { ...varsayilan.marka.bankaLinki, ...ham.marka?.bankaLinki },
      iletisimIkonlari: { ...varsayilan.marka.iletisimIkonlari, ...ham.marka?.iletisimIkonlari },
    },
    kolonlar: ham.kolonlar?.length
      ? [...ham.kolonlar]
          .sort((a, b) => a.sira - b.sira)
          .map((k) => ({
            ...k,
            linkler: k.linkler.map((l) => ({ ...l, aktif: l.aktif ?? true })),
          }))
      : varsayilan.kolonlar,
    pazaryeri: {
      aktif: ham.pazaryeri?.aktif ?? varsayilan.pazaryeri.aktif,
      ogeler: ham.pazaryeri?.ogeler?.length
        ? [...ham.pazaryeri.ogeler].sort((a, b) => a.sira - b.sira)
        : varsayilan.pazaryeri.ogeler,
    },
    guvenBandi: {
      aktif: ham.guvenBandi?.aktif ?? varsayilan.guvenBandi.aktif,
      kurlarGoster: ham.guvenBandi?.kurlarGoster ?? varsayilan.guvenBandi.kurlarGoster,
      rozetler: ham.guvenBandi?.rozetler?.length
        ? [...ham.guvenBandi.rozetler].sort((a, b) => a.sira - b.sira)
        : varsayilan.guvenBandi.rozetler,
    },
    yuzucuButonlar: yuzucuButonlarNormalize(ham.yuzucuButonlar),
  };
}

export function footerLinkIkonGoster(tip: FooterLinkIkon): string | null {
  if (tip === 'chevron') return '›';
  if (tip === 'ok') return '→';
  if (tip === 'bullet') return '•';
  return null;
}

export function footerSemaGridSinifi(sema: FooterSema): string {
  switch (sema) {
    case 'uc-kolon':
      return 'footer-sema-uc';
    case 'iki-kolon':
      return 'footer-sema-iki';
    case 'merkezi':
      return 'footer-sema-merkezi';
    default:
      return 'footer-sema-dort';
  }
}
