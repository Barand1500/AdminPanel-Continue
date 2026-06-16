export interface Kategori {
  id: string;
  baslik: string;
  yol?: string;
  altKategoriler?: Kategori[];
}

export const kategoriler: Kategori[] = [
  {
    id: 'bilgisayar',
    baslik: 'Bilgisayar',
    altKategoriler: [
      {
        id: 'laptop',
        baslik: 'Laptop',
        altKategoriler: [
          { id: 'gaming-laptop', baslik: 'Oyuncu Laptop', yol: '/urunler?k=gaming-laptop' },
          { id: 'is-laptop', baslik: 'İş Laptop', yol: '/urunler?k=is-laptop' },
          { id: 'ultrabook', baslik: 'Ultrabook', yol: '/urunler?k=ultrabook' },
        ],
      },
      {
        id: 'masaustu',
        baslik: 'Masaüstü',
        altKategoriler: [
          { id: 'gaming-pc', baslik: 'Oyuncu PC', yol: '/urunler?k=gaming-pc' },
          { id: 'is-pc', baslik: 'İş Bilgisayarı', yol: '/urunler?k=is-pc' },
          { id: 'mini-pc', baslik: 'Mini PC', yol: '/urunler?k=mini-pc' },
        ],
      },
      { id: 'tablet', baslik: 'Tablet', yol: '/urunler?k=tablet' },
    ],
  },
  {
    id: 'telefon',
    baslik: 'Telefon & Aksesuar',
    altKategoriler: [
      {
        id: 'akilli-telefon',
        baslik: 'Akıllı Telefon',
        altKategoriler: [
          { id: 'android', baslik: 'Android', yol: '/urunler?k=android' },
          { id: 'ios', baslik: 'iOS', yol: '/urunler?k=ios' },
        ],
      },
      { id: 'kilif', baslik: 'Kılıf & Koruma', yol: '/urunler?k=kilif' },
      { id: 'sarj', baslik: 'Şarj & Kablo', yol: '/urunler?k=sarj' },
    ],
  },
  {
    id: 'ag',
    baslik: 'Ağ & Güvenlik',
    altKategoriler: [
      { id: 'modem', baslik: 'Modem & Router', yol: '/urunler?k=modem' },
      { id: 'switch', baslik: 'Switch & Access Point', yol: '/urunler?k=switch' },
      {
        id: 'guvenlik',
        baslik: 'Güvenlik',
        altKategoriler: [
          { id: 'kamera', baslik: 'IP Kamera', yol: '/urunler?k=kamera' },
          { id: 'alarm', baslik: 'Alarm Sistemleri', yol: '/urunler?k=alarm' },
        ],
      },
    ],
  },
  {
    id: 'ofis',
    baslik: 'Ofis & Yazıcı',
    altKategoriler: [
      { id: 'yazici', baslik: 'Yazıcı', yol: '/urunler?k=yazici' },
      { id: 'tarayici', baslik: 'Tarayıcı', yol: '/urunler?k=tarayici' },
      { id: 'toner', baslik: 'Toner & Kartuş', yol: '/urunler?k=toner' },
    ],
  },
  {
    id: 'depolama',
    baslik: 'Depolama',
    altKategoriler: [
      { id: 'ssd', baslik: 'SSD', yol: '/urunler?k=ssd' },
      { id: 'hdd', baslik: 'HDD', yol: '/urunler?k=hdd' },
      { id: 'nas', baslik: 'NAS', yol: '/urunler?k=nas' },
    ],
  },
];
