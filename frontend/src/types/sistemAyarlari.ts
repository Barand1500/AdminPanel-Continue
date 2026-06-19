import type { SagTikPanelAyarlari } from '@/types/sagTikPaneli';
import { VARSAYILAN_SAG_TIK_PANEL } from '@/types/sagTikPaneli';
import { sagTikPanelNormalize } from '@/utils/sagTikPanelYardimci';

export type Sayfa404MenuTipi = 'ust' | 'footer' | 'her-ikisi' | 'yok';

export interface SistemAyarlariJson {
  bakimModu?: boolean;
  bakimMesaji?: string;
  bakimBaslik?: string;
  bakimGorselUrl?: string;
  bakimTahminiSure?: string;
  logSaklamaGun?: number;
  panelDili?: string;
  panelCeviriler?: Record<string, Record<string, string>>;
  sayfa404?: Partial<Sayfa404Ayarlari>;
  otomatikYedekleme?: boolean;
  otomatikYedeklemeGun?: number;
  guvenlikBasliklari?: boolean;
  robotsEngelle?: boolean;
}

export interface Sayfa404Ayarlari {
  baslik: string;
  mesaj: string;
  gorselUrl: string;
  menuTipi: Sayfa404MenuTipi;
  oneriSayfaId: string | null;
  anaSayfaButonu: boolean;
}

export interface SistemAyarlariForm {
  siteAktif: boolean;
  domain: string;
  bakimModu: boolean;
  bakimBaslik: string;
  bakimMesaji: string;
  bakimGorselUrl: string;
  bakimTahminiSure: string;
  bakimIpBeyazListe: string[];
  logSaklamaGun: number;
  panelDili: string;
  panelCeviriler: Record<string, Record<string, string>>;
  sayfa404: Sayfa404Ayarlari;
  otomatikYedekleme: boolean;
  otomatikYedeklemeGun: number;
  guvenlikBasliklari: boolean;
  robotsEngelle: boolean;
  sagTikPaneli: SagTikPanelAyarlari;
}

export type SistemSekmeId = 'genel' | 'bakim' | 'sayfa404' | 'dil' | 'guvenlik' | 'sagTik';

export const SISTEM_SEKMELER: { id: SistemSekmeId; ad: string; ikon: string }[] = [
  { id: 'genel', ad: 'Genel', ikon: '⚡' },
  { id: 'bakim', ad: 'Bakım Modu', ikon: '🔧' },
  { id: 'sayfa404', ad: '404 Sayfası', ikon: '🚫' },
  { id: 'dil', ad: 'Panel Dili', ikon: '🌐' },
  { id: 'guvenlik', ad: 'Güvenlik', ikon: '🛡️' },
  { id: 'sagTik', ad: 'Sağ Tık Paneli', ikon: '🖱️' },
];

export const PANEL_DILLERI: { kod: string; ad: string }[] = [
  { kod: 'tr', ad: 'Türkçe' },
  { kod: 'en', ad: 'English' },
  { kod: 'de', ad: 'Deutsch' },
  { kod: 'fr', ad: 'Français' },
  { kod: 'ar', ad: 'العربية' },
];

export const SAYFA404_MENU_SECENEKLERI: { deger: Sayfa404MenuTipi; ad: string; aciklama: string }[] = [
  { deger: 'ust', ad: 'Üst Menü', aciklama: 'Header menüsü 404 sayfasında görünür' },
  { deger: 'footer', ad: 'Footer Menü', aciklama: 'Alt menü ve linkler gösterilir' },
  { deger: 'her-ikisi', ad: 'Her İkisi', aciklama: 'Header ve footer birlikte' },
  { deger: 'yok', ad: 'Menü Yok', aciklama: 'Sadece 404 içeriği, menü gizli' },
];

export const varsayilanSayfa404: Sayfa404Ayarlari = {
  baslik: 'Sayfa Bulunamadı',
  mesaj: 'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.',
  gorselUrl: '',
  menuTipi: 'ust',
  oneriSayfaId: null,
  anaSayfaButonu: true,
};

export const bosSistemForm: SistemAyarlariForm = {
  siteAktif: true,
  domain: '',
  bakimModu: false,
  bakimBaslik: 'Bakım Çalışması',
  bakimMesaji: 'Site geçici olarak bakımda. Lütfen daha sonra tekrar deneyin.',
  bakimGorselUrl: '',
  bakimTahminiSure: '',
  bakimIpBeyazListe: [],
  logSaklamaGun: 90,
  panelDili: 'tr',
  panelCeviriler: {},
  sayfa404: { ...varsayilanSayfa404 },
  otomatikYedekleme: false,
  otomatikYedeklemeGun: 7,
  guvenlikBasliklari: true,
  robotsEngelle: false,
  sagTikPaneli: { ...VARSAYILAN_SAG_TIK_PANEL, ogeler: [...VARSAYILAN_SAG_TIK_PANEL.ogeler] },
};

export function sistemdenForm(
  site: { aktif: boolean; domain: string | null },
  sistem: Partial<SistemAyarlariForm>
): SistemAyarlariForm {
  return {
    siteAktif: site.aktif,
    domain: site.domain ?? '',
    bakimModu: sistem.bakimModu ?? bosSistemForm.bakimModu,
    bakimBaslik: sistem.bakimBaslik ?? bosSistemForm.bakimBaslik,
    bakimMesaji: sistem.bakimMesaji ?? bosSistemForm.bakimMesaji,
    bakimGorselUrl: sistem.bakimGorselUrl ?? '',
    bakimTahminiSure: sistem.bakimTahminiSure ?? '',
    bakimIpBeyazListe: sistem.bakimIpBeyazListe ?? [],
    logSaklamaGun: sistem.logSaklamaGun ?? 90,
    panelDili: sistem.panelDili ?? 'tr',
    panelCeviriler: sistem.panelCeviriler ?? {},
    sayfa404: { ...varsayilanSayfa404, ...sistem.sayfa404 },
    otomatikYedekleme: sistem.otomatikYedekleme ?? false,
    otomatikYedeklemeGun: sistem.otomatikYedeklemeGun ?? 7,
    guvenlikBasliklari: sistem.guvenlikBasliklari ?? true,
    robotsEngelle: sistem.robotsEngelle ?? false,
    sagTikPaneli: sagTikPanelNormalize(sistem.sagTikPaneli),
  };
}
