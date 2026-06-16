export const HESAP_MENU = [
  { id: 'profil', baslik: 'Profil', yol: '/hesabim/profil', ikon: 'user' },
  { id: 'serbest-odeme', baslik: 'Serbest Ödeme', yol: '/hesabim/serbest-odeme', ikon: 'card' },
  { id: 'adresler', baslik: 'Adreslerim', yol: '/hesabim/adresler', ikon: 'map' },
  { id: 'fatura', baslik: 'Fatura Bilgilerim', yol: '/hesabim/fatura', ikon: 'invoice' },
  { id: 'siparisler', baslik: 'Siparişlerim', yol: '/hesabim/siparisler', ikon: 'cart' },
  { id: 'kayitli-sepetler', baslik: 'Kayıtlı Sepetlerim', yol: '/hesabim/kayitli-sepetler', ikon: 'basket' },
  { id: 'iade', baslik: 'İade/Değişim Talepleri', yol: '/hesabim/iade-degisim', ikon: 'return' },
  { id: 'sifre', baslik: 'Şifre Değiştir', yol: '/hesabim/sifre', ikon: 'lock' },
] as const;

export type HesapIkonTipi = (typeof HESAP_MENU)[number]['ikon'] | 'logout';
