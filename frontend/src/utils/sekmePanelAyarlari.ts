export type SekmeYukseklik = 'kucuk' | 'orta' | 'buyuk';
export type VarsayilanAcilis = 'tek-sekme' | 'yeni-sekme';
export type SekmeGorunumModu = 'isim' | 'ikon' | 'ikon-isim';

export type SekmeAramaGorunum = 'ikon' | 'input';

export interface SekmePanelAyarlari {
  sekmeYukseklik: SekmeYukseklik;
  hoverOnizleme: boolean;
  varsayilanAcilis: VarsayilanAcilis;
  yanYanaAcilabilir: boolean;
  surukleAyirPencere: boolean;
  sekmeGorunumModu: SekmeGorunumModu;
  sekmeAramaAktif: boolean;
  sekmeAramaGorunum: SekmeAramaGorunum;
}

export const VARSAYILAN_SEKME_AYARLARI: SekmePanelAyarlari = {
  sekmeYukseklik: 'orta',
  hoverOnizleme: true,
  varsayilanAcilis: 'yeni-sekme',
  yanYanaAcilabilir: true,
  surukleAyirPencere: true,
  sekmeGorunumModu: 'ikon-isim',
  sekmeAramaAktif: false,
  sekmeAramaGorunum: 'ikon',
};

const STORAGE_KEY = 'ap-sekme-panel-ayarlari';

/** Birleştirilmiş sekmeler için Chrome tarzı yan yana split (en fazla 2 panel). */
export function splitSekmeleriHesapla<T extends { id: string; grupId?: string }>(
  sekmeler: T[],
  aktifSekme: T | undefined,
  yanYanaAcilabilir: boolean
): T[] | null {
  if (!yanYanaAcilabilir || !aktifSekme?.grupId) return null;

  const sirali = sekmeler.filter((s) => s.grupId === aktifSekme.grupId);
  if (sirali.length < 2) return null;
  if (sirali.length === 2) return sirali;

  const aktifIdx = sirali.findIndex((s) => s.id === aktifSekme.id);
  if (aktifIdx < 0) return sirali.slice(0, 2);

  const komsuIdx = aktifIdx === 0 ? 1 : aktifIdx - 1;
  return [sirali[aktifIdx], sirali[komsuIdx]];
}

export function sekmeAyarlariOku(): SekmePanelAyarlari {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    if (!ham) return { ...VARSAYILAN_SEKME_AYARLARI };
    const parsed = JSON.parse(ham) as Partial<SekmePanelAyarlari> & { grupDavranisi?: string };
    const { grupDavranisi: _eski, ...gerisi } = parsed;
    return { ...VARSAYILAN_SEKME_AYARLARI, ...gerisi };
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
