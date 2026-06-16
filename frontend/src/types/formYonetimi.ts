export type FormAlanTipi =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'number'
  | 'date'
  | 'file';

export type FormGorunumTipi = 'sayfa-ici' | 'yuzucu' | 'inline' | 'modal' | 'yan-panel' | 'sabit-alt';
export type FormSayfaKonumu = 'icerik-basi' | 'icerik-sonu' | 'sidebar' | 'footer-ustu' | 'hero-alti';
export type FormGenislik = 'tam' | 'orta' | 'dar';
export type FormKosulOperator = 'esit' | 'farkli' | 'dolu' | 'bos' | 'icerir';
export type FormKosulMantigi = 've' | 'veya';
export type FormGonderimLimiti = 'yok' | 'saat' | 'gun';

export interface FormKosul {
  alanId: string;
  operator: FormKosulOperator;
  deger?: string;
}

export interface FormAlani {
  id: string;
  tip: FormAlanTipi;
  etiket: string;
  zorunlu: boolean;
  placeholder?: string;
  secenekler?: string[];
  yardimMetni?: string;
  varsayilan?: string;
  genislik?: 'tam' | 'yarim';
  kosullar?: FormKosul[];
  kosulMantigi?: FormKosulMantigi;
}

export interface FormAyarlar {
  gorunumTipi: FormGorunumTipi;
  tumSayfalarda: boolean;
  sayfaSluglari: string[];
  sayfaKonumu: FormSayfaKonumu;
  genislik: FormGenislik;
  baslikGoster: boolean;
  aciklamaGoster: boolean;
  gonderButonMetni: string;
  epostaZorunlu: boolean;
  telefonZorunlu: boolean;
  adSoyadZorunlu: boolean;
  kvkkOnayZorunlu: boolean;
  kvkkMetni: string;
  captchaAktif: boolean;
  tekGonderimLimiti: FormGonderimLimiti;
  basariMesaji: string;
  yonlendirmeUrl: string;
  kullaniciyaOtomatikYanit: boolean;
  otomatikYanitKonu: string;
  otomatikYanitMetin: string;
  arkaPlanRenk: string;
  butonRenk: string;
  bildirimGoster: boolean;
}

export type FormEditorSekmeId = 'genel' | 'alanlar' | 'yerlesim' | 'kurallar' | 'bildirim' | 'onizleme';

export const FORM_EDITOR_SEKMELER: { id: FormEditorSekmeId; ad: string; ikon: string }[] = [
  { id: 'genel', ad: 'Genel', ikon: '⚙️' },
  { id: 'alanlar', ad: 'Alanlar', ikon: '📋' },
  { id: 'yerlesim', ad: 'Yerleşim', ikon: '📍' },
  { id: 'bildirim', ad: 'Bildirim', ikon: '📧' },
];

export const ALAN_TIPLERI: { value: FormAlanTipi; label: string; ikon: string }[] = [
  { value: 'text', label: 'Metin', ikon: 'Aa' },
  { value: 'email', label: 'E-posta', ikon: '@' },
  { value: 'tel', label: 'Telefon', ikon: '📞' },
  { value: 'textarea', label: 'Uzun Metin', ikon: '¶' },
  { value: 'number', label: 'Sayı', ikon: '#' },
  { value: 'date', label: 'Tarih', ikon: '📅' },
  { value: 'select', label: 'Açılır Liste', ikon: '▼' },
  { value: 'radio', label: 'Tek Seçim', ikon: '◉' },
  { value: 'checkbox', label: 'Onay Kutusu', ikon: '☑' },
  { value: 'file', label: 'Dosya', ikon: '📎' },
];

export const GORUNUM_TIPLERI: { id: FormGorunumTipi; ad: string; aciklama: string }[] = [
  {
    id: 'sayfa-ici',
    ad: 'Sayfa İçi',
    aciklama: 'Blog gibi sayfa içinde seçtiğiniz bölgede görünür',
  },
  {
    id: 'yuzucu',
    ad: 'Yüzen İkon',
    aciklama: 'Sağ alttaki yuvarlak butonlar arasında sallanan ikon; tıklanınca modal açılır',
  },
];

export const SAYFA_KONUMLARI: { id: FormSayfaKonumu; ad: string }[] = [
  { id: 'icerik-basi', ad: 'İçerik Başı' },
  { id: 'icerik-sonu', ad: 'İçerik Sonu' },
  { id: 'sidebar', ad: 'Kenar Çubuğu' },
  { id: 'hero-alti', ad: 'Hero Altı' },
  { id: 'footer-ustu', ad: 'Footer Üstü' },
];

export const KOSUL_OPERATORLERI: { value: FormKosulOperator; label: string }[] = [
  { value: 'esit', label: 'eşittir' },
  { value: 'farkli', label: 'eşit değildir' },
  { value: 'dolu', label: 'dolu ise' },
  { value: 'bos', label: 'boş ise' },
  { value: 'icerir', label: 'içerir' },
];

export const VARSAYILAN_FORM_AYARLARI: FormAyarlar = {
  gorunumTipi: 'sayfa-ici',
  tumSayfalarda: true,
  sayfaSluglari: [],
  sayfaKonumu: 'icerik-sonu',
  genislik: 'orta',
  baslikGoster: true,
  aciklamaGoster: true,
  gonderButonMetni: 'Gönder',
  epostaZorunlu: false,
  telefonZorunlu: false,
  adSoyadZorunlu: true,
  kvkkOnayZorunlu: true,
  kvkkMetni: 'Kişisel verilerimin işlenmesini kabul ediyorum.',
  captchaAktif: false,
  tekGonderimLimiti: 'yok',
  basariMesaji: 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.',
  yonlendirmeUrl: '',
  kullaniciyaOtomatikYanit: false,
  otomatikYanitKonu: 'Formunuz alındı',
  otomatikYanitMetin: 'Başvurunuz için teşekkür ederiz.',
  arkaPlanRenk: '',
  butonRenk: '',
  bildirimGoster: true,
};

export function gorunumTipiNormalize(tip?: string | null): 'sayfa-ici' | 'yuzucu' {
  if (tip === 'yuzucu' || tip === 'modal' || tip === 'sabit-alt') return 'yuzucu';
  return 'sayfa-ici';
}

export function yeniAlanId() {
  return `alan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ayarlariBirlestir(kismi?: Partial<FormAyarlar> | null): FormAyarlar {
  const birlesik = { ...VARSAYILAN_FORM_AYARLARI, ...(kismi ?? {}) };
  return { ...birlesik, gorunumTipi: gorunumTipiNormalize(birlesik.gorunumTipi) };
}
