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
          { id: 'gaming-laptop', baslik: 'Oyuncu Laptop', yol: '#' },
          { id: 'is-laptop', baslik: 'İş Laptop', yol: '#' },
          { id: 'ultrabook', baslik: 'Ultrabook', yol: '#' },
        ],
      },
      {
        id: 'masaustu',
        baslik: 'Masaüstü',
        altKategoriler: [
          { id: 'gaming-pc', baslik: 'Oyuncu PC', yol: '#' },
          { id: 'is-pc', baslik: 'İş Bilgisayarı', yol: '#' },
          { id: 'mini-pc', baslik: 'Mini PC', yol: '#' },
        ],
      },
      { id: 'tablet', baslik: 'Tablet', yol: '#' },
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
          { id: 'android', baslik: 'Android', yol: '#' },
          { id: 'ios', baslik: 'iOS', yol: '#' },
        ],
      },
      { id: 'kilif', baslik: 'Kılıf & Koruma', yol: '#' },
      { id: 'sarj', baslik: 'Şarj & Kablo', yol: '#' },
    ],
  },
  {
    id: 'ag',
    baslik: 'Ağ & Güvenlik',
    altKategoriler: [
      { id: 'modem', baslik: 'Modem & Router', yol: '#' },
      { id: 'switch', baslik: 'Switch & Access Point', yol: '#' },
      {
        id: 'guvenlik',
        baslik: 'Güvenlik',
        altKategoriler: [
          { id: 'kamera', baslik: 'IP Kamera', yol: '#' },
          { id: 'alarm', baslik: 'Alarm Sistemleri', yol: '#' },
        ],
      },
    ],
  },
  {
    id: 'ofis',
    baslik: 'Ofis & Yazıcı',
    altKategoriler: [
      { id: 'yazici', baslik: 'Yazıcı', yol: '#' },
      { id: 'tarayici', baslik: 'Tarayıcı', yol: '#' },
      { id: 'toner', baslik: 'Toner & Kartuş', yol: '#' },
    ],
  },
  {
    id: 'depolama',
    baslik: 'Depolama',
    altKategoriler: [
      { id: 'ssd', baslik: 'SSD', yol: '#' },
      { id: 'hdd', baslik: 'HDD', yol: '#' },
      { id: 'nas', baslik: 'NAS', yol: '#' },
    ],
  },
];
