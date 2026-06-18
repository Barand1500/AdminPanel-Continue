export type DashboardDonem = 'bugun' | '7gun' | '30gun';

export interface DashboardAnalitikVeri {
  ziyaret: number;
  sayfaGoruntulenme: number;
  ziyaretGrafik: { etiket: string; deger: number }[];
  ulkeler: { ulke: string; ziyaret: number }[];
  bloglar: { baslik: string; okuma: number }[];
  sayfalar: { ad: string; goruntulenme: number }[];
  butonlar: { ad: string; tiklama: number }[];
}

const MOCK: Record<DashboardDonem, DashboardAnalitikVeri> = {
  bugun: {
    ziyaret: 124,
    sayfaGoruntulenme: 289,
    ziyaretGrafik: [
      { etiket: '00', deger: 4 },
      { etiket: '04', deger: 2 },
      { etiket: '08', deger: 18 },
      { etiket: '10', deger: 26 },
      { etiket: '12', deger: 31 },
      { etiket: '14', deger: 22 },
      { etiket: '16', deger: 14 },
      { etiket: '18', deger: 5 },
      { etiket: '20', deger: 2 },
    ],
    ulkeler: [
      { ulke: 'Türkiye', ziyaret: 78 },
      { ulke: 'Almanya', ziyaret: 18 },
      { ulke: 'ABD', ziyaret: 12 },
      { ulke: 'İngiltere', ziyaret: 9 },
      { ulke: 'Diğer', ziyaret: 7 },
    ],
    bloglar: [
      { baslik: 'Kurumsal Web Sitesi Nasıl Olmalı?', okuma: 42 },
      { baslik: 'SEO İpuçları 2026', okuma: 31 },
      { baslik: 'E-Ticaret Trendleri', okuma: 18 },
      { baslik: 'Mobil Uyumluluk Rehberi', okuma: 12 },
    ],
    sayfalar: [
      { ad: 'Anasayfa', goruntulenme: 96 },
      { ad: 'Hakkımızda', goruntulenme: 54 },
      { ad: 'İletişim', goruntulenme: 37 },
      { ad: 'Blog', goruntulenme: 54 },
    ],
    butonlar: [
      { ad: 'Hero — Teklif Al', tiklama: 28 },
      { ad: 'Header — İletişim', tiklama: 15 },
      { ad: 'Footer — WhatsApp', tiklama: 12 },
      { ad: 'Widget — Hizmetler', tiklama: 9 },
    ],
  },
  '7gun': {
    ziyaret: 842,
    sayfaGoruntulenme: 1964,
    ziyaretGrafik: [
      { etiket: 'Pzt', deger: 98 },
      { etiket: 'Sal', deger: 112 },
      { etiket: 'Çar', deger: 134 },
      { etiket: 'Per', deger: 121 },
      { etiket: 'Cum', deger: 156 },
      { etiket: 'Cmt', deger: 118 },
      { etiket: 'Paz', deger: 103 },
    ],
    ulkeler: [
      { ulke: 'Türkiye', ziyaret: 521 },
      { ulke: 'Almanya', ziyaret: 112 },
      { ulke: 'ABD', ziyaret: 78 },
      { ulke: 'İngiltere', ziyaret: 54 },
      { ulke: 'Fransa', ziyaret: 38 },
      { ulke: 'Diğer', ziyaret: 39 },
    ],
    bloglar: [
      { baslik: 'Kurumsal Web Sitesi Nasıl Olmalı?', okuma: 286 },
      { baslik: 'SEO İpuçları 2026', okuma: 214 },
      { baslik: 'E-Ticaret Trendleri', okuma: 167 },
      { baslik: 'Mobil Uyumluluk Rehberi', okuma: 98 },
    ],
    sayfalar: [
      { ad: 'Anasayfa', goruntulenme: 612 },
      { ad: 'Blog', goruntulenme: 356 },
      { ad: 'Hakkımızda', goruntulenme: 298 },
      { ad: 'İletişim', goruntulenme: 300 },
    ],
    butonlar: [
      { ad: 'Hero — Teklif Al', tiklama: 186 },
      { ad: 'Header — İletişim', tiklama: 94 },
      { ad: 'Footer — WhatsApp', tiklama: 78 },
      { ad: 'Widget — Hizmetler', tiklama: 61 },
    ],
  },
  '30gun': {
    ziyaret: 3240,
    sayfaGoruntulenme: 7812,
    ziyaretGrafik: [
      { etiket: '1. Hf', deger: 712 },
      { etiket: '2. Hf', deger: 798 },
      { etiket: '3. Hf', deger: 856 },
      { etiket: '4. Hf', deger: 874 },
    ],
    ulkeler: [
      { ulke: 'Türkiye', ziyaret: 1984 },
      { ulke: 'Almanya', ziyaret: 412 },
      { ulke: 'ABD', ziyaret: 298 },
      { ulke: 'İngiltere', ziyaret: 214 },
      { ulke: 'Fransa', ziyaret: 156 },
      { ulke: 'Diğer', ziyaret: 176 },
    ],
    bloglar: [
      { baslik: 'Kurumsal Web Sitesi Nasıl Olmalı?', okuma: 1124 },
      { baslik: 'SEO İpuçları 2026', okuma: 892 },
      { baslik: 'E-Ticaret Trendleri', okuma: 654 },
      { baslik: 'Mobil Uyumluluk Rehberi', okuma: 421 },
    ],
    sayfalar: [
      { ad: 'Anasayfa', goruntulenme: 2412 },
      { ad: 'Blog', goruntulenme: 1424 },
      { ad: 'Hakkımızda', goruntulenme: 1186 },
      { ad: 'İletişim', goruntulenme: 1222 },
    ],
    butonlar: [
      { ad: 'Hero — Teklif Al', tiklama: 712 },
      { ad: 'Header — İletişim', tiklama: 384 },
      { ad: 'Footer — WhatsApp', tiklama: 298 },
      { ad: 'Widget — Hizmetler', tiklama: 241 },
    ],
  },
};

export const DONEM_ETIKETLERI: { id: DashboardDonem; etiket: string }[] = [
  { id: 'bugun', etiket: 'Bugün' },
  { id: '7gun', etiket: '7 Gün' },
  { id: '30gun', etiket: '30 Gün' },
];

export function dashboardAnalitikMock(donem: DashboardDonem): DashboardAnalitikVeri {
  return MOCK[donem];
}
