import {
  AKTIF_WIDGET_TIPLERI,
  DEPRECATED_WIDGET_TIPLERI,
  varsayilanConfig,
  type AktifWidgetTipi,
} from '@/types/widget';
import type { WidgetFormDegeri, AdminWidget } from '@/types/admin';
import { formSayfaId } from '@/utils/widgetFormYardimci';
import { sonrakiWidgetSira } from '@/utils/widgetSiraYardimci';
import { ICERIK_PANEL_MAP } from './panels/WidgetIcerikPanelleri';

/** Widget tipi seçicide kullanılan içerik kategorileri */
export const WIDGET_TIP_KATEGORILERI = [
  { id: 'slider', etiket: 'Slider', aciklama: 'Kayan slaytlar ve banner alanları' },
  { id: 'resim_metin', etiket: 'Görsel + Metin', aciklama: 'Resim ve metin birlikte (hakkımızda vb.)' },
  { id: 'metin', etiket: 'Metin', aciklama: 'Sadece başlık ve paragraf blokları' },
  { id: 'kart', etiket: 'Kart', aciklama: 'İkonlu, görselli veya fiyat kart gridleri' },
  { id: 'karusel', etiket: 'Karusel', aciklama: 'Yatay kaydırmalı blog, ekip, yorum' },
  { id: 'resimli', etiket: 'Resimli', aciklama: 'Galeri ve görsel grid blokları' },
  { id: 'istatistik', etiket: 'İstatistik', aciklama: 'Sayaç ve rakam blokları' },
  { id: 'iletisim', etiket: 'İletişim', aciklama: 'Harita ve iletişim CTA' },
  { id: 'diger', etiket: 'Diğer', aciklama: 'SSS, referans, popup, kategori' },
  { id: 'modern', etiket: 'Modern', aciklama: 'Zaman çizelgesi, video, geri sayım ve özel bloklar' },
  { id: 'haber', etiket: 'Haber / Portal', aciklama: 'Köşe yazarları, haber grid, hava durumu, kripto ve daha fazlası' },
] as const;

export type WidgetTipKategoriId = (typeof WIDGET_TIP_KATEGORILERI)[number]['id'];

export const WIDGET_TIPLERI = [
  { id: 'SLIDER', etiket: 'Slider', ikon: '🎠', aciklama: 'Sayfanın en üstünde büyük görseller kayar. Kampanya, duyuru veya öne çıkan haberi sırayla göstermek için kullanın.', grup: 'Anasayfa', kategori: 'slider' as const },
  { id: 'KURUMSAL_HERO', etiket: 'Kurumsal Hero', ikon: '🏛️', aciklama: 'Üst menüyle birleşen, ekranı kaplayan büyük karşılama alanı. Kurumsal sitelerde ilk izlenim için uygundur.', grup: 'Anasayfa', kategori: 'slider' as const },
  { id: 'BASLIK_METIN', etiket: 'Başlık + Metin', ikon: '📝', aciklama: 'Sadece bir başlık ve altına yazı koyarsınız. Kısa açıklama, giriş paragrafı veya bilgi notu için yeterlidir.', grup: 'İçerik', kategori: 'metin' as const },
  { id: 'BASLIK_METIN_GORSEL', etiket: 'Metin + Görsel', ikon: '📰', aciklama: 'Yazı bir yanda, fotoğraf diğer yanda durur. Bir konuyu hem anlatmak hem göstermek istediğinizde kullanın.', grup: 'İçerik', kategori: 'resim_metin' as const },
  { id: 'SITE_HAKKINDA', etiket: 'Kurumsal Tanıtım / Hakkımızda', ikon: '🏢', aciklama: 'Firmanızı tanıtır: kim olduğunuz, öne çıkan özellikler, bir görsel ve isterseniz tanıtım videosu.', grup: 'İçerik', kategori: 'resim_metin' as const },
  { id: 'HIZMET_KARTLARI', etiket: 'Hizmet Kartları', ikon: '💼', aciklama: 'Hizmetlerinizi yan yana kartlar halinde listeler. Her kartta ikon, kısa açıklama ve “devamı” bağlantısı olur.', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'BLOG_KARUSEL', etiket: 'Blog Karuseli', ikon: '📰', aciklama: 'Son yazı veya haberleri yatay kaydırarak gösterir. Ana sayfada “güncel içerikler” bandı için uygundur.', grup: 'İçerik', kategori: 'karusel' as const },
  { id: 'LINK_KARTLARI', etiket: 'Link Kartları', ikon: '🔗', aciklama: 'Sık gidilen sayfalara büyük, ikonlu kısayollar koyar. Ziyaretçinin tek tıkla doğru yere ulaşmasını sağlar.', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'GORSEL_GRID_BLOK', etiket: 'Görsel Grid Bloğu', ikon: '🏥', aciklama: 'Solda açıklama, sağda fotoğraflı kartlar. Bölüm, klinik, tesis veya mekân tanıtımı için kullanışlıdır.', grup: 'İçerik', kategori: 'resimli' as const },
  { id: 'GORSEL_ETIKET_KARTLARI', etiket: 'Ürün / Görsel Kartları', ikon: '🖼️', aciklama: 'Ürün veya görselleri etiketli kartlar halinde vitrin gibi dizer. Katalog ve ürün grubu göstermek için seçin.', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'EKIP_KARUSEL', etiket: 'Ekip Karuseli', ikon: '👥', aciklama: 'Çalışan veya ekip fotoğraflarını kaydırarak tanıtır. İsim, unvan ve kısa bilgi eklenebilir.', grup: 'İçerik', kategori: 'karusel' as const },
  { id: 'SAYAC_BLOK', etiket: 'Sayaç Bloğu', ikon: '📊', aciklama: 'Büyük rakamlar gösterir: “10 yıl”, “500 proje” gibi. Güven ve başarıyı sayı ile anlatmak için kullanın.', grup: 'İçerik', kategori: 'istatistik' as const },
  { id: 'YORUM_KARUSEL', etiket: 'Yorum Karuseli', ikon: '💬', aciklama: 'Müşteri yorumlarını tek tek kaydırarak gösterir. Az yer kaplar, yorumlar sırayla okunur.', grup: 'İçerik', kategori: 'karusel' as const },
  { id: 'YORUM_KARTLARI', etiket: 'Yorum Kartları', ikon: '⭐', aciklama: 'Müşteri yorumlarını yan yana kartlar olarak aynı anda gösterir. Birden fazla görüşü birlikte sergilemek için seçin.', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'FIYATLANDIRMA', etiket: 'Fiyatlandırma', ikon: '💰', aciklama: 'Paketlerinizi fiyat, özellik ve “satın al” düğmesiyle yan yana koyar. Abonelik veya hizmet paketleri için uygundur.', grup: 'İçerik', kategori: 'kart' as const },
  { id: 'MODUL_LOGO_BLOK', etiket: 'Modül + Logo Blok', ikon: '🔌', aciklama: 'Bir özelliği anlatır, yanında iş ortağı veya ödeme logolarını dizer. “Kimlerle çalışıyoruz” bölümü için uygundur.', grup: 'İçerik', kategori: 'resim_metin' as const },
  { id: 'GALERI', etiket: 'Galeri', ikon: '🖼️', aciklama: 'Birden fazla fotoğrafı birlikte gösterir. Ziyaretçi görsellere tıklayıp büyütebilir.', grup: 'İçerik', kategori: 'resimli' as const },
  { id: 'KATEGORI', etiket: 'Kategori', ikon: '📂', aciklama: 'Site içi kategorilere görsel veya ikonlu girişler koyar. Ziyaretçiyi ilgili bölüme yönlendirir.', grup: 'İçerik', kategori: 'diger' as const },
  { id: 'REFERANSLAR', etiket: 'Referanslar', ikon: '⭐', aciklama: 'Çalıştığınız marka veya müşteri logolarını gösterir. Güven oluşturmak için ana sayfada sık kullanılır.', grup: 'İçerik', kategori: 'diger' as const },
  { id: 'SSS', etiket: 'SSS', ikon: '❓', aciklama: 'Sık sorulan soruları açılır-kapanır maddeler halinde listeler. Destek yükünü azaltmak için kullanın.', grup: 'İçerik', kategori: 'diger' as const },
  { id: 'HARITA', etiket: 'Harita', ikon: '🗺️', aciklama: 'Adresinizi haritada gösterir. Ofis, şube veya teslimat noktası belirtmek için kullanın.', grup: 'İletişim', kategori: 'iletisim' as const },
  { id: 'ILETISIM_FORMU', etiket: 'İletişim CTA', ikon: '📧', aciklama: 'Dikkat çeken bir banttır: kısa mesaj ve “bize ulaşın” düğmesi. Ziyaretçiyi iletişime yönlendirir.', grup: 'İletişim', kategori: 'iletisim' as const },
  { id: 'POPUP', etiket: 'Popup', ikon: '💬', aciklama: 'Sayfa açılınca veya kaydırınca çıkan pencere. Kampanya, duyuru veya e-posta kaydı için kullanılır.', grup: 'Diğer', kategori: 'diger' as const },
  { id: 'ZAMAN_CIZELGESI', etiket: 'Zaman Çizelgesi', ikon: '📅', aciklama: 'Olayları tarihe göre alt alta dizer. Şirket tarihçesi, kilometre taşları veya proje evreleri için uygundur.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'SUREC_ADIMLARI', etiket: 'Süreç Adımları', ikon: '🪜', aciklama: 'Bir işin nasıl yürüdüğünü 1-2-3 diye adım adım gösterir. Başvuru, sipariş veya hizmet süreci için kullanın.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'MARKA_SERIDI', etiket: 'Marka Şeridi', ikon: '🏷️', aciklama: 'Partner veya marka logolarını kayan bir şerit halinde gösterir. Referanslardan daha sade, sürekli akan bir banttır.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'KARSILASTIRMA_TABLOSU', etiket: 'Karşılaştırma Tablosu', ikon: '📋', aciklama: 'Paketleri özellik özellik yan yana karşılaştırır. “Hangisini almalıyım?” sorusunu tabloda netleştirir.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'GERI_SAYIM', etiket: 'Geri Sayım', ikon: '⏳', aciklama: 'Kampanyanın bitmesine kalan gün, saat ve dakikayı sayar. Son gün fırsatlarında aciliyet yaratır.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'VIDEO_BANNER', etiket: 'Video Banner', ikon: '🎬', aciklama: 'Büyük bir video alanı koyar (YouTube veya yüklediğiniz dosya). Tanıtım filmi veya arka plan videosu için seçin.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'ONCESI_SONRASI', etiket: 'Öncesi / Sonrası', ikon: '↔️', aciklama: 'İki fotoğrafı kaydırarak karşılaştırır. Tadilat, tedavi veya ürün farkını göstermek için idealdir.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'BULTEN_KAYIT', etiket: 'Bülten Kayıt', ikon: '✉️', aciklama: 'Ziyaretçiden e-posta alır. Kampanya ve haberleri duyurmak için abonelik kutusu koyar.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'UCRETSIZ_DENEME', etiket: 'Ücretsiz Deneme', ikon: '🚀', aciklama: 'Deneme kaydı formudur: isim, iletişim ve kısa özellik listesi. Potansiyel müşteri toplamak için kullanın.', grup: 'Modern', kategori: 'modern' as const },
  { id: 'BLOK_OLUSTURUCU', etiket: 'Özel Grid Widget', ikon: '🧱', aciklama: 'Hazır tipler yetmezse buradan kendi düzeninizi kurun. Kutuları sürükleyip metin, görsel ve buton yerleştirirsiniz.', grup: 'Oluşturucu', kategori: 'modern' as const },
  { id: 'KOSE_YAZARLARI', etiket: 'Köşe Yazarları', ikon: '✒️', aciklama: 'Yazarları fotoğraf ve isimle kaydırarak tanıtır. Haber sitelerinde köşe yazısı girişleri için uygundur.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'ILETISIM_BLOK', etiket: 'İletişim + Harita', ikon: '📍', aciklama: 'Telefon, adres, e-posta kartları ile haritayı yan yana koyar. İletişim sayfasının ana bloğu olarak kullanın.', grup: 'İletişim', kategori: 'iletisim' as const },
  { id: 'KATEGORI_HABER_LISTESI', etiket: 'Kategori Haber Listesi', ikon: '🚗', aciklama: 'Seçtiğiniz kategorideki haberleri yatay kartlar halinde listeler. “Spor”, “ekonomi” gibi bölümler için uygundur.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'KATEGORI_HABER_OVERLAY', etiket: 'Kategori Haber Grid', ikon: '📶', aciklama: 'Haberleri büyük görsellerin üzerine başlık yazarak ızgara halinde gösterir. Daha görsel bir haber vitrinidir.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'VIDEO_GALERISI', etiket: 'Video Galerisi', ikon: '▶️', aciklama: 'Videoları kapak görseliyle kart kart dizer. Tıklanınca izlenir; video arşivi için kullanın.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'SEKMELI_HABER', etiket: 'Sekmeli Haber', ikon: '📰', aciklama: 'Üstte sekmeler vardır (gündem, spor, dünya…). Sekmeye tıklayınca o konunun haberleri listelenir.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'HAVA_DURUMU', etiket: 'Hava Durumu', ikon: '⛅', aciklama: 'Seçilen ilin anlık hava durumunu ve kısa tahmini gösterir. Haber portallarında yan kutu olarak kullanılır.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'KRIPTO_LISTESI', etiket: 'Kripto Paralar', ikon: '📈', aciklama: 'Bitcoin ve benzeri coinlerin fiyatını listeler. Ekonomi veya finans sayfalarında canlı piyasa kutusu olarak durur.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'GUNCEL_KONULAR', etiket: 'Güncel Konular', ikon: '☰', aciklama: 'Öne çıkan haberleri 1, 2, 3 diye numaralı liste halinde gösterir. “En çok okunanlar” köşesi için uygundur.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'SIRKET_GIRIS_CIKIS', etiket: 'Şirket Açılış / Kapanış', ikon: '🏢', aciklama: 'Haftanın günlerine göre açılış ve kapanış saatlerini yazar. Borsa veya şirket takvimi için kullanın.', grup: 'Haber', kategori: 'haber' as const },
  { id: 'HABER_MAGAZIN', etiket: 'Haber Magazin', ikon: '📊', aciklama: 'Büyük ve küçük haber kartlarını dergi gibi karışık dizer. Ana sayfada çeşitli haberleri bir arada göstermek için seçin.', grup: 'Haber', kategori: 'haber' as const },
] as const;

export type WidgetTipMeta = (typeof WIDGET_TIPLERI)[number];

export const GIZLI_WIDGET_TIPLERI = new Set<string>(DEPRECATED_WIDGET_TIPLERI);

export function tipOlusturulabilirMi(tip: string) {
  return (AKTIF_WIDGET_TIPLERI as readonly string[]).includes(tip);
}

export function tipMetaBul(tip: string): WidgetTipMeta | undefined {
  return WIDGET_TIPLERI.find((t) => t.id === tip);
}

export function tipEtiketi(tip: string) {
  return tipMetaBul(tip)?.etiket ?? tip.replaceAll('_', ' ');
}

export function tipIkon(tip: string) {
  return tipMetaBul(tip)?.ikon ?? '🧩';
}

export function tipKategori(tip: string): WidgetTipKategoriId {
  return tipMetaBul(tip)?.kategori ?? 'diger';
}

export function tipKategoriEtiketi(tip: string) {
  const kid = tipKategori(tip);
  return WIDGET_TIP_KATEGORILERI.find((k) => k.id === kid)?.etiket ?? 'Diğer';
}

export function widgetTipleriKategoriyeGore(tipFiltre?: string) {
  const liste = WIDGET_TIPLERI.filter((t) => !tipFiltre || t.id === tipFiltre);
  const gruplar = new Map<WidgetTipKategoriId, WidgetTipMeta[]>();

  for (const kat of WIDGET_TIP_KATEGORILERI) {
    gruplar.set(kat.id, []);
  }

  for (const tip of liste) {
    const mevcut = gruplar.get(tip.kategori) ?? [];
    mevcut.push(tip);
    gruplar.set(tip.kategori, mevcut);
  }

  return WIDGET_TIP_KATEGORILERI.map((kat) => ({
    kategori: kat,
    tipler: gruplar.get(kat.id) ?? [],
  })).filter((g) => g.tipler.length > 0);
}

export function benzersizWidgetAd(temel: string, widgetlar: AdminWidget[]): string {
  const mevcut = new Set(widgetlar.map((w) => w.ad.trim().toLowerCase()));
  const taban = temel.trim();
  if (!mevcut.has(taban.toLowerCase())) return taban;
  let i = 2;
  while (mevcut.has(`${taban} ${i}`.toLowerCase())) i += 1;
  return `${taban} ${i}`;
}

export function varsayilanWidgetForm(
  tip: AktifWidgetTipi | string = 'SLIDER',
  widgetlar: AdminWidget[] = [],
  sayfaId = ''
): WidgetFormDegeri {
  const safeTip = tipOlusturulabilirMi(tip) ? tip : 'SLIDER';
  const temizSayfaId = formSayfaId(sayfaId);
  return {
    ad: safeTip === 'BLOK_OLUSTURUCU' ? benzersizWidgetAd('Özel Grid Widget', widgetlar) : '',
    tip: safeTip,
    sira: sonrakiWidgetSira(widgetlar, temizSayfaId),
    aktif: true,
    baslik: '',
    altBaslik: '',
    aciklama: '',
    gorselUrl: '',
    butonMetni: '',
    butonLink: '',
    arkaPlanRenk: tip === 'MARKA_SERIDI' ? '' : '#ffffff',
    yaziRenk: '#111827',
    mobilGoster: true,
    masaustuGoster: true,
    configJsonMetin: JSON.stringify(varsayilanConfig(safeTip), null, 2),
    sayfaId: temizSayfaId,
  };
}

export function tipDegistir(
  form: WidgetFormDegeri,
  yeniTip: string,
  widgetlar: AdminWidget[] = []
): WidgetFormDegeri {
  if (!tipOlusturulabilirMi(yeniTip)) return form;
  return {
    ...varsayilanWidgetForm(yeniTip, widgetlar),
    ad: form.ad,
    sira: form.sira,
    aktif: form.aktif,
    mobilGoster: form.mobilGoster,
    masaustuGoster: form.masaustuGoster,
    sayfaId: formSayfaId(form.sayfaId),
  };
}

export function widgetRegistryIcerik(tip: string) {
  return ICERIK_PANEL_MAP[tip] ?? null;
}
