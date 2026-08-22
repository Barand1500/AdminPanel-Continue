import {
  IconBolt,
  IconBrandWhatsapp,
  IconBriefcase2,
  IconBuilding,
  IconChartBar,
  IconClock,
  IconCode,
  IconCreditCard,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconHeadset,
  IconHeartHandshake,
  IconMail,
  IconMapPin,
  IconPalette,
  IconPhone,
  IconPlugConnected,
  IconRocket,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconStar,
  IconTargetArrow,
  IconThumbUp,
  IconTool,
  IconTrophy,
  IconUsersGroup,
  IconWorld,
  IconZoomIn,
} from '@tabler/icons-react';

/**
 * Sitede ve yönetim panelinde ortak kullanılan, saklanabilir çizgi ikon anahtarları.
 * Eski emoji değerleri okunmaya devam eder; yeni seçimler bu sabit anahtarlarla kaydedilir.
 */
const YEDEK_IKONLAR = {
  memnuniyet: IconHeartHandshake,
  kalite: IconThumbUp,
  basari: IconTrophy,
  whatsapp: IconBrandWhatsapp,
  proje: IconBriefcase2,
  hedef: IconTargetArrow,
  destek: IconHeadset,
  ekip: IconUsersGroup,
  grafik: IconChartBar,
  zoom: IconZoomIn,
  dunya: IconWorld,
  ayarlar: IconSettings,
  arama: IconSearch,
  masaustu: IconDeviceDesktop,
  konum: IconMapPin,
  telefon: IconPhone,
  cep: IconDeviceMobile,
  eposta: IconMail,
  saat: IconClock,
  arac: IconTool,
  hiz: IconBolt,
  baglanti: IconPlugConnected,
  odeme: IconCreditCard,
  tasarim: IconPalette,
  roket: IconRocket,
  yildiz: IconStar,
  guvenlik: IconShieldCheck,
  kod: IconCode,
  kurumsal: IconBuilding,
} as const;

export type CizgiIkonYedegi = keyof typeof YEDEK_IKONLAR;

export interface CizgiIkonSecenegi {
  id: CizgiIkonYedegi;
  etiket: string;
}

/** Yönetim panelindeki ikon seçicinin gösterdiği erişilebilir, adlandırılmış seçenekler. */
export const CIZGI_IKON_SECENEKLERI: readonly CizgiIkonSecenegi[] = [
  { id: 'memnuniyet', etiket: 'Müşteri memnuniyeti' },
  { id: 'kalite', etiket: 'Kalite ve güven' },
  { id: 'basari', etiket: 'Başarı ve ödül' },
  { id: 'whatsapp', etiket: 'WhatsApp' },
  { id: 'proje', etiket: 'Proje' },
  { id: 'hedef', etiket: 'Hedef' },
  { id: 'destek', etiket: 'Teknik destek' },
  { id: 'ekip', etiket: 'Ekip' },
  { id: 'grafik', etiket: 'Grafik ve istatistik' },
  { id: 'zoom', etiket: 'Yakınlaştır' },
  { id: 'dunya', etiket: 'Dünya ve web' },
  { id: 'ayarlar', etiket: 'Ayarlar' },
  { id: 'arama', etiket: 'Arama ve analiz' },
  { id: 'masaustu', etiket: 'Masaüstü' },
  { id: 'konum', etiket: 'Konum' },
  { id: 'telefon', etiket: 'Telefon' },
  { id: 'cep', etiket: 'Cep telefonu' },
  { id: 'eposta', etiket: 'E-posta' },
  { id: 'saat', etiket: 'Çalışma saati' },
  { id: 'arac', etiket: 'Araçlar' },
  { id: 'hiz', etiket: 'Hız' },
  { id: 'baglanti', etiket: 'Bağlantı' },
  { id: 'odeme', etiket: 'Ödeme' },
  { id: 'tasarim', etiket: 'Tasarım' },
  { id: 'roket', etiket: 'Roket ve büyüme' },
  { id: 'yildiz', etiket: 'Yıldız' },
  { id: 'guvenlik', etiket: 'Güvenlik' },
  { id: 'kod', etiket: 'Kod ve yazılım' },
  { id: 'kurumsal', etiket: 'Kurumsal' },
] as const;

const IKON_KELIMELERI: Array<{ anahtarlar: string[]; ikon: CizgiIkonYedegi }> = [
  { anahtarlar: ['mutlu', 'musteri', 'müşteri', 'memnun', 'kalp', 'heart', '❤️'], ikon: 'memnuniyet' },
  { anahtarlar: ['kalite', 'guven', 'güven', 'onay', 'thumb', '✅', '👍'], ikon: 'kalite' },
  { anahtarlar: ['lider', 'odul', 'ödül', 'basari', 'başarı', 'trophy', '🏆'], ikon: 'basari' },
  { anahtarlar: ['whatsapp', 'whats'], ikon: 'whatsapp' },
  { anahtarlar: ['proje', 'portfoy', 'portföy', 'briefcase', '💼', '📦'], ikon: 'proje' },
  { anahtarlar: ['urun', 'ürün', 'hedef', 'target', '🎯'], ikon: 'hedef' },
  { anahtarlar: ['destek', 'support', 'yardim', 'yardım', 'kulaklik', 'kulaklık', 'headset', '🎧', '💬'], ikon: 'destek' },
  { anahtarlar: ['ekip', 'calisan', 'çalışan', 'personel', 'users', '👥'], ikon: 'ekip' },
  { anahtarlar: ['sayi', 'sayı', 'istatistik', 'grafik', 'chart', '📊'], ikon: 'grafik' },
  { anahtarlar: ['zoom', 'incele', 'buyut', 'büyüt'], ikon: 'zoom' },
  { anahtarlar: ['web', 'dunya', 'dünya', 'globe', '🌐'], ikon: 'dunya' },
  { anahtarlar: ['ayar', 'settings', '⚙️'], ikon: 'ayarlar' },
  { anahtarlar: ['ara', 'search', 'analiz', '🔍'], ikon: 'arama' },
  { anahtarlar: ['monitor', 'masaustu', 'masaüstü', 'desktop', '🖥️'], ikon: 'masaustu' },
  { anahtarlar: ['adres', 'konum', 'sube', 'şube', 'map', 'pin', 'location', '📍'], ikon: 'konum' },
  { anahtarlar: ['cep', 'mobil', 'mobile', 'gsm', '📱'], ikon: 'cep' },
  { anahtarlar: ['telefon', 'tel', 'phone', 'sabit', '📞'], ikon: 'telefon' },
  { anahtarlar: ['eposta', 'e-posta', 'email', 'mail', '✉️', '📧'], ikon: 'eposta' },
  { anahtarlar: ['saat', 'calisma', 'çalışma', 'clock', 'zaman', '⏰'], ikon: 'saat' },
  { anahtarlar: ['teknik', 'arac', 'araç', 'wrench', '🔧'], ikon: 'arac' },
  { anahtarlar: ['hiz', 'hız', 'lightning', 'bolt', '⚡', '🔥'], ikon: 'hiz' },
  { anahtarlar: ['baglanti', 'bağlantı', 'entegrasyon', 'plug', '🔌'], ikon: 'baglanti' },
  { anahtarlar: ['odeme', 'ödeme', 'kart', 'card', 'fatura', '💳'], ikon: 'odeme' },
  { anahtarlar: ['tasarim', 'tasarım', 'palette', '🎨'], ikon: 'tasarim' },
  { anahtarlar: ['roket', 'rocket', 'buyume', 'büyüme', '🚀'], ikon: 'roket' },
  { anahtarlar: ['yildiz', 'yıldız', 'star', '⭐'], ikon: 'yildiz' },
  { anahtarlar: ['guvenlik', 'güvenlik', 'kalkan', 'shield', 'security', '🛡️', '🔒'], ikon: 'guvenlik' },
  { anahtarlar: ['kod', 'code', 'yazilim', 'yazılım', 'developer', '💻'], ikon: 'kod' },
  { anahtarlar: ['kurumsal', 'sirket', 'şirket', 'bina', 'building', 'banka', 'bank', '🏢', '🏦'], ikon: 'kurumsal' },
];

/** Saklanan anahtarı çözer; eski serbest metin/emoji kayıtları için anahtar sözcük eşlemesi de yapar. */
export function cizgiIkonAnahtariBul(deger?: string | null): CizgiIkonYedegi | undefined {
  const temiz = deger?.trim().toLocaleLowerCase('tr-TR');
  if (!temiz) return undefined;
  if (Object.hasOwn(YEDEK_IKONLAR, temiz)) return temiz as CizgiIkonYedegi;
  return IKON_KELIMELERI.find(({ anahtarlar }) => anahtarlar.some((anahtar) => temiz.includes(anahtar)))?.ikon;
}

export function cizgiIkonSecenegiBul(deger?: string | null): CizgiIkonSecenegi | undefined {
  const anahtar = cizgiIkonAnahtariBul(deger);
  return anahtar ? CIZGI_IKON_SECENEKLERI.find((secenek) => secenek.id === anahtar) : undefined;
}

/** Metin/emoji verisini gerçek çizgi ikonlara bağlayan geriye uyumlu yardımcı. */
export function CizgiIkon({
  deger,
  yedek = 'basari',
  boyut = 22,
  stroke = 1.7,
}: {
  deger?: string | null;
  yedek?: CizgiIkonYedegi;
  boyut?: number;
  stroke?: number;
}) {
  const Ikon = YEDEK_IKONLAR[cizgiIkonAnahtariBul(deger) ?? yedek];
  return <Ikon aria-hidden size={boyut} stroke={stroke} />;
}
