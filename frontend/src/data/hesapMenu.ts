export const HESAP_MENU = [
  { id: 'profil', baslik: 'Profil', yol: '/hesabim/profil', ikon: 'user' },
  { id: 'sifre', baslik: 'Şifre Değiştir', yol: '/hesabim/sifre', ikon: 'lock' },
] as const;

export type HesapIkonTipi = (typeof HESAP_MENU)[number]['ikon'] | 'logout';
