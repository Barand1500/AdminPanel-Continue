export type SekmeYukseklik = 'kucuk' | 'orta' | 'buyuk';
export type BirlestirmeModu = 'otomatik' | 'manuel';
export type VarsayilanAcilis = 'tek-sekme' | 'yeni-sekme';
export type GrupDavranisi = 'ustuste' | 'yan-yana';
export type SekmeGorunumModu = 'isim' | 'ikon' | 'ikon-isim';

export interface SekmePanelAyarlari {
  sekmeYukseklik: SekmeYukseklik;
  hoverOnizleme: boolean;
  birlestirmeModu: BirlestirmeModu;
  varsayilanAcilis: VarsayilanAcilis;
  yanYanaAcilabilir: boolean;
  surukleAyirPencere: boolean;
  grupDavranisi: GrupDavranisi;
  sekmeGorunumModu: SekmeGorunumModu;
}

export const VARSAYILAN_SEKME_AYARLARI: SekmePanelAyarlari = {
  sekmeYukseklik: 'orta',
  hoverOnizleme: true,
  birlestirmeModu: 'otomatik',
  varsayilanAcilis: 'yeni-sekme',
  yanYanaAcilabilir: true,
  surukleAyirPencere: true,
  grupDavranisi: 'yan-yana',
  sekmeGorunumModu: 'ikon-isim',
};

const STORAGE_KEY = 'ap-sekme-panel-ayarlari';

export function sekmeAyarlariOku(): SekmePanelAyarlari {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    if (!ham) return { ...VARSAYILAN_SEKME_AYARLARI };
    return { ...VARSAYILAN_SEKME_AYARLARI, ...JSON.parse(ham) };
  } catch {
    return { ...VARSAYILAN_SEKME_AYARLARI };
  }
}

export function sekmeAyarlariKaydet(ayarlar: SekmePanelAyarlari) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ayarlar));
}

export function sekmeYukseklikCss(ayar: SekmeYukseklik) {
  switch (ayar) {
    case 'kucuk':
      return { height: '1.75rem', fontSize: '0.6875rem', padding: '0.25rem 0.5rem' };
    case 'buyuk':
      return { height: '2.5rem', fontSize: '0.875rem', padding: '0.5rem 0.875rem' };
    default:
      return { height: '2rem', fontSize: '0.75rem', padding: '0.375rem 0.75rem' };
  }
}
