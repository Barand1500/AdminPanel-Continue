import type { SitePublicData } from '@/types/site';

export const bosSiteVerisi: SitePublicData = {
  site: {
    id: '',
    ad: 'Güzel Teknoloji',
    slug: 'demo',
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
};

export function sayfaYolunuBul(slug: string): string {
  if (slug === 'ana-sayfa') return '/';
  return `/${slug}`;
}

export function menuOgeleriOlustur(
  sayfalar: SitePublicData['sayfalar'],
  blogAyarlari?: import('@/types/blog').BlogAyarlari
) {
  const apiMenu = sayfalar
    .filter((s) => s.menudeGoster !== false)
    .sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0))
    .map((s) => ({
      baslik: s.baslik,
      yol: sayfaYolunuBul(s.slug),
      acilisModu: s.acilisModu ?? 'normal',
      yeniSekme: s.acilisModu === 'yeni_sekme',
    }));

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
