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

export const EKLENTI_KATALOGU: EklentiKatalogKaydi[] = [
  {
    kod: 'cerez-banner',
    ad: 'Çerez Onay Banner',
    aciklama:
      'Ziyaretçilere çerez kullanımı hakkında bilgi veren ve onay alan alt banner. KVKK uyumluluğu için temel çözüm.',
    gelistirici: 'SafirPanel',
    ikon: '🍪',
    kategori: 'one-cikan',
    surum: '1.0.0',
    puan: 4.8,
    etkinKurulum: 1200,
    sonGuncelleme: '2026-05-10',
    publicHook: 'cerez-banner',
  },
  {
    kod: 'canli-sohbet',
    ad: 'Canlı Sohbet Widget',
    aciklama:
      'Üçüncü parti canlı sohbet sağlayıcı scriptini siteye ekler. Tawk.to, Crisp veya özel chat kodu destekler.',
    gelistirici: 'SafirPanel',
    ikon: '💬',
    kategori: 'populer',
    surum: '1.1.0',
    puan: 4.6,
    etkinKurulum: 890,
    sonGuncelleme: '2026-04-22',
    publicHook: 'canli-sohbet',
  },
  {
    kod: 'yukari-cik',
    ad: 'Yukarı Çık Butonu',
    aciklama:
      'Sayfa kaydırıldığında görünen yüzen buton ile ziyaretçilerin sayfa başına hızlı dönmesini sağlar.',
    gelistirici: 'SafirPanel',
    ikon: '⬆️',
    kategori: 'onerilen',
    surum: '1.0.2',
    puan: 4.9,
    etkinKurulum: 2100,
    sonGuncelleme: '2026-06-01',
    publicHook: 'yukari-cik',
  },
];

export function katalogKaydiBul(kod: string): EklentiKatalogKaydi | undefined {
  return EKLENTI_KATALOGU.find((e) => e.kod === kod);
}
