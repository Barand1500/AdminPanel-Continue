export type KisayolIslemId =
  | 'rehber'
  | 'baslatMenu'
  | 'kaydet'
  | 'ekle'
  | 'sil'
  | 'oncekiKayit'
  | 'sonrakiKayit';

export interface KisayolTanimi {
  id: KisayolIslemId;
  etiket: string;
  aciklama: string;
  varsayilan: string;
}

export const KISAYOL_ISLEMLERI: KisayolTanimi[] = [
  { id: 'rehber', etiket: 'Rehber', aciklama: 'Nasıl kullanılır modalını açar', varsayilan: 'F1' },
  {
    id: 'baslatMenu',
    etiket: 'Başlat Menüsü',
    aciklama: 'Windows (⊞) tuşu ile başlat menüsünü aç/kapat',
    varsayilan: 'Win',
  },
  { id: 'kaydet', etiket: 'Kaydet', aciklama: 'Aktif modülde kaydet', varsayilan: 'Ctrl+S' },
  { id: 'ekle', etiket: 'Yeni Ekle', aciklama: 'Aktif modülde yeni kayıt', varsayilan: 'Ctrl+N' },
  { id: 'sil', etiket: 'Sil', aciklama: 'Aktif modülde silme', varsayilan: 'Delete' },
  {
    id: 'oncekiKayit',
    etiket: 'Önceki Kayıt',
    aciklama: 'Aktif modülde bir önceki kayda geç',
    varsayilan: 'Alt+ArrowLeft',
  },
  {
    id: 'sonrakiKayit',
    etiket: 'Sonraki Kayıt',
    aciklama: 'Aktif modülde bir sonraki kayda geç',
    varsayilan: 'Alt+ArrowRight',
  },
];

const STORAGE_KEY = 'ap-kisayol-ayarlari';

export type KisayolHaritasi = Record<KisayolIslemId, string>;

export function varsayilanKisayollar(): KisayolHaritasi {
  return KISAYOL_ISLEMLERI.reduce((acc, kisayol) => {
    acc[kisayol.id] = kisayol.varsayilan;
    return acc;
  }, {} as KisayolHaritasi);
}

export function kisayolAyarlariOku(): KisayolHaritasi {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    if (!ham) return varsayilanKisayollar();

    const kayit = JSON.parse(ham) as Partial<KisayolHaritasi> & { onizle?: string };
    delete kayit.onizle;
    return { ...varsayilanKisayollar(), ...kayit };
  } catch {
    return varsayilanKisayollar();
  }
}

export function kisayolAyarlariKaydet(harita: KisayolHaritasi) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(harita));
}

export function tusKombinasyonuYakala(e: KeyboardEvent): string {
  if (['Meta', 'OS', 'Win'].includes(e.key) && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    return 'Win';
  }

  const parcalar: string[] = [];
  if (e.ctrlKey || e.metaKey) parcalar.push('Ctrl');
  if (e.altKey) parcalar.push('Alt');
  if (e.shiftKey) parcalar.push('Shift');

  const anahtar = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (!['Control', 'Alt', 'Shift', 'Meta', 'OS', 'Win'].includes(e.key)) {
    parcalar.push(anahtar);
  }
  return parcalar.join('+');
}

export function kisayolCakismaBul(
  harita: KisayolHaritasi,
  islemId: KisayolIslemId,
  yeniKombinasyon: string
): KisayolIslemId | null {
  const norm = yeniKombinasyon.trim();
  if (!norm) return null;

  for (const [id, kombinasyon] of Object.entries(harita) as [KisayolIslemId, string][]) {
    if (id !== islemId && kombinasyon === norm) return id;
  }
  return null;
}

export function klavyeOlayiEslesir(e: KeyboardEvent, kombinasyon: string): boolean {
  return Boolean(kombinasyon) && tusKombinasyonuYakala(e) === kombinasyon;
}
