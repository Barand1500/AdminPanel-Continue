import type { FooterKolon, FooterPazaryeriOgesi, FooterRozet } from '@/types/footer';
import type { FooterTipi } from './footerTipleri';

export interface FooterTipDemoPaket {
  siteAdi: string;
  anaRenk: string;
  ikincilRenk: string;
  footerBg?: string;
  adres: string;
  telefon: string;
  email: string;
  whatsapp: string;
  telifYazisi: string;
  kolonlar: FooterKolon[];
  pazaryeri: FooterPazaryeriOgesi[];
  rozetler: FooterRozet[];
  sosyalMedya: Record<string, string>;
  ornekNotu: string;
}

function kolon(id: string, baslik: string, linkler: { ad: string; link: string }[]): FooterKolon {
  return {
    id,
    baslik,
    aktif: true,
    sira: 0,
    linkler: linkler.map((l, i) => ({
      id: `${id}-${i}`,
      ad: l.ad,
      link: l.link,
      yeniSekme: false,
      aktif: true,
      sira: i,
    })),
  };
}

/** Footer tipi önizlemesi için sahte örnek veriler — gerçek site içeriği değildir */
export const FOOTER_TIP_DEMO: Record<FooterTipi, FooterTipDemoPaket> = {
  klasik: {
    siteAdi: 'ModaMarket',
    anaRenk: '#f27a1a',
    ikincilRenk: '#ffb347',
    adres: 'Maslak Mah. Örnek Cad. No:1, İstanbul',
    telefon: '0850 123 45 67',
    email: 'destek@modamarket-ornek.com',
    whatsapp: '+905551234567',
    telifYazisi: '© 2026 ModaMarket — Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Trendyol tarzı e-ticaret footer örneği',
    sosyalMedya: { instagram: '#', twitter: '#', facebook: '#' },
    kolonlar: [
      kolon('k1', 'Sık Kullanılanlar', [
        { ad: 'Kampanyalar', link: '#' },
        { ad: 'Yardım Merkezi', link: '#' },
        { ad: 'Sipariş Takibi', link: '#' },
      ]),
      kolon('k2', 'Kurumsal', [
        { ad: 'Hakkımızda', link: '#' },
        { ad: 'Kariyer', link: '#' },
        { ad: 'Basın', link: '#' },
      ]),
      kolon('k3', 'Yasal', [
        { ad: 'KVKK', link: '#' },
        { ad: 'Mesafeli Satış', link: '#' },
        { ad: 'İade Politikası', link: '#' },
      ]),
    ],
    pazaryeri: [
      { id: 'p1', ad: 'Hepsiburada', link: '#', aktif: true, sira: 0 },
      { id: 'p2', ad: 'Trendyol', link: '#', aktif: true, sira: 1 },
      { id: 'p3', ad: 'N11', link: '#', aktif: true, sira: 2 },
    ],
    rozetler: [
      { id: 'r1', ikon: '🔒', metin: '256 BIT SSL', aktif: true, sira: 0 },
      { id: 'r2', ikon: '🛡️', metin: '3DS Secure', aktif: true, sira: 1 },
    ],
  },
  sade: {
    siteAdi: 'Nexus',
    anaRenk: '#1d1d1f',
    ikincilRenk: '#86868b',
    adres: '',
    telefon: '',
    email: '',
    whatsapp: '',
    telifYazisi: '© 2026 Nexus. Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Apple tarzı minimal footer — sahte marka "Nexus"',
    sosyalMedya: { instagram: '#', youtube: '#' },
    kolonlar: [
      kolon('k1', '', [
        { ad: 'Mağaza', link: '#' },
        { ad: 'Mac', link: '#' },
        { ad: 'iPad', link: '#' },
        { ad: 'iPhone', link: '#' },
        { ad: 'Destek', link: '#' },
        { ad: 'Gizlilik', link: '#' },
      ]),
    ],
    pazaryeri: [],
    rozetler: [],
  },
  kurumsal: {
    siteAdi: 'CloudWorks',
    anaRenk: '#0078d4',
    ikincilRenk: '#50e6ff',
    adres: 'Levent Plaza, İstanbul',
    telefon: '+90 212 555 0202',
    email: 'info@cloudworks-ornek.com',
    whatsapp: '',
    telifYazisi: '© 2026 CloudWorks — Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Microsoft tarzı kurumsal footer örneği',
    sosyalMedya: { linkedin: '#', twitter: '#' },
    kolonlar: [
      kolon('k1', 'Ürünler', [
        { ad: 'Bulut Hizmetleri', link: '#' },
        { ad: 'Güvenlik', link: '#' },
        { ad: 'Fiyatlandırma', link: '#' },
      ]),
      kolon('k2', 'Kaynaklar', [
        { ad: 'Dokümantasyon', link: '#' },
        { ad: 'API', link: '#' },
        { ad: 'Destek', link: '#' },
      ]),
      kolon('k3', 'Şirket', [
        { ad: 'Hakkımızda', link: '#' },
        { ad: 'Kariyer', link: '#' },
        { ad: 'İletişim', link: '#' },
      ]),
    ],
    pazaryeri: [],
    rozetler: [
      { id: 'r1', ikon: '🔒', metin: 'ISO 27001 Sertifikalı', aktif: true, sira: 0 },
      { id: 'r2', ikon: '✓', metin: 'KVKK Uyumlu', aktif: true, sira: 1 },
      { id: 'r3', ikon: '🛡️', metin: 'SOC 2 Type II', aktif: true, sira: 2 },
    ],
  },
  magaza: {
    siteAdi: 'MegaPazar',
    anaRenk: '#ff6000',
    ikincilRenk: '#ff8c42',
    adres: 'Ankara Teknopark, Ankara',
    telefon: '444 0 444',
    email: 'yardim@megapazar-ornek.com',
    whatsapp: '+905559876543',
    telifYazisi: '© 2026 MegaPazar — Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Hepsiburada tarzı pazaryeri footer örneği',
    sosyalMedya: { instagram: '#', facebook: '#' },
    kolonlar: [
      kolon('k1', 'Kategoriler', [
        { ad: 'Elektronik', link: '#' },
        { ad: 'Ev & Yaşam', link: '#' },
        { ad: 'Moda', link: '#' },
      ]),
      kolon('k2', 'Müşteri Hizmetleri', [
        { ad: 'Siparişlerim', link: '#' },
        { ad: 'İade', link: '#' },
        { ad: 'SSS', link: '#' },
      ]),
      kolon('k3', 'Kurumsal', [
        { ad: 'Satıcı Ol', link: '#' },
        { ad: 'Kariyer', link: '#' },
      ]),
    ],
    pazaryeri: [
      { id: 'p1', ad: 'Hepsiburada', link: '#', aktif: true, sira: 0 },
      { id: 'p2', ad: 'Trendyol', link: '#', aktif: true, sira: 1 },
      { id: 'p3', ad: 'N11', link: '#', aktif: true, sira: 2 },
      { id: 'p4', ad: 'Pazarama', link: '#', aktif: true, sira: 3 },
    ],
    rozetler: [
      { id: 'r1', ikon: '🔒', metin: '256 BIT SSL', aktif: true, sira: 0 },
    ],
  },
  merkezi: {
    siteAdi: 'ATELIER',
    anaRenk: '#111111',
    ikincilRenk: '#c9a962',
    adres: 'Nişantaşı, İstanbul',
    telefon: '+90 212 555 0101',
    email: 'info@atelier-ornek.com',
    whatsapp: '',
    telifYazisi: '© 2026 ATELIER — Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Zara tarzı merkezi footer örneği',
    sosyalMedya: { instagram: '#' },
    kolonlar: [
      kolon('k1', '', [
        { ad: 'Kadın', link: '#' },
        { ad: 'Erkek', link: '#' },
        { ad: 'Çocuk', link: '#' },
        { ad: 'Lookbook', link: '#' },
      ]),
    ],
    pazaryeri: [],
    rozetler: [],
  },
  newsletter: {
    siteAdi: 'MailFlow',
    anaRenk: '#635bff',
    ikincilRenk: '#a78bfa',
    adres: 'San Francisco, CA (Örnek)',
    telefon: '',
    email: 'hello@mailflow-ornek.com',
    whatsapp: '',
    telifYazisi: '© 2026 MailFlow — Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Mailchimp tarzı newsletter footer örneği',
    sosyalMedya: { twitter: '#', linkedin: '#' },
    kolonlar: [
      kolon('k1', 'Ürün', [
        { ad: 'Özellikler', link: '#' },
        { ad: 'Fiyatlandırma', link: '#' },
        { ad: 'Entegrasyonlar', link: '#' },
      ]),
      kolon('k2', 'Kaynaklar', [
        { ad: 'Blog', link: '#' },
        { ad: 'Yardım', link: '#' },
        { ad: 'API', link: '#' },
      ]),
      kolon('k3', 'Yasal', [
        { ad: 'Gizlilik', link: '#' },
        { ad: 'Kullanım Koşulları', link: '#' },
      ]),
    ],
    pazaryeri: [],
    rozetler: [],
  },
  kompakt: {
    siteAdi: 'SPRINT',
    anaRenk: '#111111',
    ikincilRenk: '#757575',
    adres: '',
    telefon: '',
    email: '',
    whatsapp: '',
    telifYazisi: '© 2026 SPRINT. (Örnek)',
    ornekNotu: 'Nike tarzı kompakt footer — sahte marka "SPRINT"',
    sosyalMedya: { instagram: '#', twitter: '#' },
    kolonlar: [
      kolon('k1', '', [
        { ad: 'Yeni', link: '#' },
        { ad: 'Erkek', link: '#' },
        { ad: 'Kadın', link: '#' },
        { ad: 'Outlet', link: '#' },
      ]),
    ],
    pazaryeri: [],
    rozetler: [],
  },
  detayli: {
    siteAdi: 'MegaStore',
    anaRenk: '#232f3e',
    ikincilRenk: '#ff9900',
    adres: 'İstanbul, Türkiye',
    telefon: '444 0 999',
    email: 'destek@megastore-ornek.com',
    whatsapp: '+905551112233',
    telifYazisi: '© 2026 MegaStore — Tüm hakları saklıdır. (Örnek)',
    ornekNotu: 'Amazon tarzı detaylı footer örneği',
    sosyalMedya: { facebook: '#', instagram: '#', twitter: '#' },
    kolonlar: [
      kolon('k1', 'Alışveriş', [
        { ad: 'Günün Fırsatları', link: '#' },
        { ad: 'Kategoriler', link: '#' },
        { ad: 'Hediye Kartları', link: '#' },
      ]),
      kolon('k2', 'Hesabınız', [
        { ad: 'Siparişlerim', link: '#' },
        { ad: 'Listelerim', link: '#' },
        { ad: 'İade', link: '#' },
      ]),
      kolon('k3', 'Yardım', [
        { ad: 'Müşteri Hizmetleri', link: '#' },
        { ad: 'Kargo & Teslimat', link: '#' },
        { ad: 'SSS', link: '#' },
      ]),
    ],
    pazaryeri: [
      { id: 'p1', ad: 'Hepsiburada', link: '#', aktif: true, sira: 0 },
      { id: 'p2', ad: 'Trendyol', link: '#', aktif: true, sira: 1 },
    ],
    rozetler: [
      { id: 'r1', ikon: '🔒', metin: '256 BIT SSL', aktif: true, sira: 0 },
      { id: 'r2', ikon: '🛡️', metin: '3DS Secure', aktif: true, sira: 1 },
    ],
  },
};

export function footerTipDemoPaketi(tip: FooterTipi): FooterTipDemoPaket {
  return FOOTER_TIP_DEMO[tip] ?? FOOTER_TIP_DEMO.klasik;
}
