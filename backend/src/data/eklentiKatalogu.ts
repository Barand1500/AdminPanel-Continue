export type EklentiKategori = 'one-cikan' | 'populer' | 'onerilen';

export interface EklentiKatalogKaydi {
  kod: string;
  ad: string;
  aciklama: string;
  gelistirici: string;
  ikon: string;
  kategori: EklentiKategori;
  surum: string;
  puan: number;
  etkinKurulum: number;
  sonGuncelleme: string;
  publicHook?: string;
}

export function varsayilanEklentiAyarlar(kod: string): Record<string, unknown> {
  switch (kod) {
    case 'duyuru-seridi':
      return {
        metin: 'Hoş geldiniz! Sitemizdeki yenilikleri keşfedin.',
        link: '/',
        linkMetin: 'Detaylar',
      };
    case 'canli-sohbet':
      return { chatScript: '' };
    default:
      return {};
  }
}

export const EKLENTI_KATALOGU: EklentiKatalogKaydi[] = [
  {
    kod: 'cerez-banner',
    ad: 'Çerez Onay Banner',
    aciklama:
      'Ziyaretçilere çerez kullanımı hakkında bilgi veren ve onay alan alt banner. KVKK uyumluluğu için temel çözüm.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '🍪',
    kategori: 'one-cikan',
    surum: '1.0.0',
    puan: 4.8,
    etkinKurulum: 1200,
    sonGuncelleme: '2026-05-10',
    publicHook: 'cerez-banner',
  },
  {
    kod: 'yukari-cik',
    ad: 'Yukarı Çık Butonu',
    aciklama:
      'Sayfa kaydırıldığında görünen yüzen buton ile ziyaretçilerin sayfa başına hızlı dönmesini sağlar.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '⬆️',
    kategori: 'one-cikan',
    surum: '1.0.2',
    puan: 4.9,
    etkinKurulum: 2100,
    sonGuncelleme: '2026-06-01',
    publicHook: 'yukari-cik',
  },
  {
    kod: 'okuma-cubugu',
    ad: 'Okuma İlerleme Çubuğu',
    aciklama:
      'Sayfa üstünde ince bir çubukla ziyaretçinin sayfayı ne kadar okuduğunu gösterir. Uzun içeriklerde kullanım kolaylığı sağlar.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '📊',
    kategori: 'one-cikan',
    surum: '1.0.0',
    puan: 4.7,
    etkinKurulum: 980,
    sonGuncelleme: '2026-06-15',
    publicHook: 'okuma-cubugu',
  },
  {
    kod: 'duyuru-seridi',
    ad: 'Duyuru Şeridi',
    aciklama:
      'Site üstünde kampanya veya duyuru metni gösterir. Ziyaretçi kapattığında bir daha görünmez.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '📢',
    kategori: 'one-cikan',
    surum: '1.0.0',
    puan: 4.6,
    etkinKurulum: 760,
    sonGuncelleme: '2026-06-12',
    publicHook: 'duyuru-seridi',
  },
  {
    kod: 'sosyal-paylas',
    ad: 'Sosyal Paylaşım',
    aciklama:
      'Sayfayı X, Facebook, WhatsApp ile paylaşma veya link kopyalama butonu. Mobilde yerel paylaşım menüsünü de açar.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '🔗',
    kategori: 'one-cikan',
    surum: '1.0.0',
    puan: 4.5,
    etkinKurulum: 540,
    sonGuncelleme: '2026-06-10',
    publicHook: 'sosyal-paylas',
  },
  {
    kod: 'yazi-buyutucu',
    ad: 'Yazı Boyutu Ayarı',
    aciklama:
      'Erişilebilirlik için ziyaretçilerin site metnini büyütüp küçültmesini sağlayan A− / A / A+ kontrolü.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '🔤',
    kategori: 'one-cikan',
    surum: '1.0.0',
    puan: 4.8,
    etkinKurulum: 430,
    sonGuncelleme: '2026-06-08',
    publicHook: 'yazi-buyutucu',
  },
  {
    kod: 'canli-sohbet',
    ad: 'Canlı Sohbet Widget',
    aciklama:
      'Üçüncü parti canlı sohbet sağlayıcı scriptini siteye ekler. Tawk.to, Crisp veya özel chat kodu destekler.',
    gelistirici: 'Güzel Teknoloji',
    ikon: '💬',
    kategori: 'populer',
    surum: '1.1.0',
    puan: 4.6,
    etkinKurulum: 890,
    sonGuncelleme: '2026-04-22',
    publicHook: 'canli-sohbet',
  },
];

export function katalogKaydiBul(kod: string): EklentiKatalogKaydi | undefined {
  return EKLENTI_KATALOGU.find((e) => e.kod === kod);
}
