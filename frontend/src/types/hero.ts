export type HeroStil = 'klasik' | 'metin-solda' | 'ortalanmis';

export type HeroButonKonum =
  | 'ust-sol'
  | 'ust-orta'
  | 'ust-sag'
  | 'orta-sol'
  | 'orta-orta'
  | 'orta-sag'
  | 'alt-sol'
  | 'alt-orta'
  | 'alt-sag';

export type HeroButonAksiyon = 'ayni-sekme' | 'yeni-sekme' | 'modal';

export interface HeroSlide {
  id: string;
  sira: number;
  aktif: boolean;
  gorselUrl: string;
  baslik: string;
  altBaslik: string;
  aciklama: string;
  stil: HeroStil;
  butonAktif: boolean;
  butonMetni: string;
  butonLink: string;
  butonKonum: HeroButonKonum;
  butonRenk: string;
  butonYaziRenk: string;
  butonAksiyon?: HeroButonAksiyon;
}

export interface HeroKart {
  id: string;
  ikon: string;
  baslik: string;
  aciklama: string;
  link?: string;
  sira: number;
}

export type HeroSliderDuzenlemeModu = 'ayni-sekme' | 'yeni-sekme' | 'modal';

export interface HeroAyarlari {
  gecisSuresiSn: number;
  sliderlar: HeroSlide[];
  kartlarAktif: boolean;
  kartlar: HeroKart[];
  /** @deprecated Artık kullanılmıyor; geriye uyumluluk için tutuldu */
  sliderDuzenlemeModu?: HeroSliderDuzenlemeModu;
}

export const HERO_BUTON_AKSIYONLARI: { id: HeroButonAksiyon; ad: string; aciklama: string }[] = [
  { id: 'ayni-sekme', ad: 'Aynı pencerede aç', aciklama: 'Mevcut sekmede yönlendir' },
  { id: 'yeni-sekme', ad: 'Yeni sekmede aç', aciklama: 'Tarayıcıda yeni sekme' },
  { id: 'modal', ad: 'Modalda aç', aciklama: 'Sayfa üzerinde pencere' },
];

export const HERO_VARSAYILAN_GECIS_SN = 6;
export const HERO_VARSAYILAN_BUTON_RENK = '#ffffff';
export const HERO_VARSAYILAN_BUTON_YAZI = '#7c3aed';

export const HERO_STILLER: { id: HeroStil; ad: string; aciklama: string }[] = [
  { id: 'klasik', ad: 'Klasik', aciklama: 'Tam genişlik görsel, metin konuma göre' },
  { id: 'metin-solda', ad: 'Metin Solda', aciklama: 'Sol tarafta koyu panel üzerinde metin' },
  { id: 'ortalanmis', ad: 'Ortalanmış', aciklama: 'Metin ve buton ortada' },
];

export const HERO_BUTON_KONUMLARI: { id: HeroButonKonum; etiket: string }[] = [
  { id: 'ust-sol', etiket: '↖' },
  { id: 'ust-orta', etiket: '↑' },
  { id: 'ust-sag', etiket: '↗' },
  { id: 'orta-sol', etiket: '←' },
  { id: 'orta-orta', etiket: '●' },
  { id: 'orta-sag', etiket: '→' },
  { id: 'alt-sol', etiket: '↙' },
  { id: 'alt-orta', etiket: '↓' },
  { id: 'alt-sag', etiket: '↘' },
];

function slideNormalize(s: HeroSlide): HeroSlide {
  return {
    ...s,
    butonRenk: s.butonRenk || HERO_VARSAYILAN_BUTON_RENK,
    butonYaziRenk: s.butonYaziRenk || HERO_VARSAYILAN_BUTON_YAZI,
    butonAksiyon: s.butonAksiyon ?? 'ayni-sekme',
  };
}

export function varsayilanHeroAyarlari(): HeroAyarlari {
  return {
    gecisSuresiSn: HERO_VARSAYILAN_GECIS_SN,
    sliderlar: [],
    kartlarAktif: true,
    kartlar: [
      { id: 'k1', ikon: '🏢', baslik: 'Kurumsal Deneyim', aciklama: 'Yılların tecrübesi', sira: 0 },
      { id: 'k2', ikon: '🔒', baslik: 'Güvenilir Hizmet', aciklama: 'Profesyonel çözümler', sira: 1 },
      { id: 'k3', ikon: '💬', baslik: '7/24 Destek', aciklama: 'Uzman ekip yanınızda', sira: 2 },
      { id: 'k4', ikon: '✅', baslik: 'Memnuniyet', aciklama: 'Referans müşteriler', sira: 3 },
    ],
    sliderDuzenlemeModu: 'ayni-sekme',
  };
}

export function bosHeroSlide(sira: number): HeroSlide {
  return {
    id: `slide-${Date.now()}`,
    sira,
    aktif: true,
    gorselUrl: '',
    baslik: '',
    altBaslik: '',
    aciklama: '',
    stil: 'klasik',
    butonAktif: false,
    butonMetni: '',
    butonLink: '',
    butonKonum: 'alt-sol',
    butonRenk: HERO_VARSAYILAN_BUTON_RENK,
    butonYaziRenk: HERO_VARSAYILAN_BUTON_YAZI,
    butonAksiyon: 'ayni-sekme',
  };
}

export function heroAyarlariBirlestir(ham?: HeroAyarlari | null): HeroAyarlari {
  const varsayilan = varsayilanHeroAyarlari();
  if (!ham) return varsayilan;
  return {
    gecisSuresiSn: ham.gecisSuresiSn ?? varsayilan.gecisSuresiSn,
    kartlarAktif: ham.kartlarAktif ?? varsayilan.kartlarAktif,
    kartlar: ham.kartlar?.length
      ? [...ham.kartlar].sort((a, b) => a.sira - b.sira).map((k) => ({ ...k, link: k.link ?? '' }))
      : varsayilan.kartlar,
    sliderlar: [...(ham.sliderlar ?? [])].map(slideNormalize).sort((a, b) => a.sira - b.sira),
    sliderDuzenlemeModu: ham.sliderDuzenlemeModu ?? 'ayni-sekme',
  };
}
