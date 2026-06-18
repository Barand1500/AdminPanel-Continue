import type { SitePublicData } from '@/types/site';
import { sayfaMenuAgaciOlustur } from '@/utils/sayfaAgaci';

export const bosSiteVerisi: SitePublicData = {
  site: {
    id: '',
    ad: 'Güzel Teknoloji',
    slug: 'demo',
    aktif: true,
    ayarlar: {
      anaRenk: '#7c3aed',
      ikincilRenk: '#a78bfa',
      slogan: null,
      telefon: null,
      email: null,
      adres: null,
      whatsapp: null,
      telifYazisi: null,
      heroJson: null,
    },
  },
  sayfalar: [],
  widgetlar: [],
  urunler: [],
  bloglar: [],
  navKategoriler: [],
};

export function sayfaYolunuBul(slug: string): string {
  if (slug === 'ana-sayfa') return '/';
  return `/${slug}`;
}

export function menuOgeleriOlustur(
  sayfalar: SitePublicData['sayfalar'],
  blogAyarlari?: import('@/types/blog').BlogAyarlari
) {
  const apiMenu = sayfaMenuAgaciOlustur(sayfalar);

  if (apiMenu.length > 0) return apiMenu;

  const varsayilan: { baslik: string; yol: string }[] = [
    { baslik: 'Ana Sayfa', yol: '/' },
    { baslik: 'Ürünler', yol: '/urunler' },
  ];

  if (blogAyarlari?.headerMenu !== false) {
    varsayilan.push({ baslik: 'Blog', yol: '/blog' });
  }

  varsayilan.push(
    { baslik: 'Hakkımızda', yol: '/hakkimizda' },
    { baslik: 'İletişim', yol: '/iletisim' }
  );

  return varsayilan;
}
