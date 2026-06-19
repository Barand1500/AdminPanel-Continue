import type { Kategori } from '@/data/kategoriler';
import type { MenuOgesi } from '@/types/site';
import type { HeaderTipi } from './headerTipleri';

export interface HeaderTipDemoPaket {
  markaMetni: string;
  slogan: string;
  telefon: string;
  email: string;
  anaRenk: string;
  ikincilRenk: string;
  aramaPlaceholder: string;
  menu: MenuOgesi[];
  kategoriler: Kategori[];
  ornekNotu: string;
}

function menu(ogeler: { baslik: string; yol?: string }[]): MenuOgesi[] {
  return ogeler.map((o) => ({
    baslik: o.baslik,
    yol: o.yol ?? '#',
    ikon: null,
  }));
}

function kat(id: string, baslik: string, alt?: Kategori[]): Kategori {
  return { id, baslik, yol: '#', altKategoriler: alt };
}

/** Header tipi önizlemesi için sahte örnek veriler — gerçek site içeriği değildir */
export const HEADER_TIP_DEMO: Record<HeaderTipi, HeaderTipDemoPaket> = {
  klasik: {
    markaMetni: 'ModaMarket',
    slogan: 'Moda, elektronik ve ev — binlerce ürün, hızlı kargo',
    telefon: '0850 123 45 67',
    email: 'destek@modamarket-ornek.com',
    anaRenk: '#f27a1a',
    ikincilRenk: '#ffb347',
    aramaPlaceholder: 'Ürün, kategori veya marka ara...',
    ornekNotu: 'Trendyol tarzı e-ticaret örneği — sahte marka',
    menu: menu([
      { baslik: 'Kadın' },
      { baslik: 'Erkek' },
      { baslik: 'Elektronik' },
      { baslik: 'Ev & Yaşam' },
      { baslik: 'Süper Fiyat' },
    ]),
    kategoriler: [
      kat('giyim', 'Giyim', [kat('kadin', 'Kadın'), kat('erkek', 'Erkek'), kat('cocuk', 'Çocuk')]),
      kat('elektronik', 'Elektronik'),
      kat('kozmetik', 'Kozmetik'),
    ],
  },
  sade: {
    markaMetni: 'Nexus',
    slogan: '',
    telefon: '',
    email: '',
    anaRenk: '#1d1d1f',
    ikincilRenk: '#86868b',
    aramaPlaceholder: 'Ara',
    ornekNotu: 'Apple tarzı minimal örnek — sahte marka "Nexus"',
    menu: menu([
      { baslik: 'Mağaza' },
      { baslik: 'Mac' },
      { baslik: 'iPad' },
      { baslik: 'iPhone' },
      { baslik: 'Watch' },
      { baslik: 'AirPods' },
      { baslik: 'TV' },
      { baslik: 'Destek' },
    ]),
    kategoriler: [],
  },
  kompakt: {
    markaMetni: 'SPRINT',
    slogan: '',
    telefon: '',
    email: '',
    anaRenk: '#111111',
    ikincilRenk: '#757575',
    aramaPlaceholder: 'Ara',
    ornekNotu: 'Nike tarzı kompakt spor örneği — sahte marka "SPRINT"',
    menu: menu([
      { baslik: 'Yeni' },
      { baslik: 'Erkek' },
      { baslik: 'Kadın' },
      { baslik: 'Çocuk' },
      { baslik: 'Koşu' },
      { baslik: 'Outlet' },
    ]),
    kategoriler: [],
  },
  'merkez-logo': {
    markaMetni: 'ATELIER',
    slogan: 'Sezon koleksiyonu — yeni sezon',
    telefon: '+90 212 555 0101',
    email: 'info@atelier-ornek.com',
    anaRenk: '#111111',
    ikincilRenk: '#c9a962',
    aramaPlaceholder: 'Ara',
    ornekNotu: 'Zara / lüks moda tarzı örnek — sahte marka',
    menu: menu([{ baslik: 'Kadın' }, { baslik: 'Erkek' }, { baslik: 'Çocuk' }, { baslik: 'Lookbook' }]),
    kategoriler: [],
  },
  'arama-odakli': {
    markaMetni: 'MegaShop',
    slogan: 'Her şey tek adreste',
    telefon: '444 0 444',
    email: 'yardim@megashop-ornek.com',
    anaRenk: '#232f3e',
    ikincilRenk: '#ff9900',
    aramaPlaceholder: 'Ne aramıştınız?',
    ornekNotu: 'Amazon tarzı arama odaklı örnek — sahte marka',
    menu: menu([{ baslik: 'Günün Fırsatları' }, { baslik: 'Müşteri Hizmetleri' }, { baslik: 'Hesabım' }]),
    kategoriler: [
      kat('elektronik', 'Elektronik'),
      kat('kitap', 'Kitap'),
      kat('ev', 'Ev & Mutfak'),
      kat('spor', 'Spor'),
    ],
  },
  modern: {
    markaMetni: 'Flowbase',
    slogan: '',
    telefon: '',
    email: 'hello@flowbase-ornek.com',
    anaRenk: '#635bff',
    ikincilRenk: '#80e9ff',
    aramaPlaceholder: 'Ara',
    ornekNotu: 'Stripe / SaaS tarzı örnek — sahte marka "Flowbase"',
    menu: menu([
      { baslik: 'Ürünler' },
      { baslik: 'Çözümler' },
      { baslik: 'Geliştiriciler' },
      { baslik: 'Fiyatlandırma' },
    ]),
    kategoriler: [],
  },
  kurumsal: {
    markaMetni: 'TechCorp',
    slogan: 'Kurumsal çözümler — 25 yıllık deneyim',
    telefon: '+90 216 555 0202',
    email: 'info@techcorp-ornek.com',
    anaRenk: '#0078d4',
    ikincilRenk: '#50a0dc',
    aramaPlaceholder: 'Site içinde ara...',
    ornekNotu: 'Microsoft tarzı kurumsal örnek — sahte marka',
    menu: menu([
      { baslik: 'Ürünler' },
      { baslik: 'Sektörler' },
      { baslik: 'Kaynaklar' },
      { baslik: 'Destek' },
    ]),
    kategoriler: [
      kat('yazilim', 'Yazılım'),
      kat('bulut', 'Bulut'),
      kat('guvenlik', 'Güvenlik'),
    ],
  },
  'mega-menu': {
    markaMetni: 'TechZone',
    slogan: 'Teknoloji süper mağazası',
    telefon: '0850 222 33 44',
    email: 'info@techzone-ornek.com',
    anaRenk: '#e30613',
    ikincilRenk: '#ff6b6b',
    aramaPlaceholder: 'Ürün ara...',
    ornekNotu: 'Teknosa / MediaMarkt tarzı mega menü örneği',
    menu: menu([{ baslik: 'Kampanyalar' }, { baslik: 'Markalar' }, { baslik: 'Mağazalar' }]),
    kategoriler: [
      kat('telefon', 'Telefon', [kat('android', 'Android'), kat('iphone', 'iPhone')]),
      kat('bilgisayar', 'Bilgisayar', [kat('laptop', 'Laptop'), kat('masaustu', 'Masaüstü')]),
      kat('tv', 'TV & Ses'),
      kat('beyaz', 'Beyaz Eşya'),
    ],
  },
  'seffaf-hero': {
    markaMetni: 'VOLT',
    slogan: '',
    telefon: '',
    email: '',
    anaRenk: '#e82127',
    ikincilRenk: '#ffffff',
    aramaPlaceholder: 'Ara',
    ornekNotu: 'Tesla tarzı hero overlay örneği — sahte marka "VOLT"',
    menu: menu([
      { baslik: 'Modeller' },
      { baslik: 'Enerji' },
      { baslik: 'Şarj' },
      { baslik: 'Keşfet' },
      { baslik: 'Mağaza' },
    ]),
    kategoriler: [],
  },
  split: {
    markaMetni: 'NORDHOME',
    slogan: 'Eviniz için her şey',
    telefon: '444 4 555',
    email: 'info@nordhome-ornek.com',
    anaRenk: '#0058a3',
    ikincilRenk: '#ffdb00',
    aramaPlaceholder: 'Ürün veya oda ara...',
    ornekNotu: 'IKEA tarzı split düzen örneği — sahte marka',
    menu: menu([{ baslik: 'Fikirler' }, { baslik: 'Planlayıcı' }, { baslik: 'Hizmetler' }]),
    kategoriler: [
      kat('oturma', 'Oturma Odası'),
      kat('mutfak', 'Mutfak'),
      kat('yatak', 'Yatak Odası'),
      kat('banyo', 'Banyo'),
    ],
  },
};

export function headerTipDemoPaketi(tip: HeaderTipi): HeaderTipDemoPaket {
  return HEADER_TIP_DEMO[tip] ?? HEADER_TIP_DEMO.klasik;
}
