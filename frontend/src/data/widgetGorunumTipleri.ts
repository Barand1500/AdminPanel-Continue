import { AKTIF_WIDGET_TIPLERI, type AktifWidgetTipi } from '@/types/widget';

/** Her varyantın kendine özgü renk paleti */
export type WidgetGorunumTema =
  | 'notr'
  | 'gece'
  | 'gunes'
  | 'okyanus'
  | 'mor'
  | 'yesil'
  | 'korall'
  | 'lavanta'
  | 'altin'
  | 'mint';

export interface WidgetGorunumTipTanimi {
  id: string;
  ad: string;
  aciklama: string;
  tema: WidgetGorunumTema;
  ilham?: string;
}

export const WIDGET_GORUNUM_TEMA_RENKLERI: Record<
  WidgetGorunumTema,
  { bg: string; accent: string; text: string; surface: string }
> = {
  notr: { bg: '#f8fafc', accent: '#475569', text: '#0f172a', surface: '#ffffff' },
  gece: { bg: '#0f172a', accent: '#38bdf8', text: '#f1f5f9', surface: '#1e293b' },
  gunes: { bg: '#fff7ed', accent: '#ea580c', text: '#431407', surface: '#ffedd5' },
  okyanus: { bg: '#eff6ff', accent: '#2563eb', text: '#1e3a8a', surface: '#dbeafe' },
  mor: { bg: '#faf5ff', accent: '#9333ea', text: '#581c87', surface: '#f3e8ff' },
  yesil: { bg: '#ecfdf5', accent: '#059669', text: '#064e3b', surface: '#d1fae5' },
  korall: { bg: '#fff1f2', accent: '#e11d48', text: '#881337', surface: '#ffe4e6' },
  lavanta: { bg: '#f5f3ff', accent: '#7c3aed', text: '#4c1d95', surface: '#ede9fe' },
  altin: { bg: '#fffbeb', accent: '#d97706', text: '#78350f', surface: '#fef3c7' },
  mint: { bg: '#f0fdfa', accent: '#0d9488', text: '#134e4a', surface: '#ccfbf1' },
};

function gt(
  id: string,
  ad: string,
  aciklama: string,
  tema: WidgetGorunumTema,
  ilham?: string
): WidgetGorunumTipTanimi {
  return { id, ad, aciklama, tema, ilham };
}

/** Her widget tipi için 6 benzersiz görünüm varyantı (layout + renk teması) */
export const WIDGET_GORUNUM_TIP_TANIMLARI: Record<AktifWidgetTipi, WidgetGorunumTipTanimi[]> = {
  SLIDER: [
    gt('sinematik', 'Sinematik', 'Tam ekran koyu slayt', 'gece', 'Netflix'),
    gt('kart-golge', 'Kart Gölge', 'Yuvarlak kart içinde slayt', 'notr', 'Stripe'),
    gt('bolunmus-metin', 'Bölünmüş Metin', 'Sol yazı, sağ görsel', 'okyanus'),
    gt('minimal-cizgi', 'Minimal Çizgi', 'İnce alt çizgi navigasyon', 'lavanta'),
    gt('gradient-hero', 'Gradient Hero', 'Renkli gradient arka plan', 'mor'),
    gt('kenar-cerceve', 'Kenar Çerçeve', 'Kalın renkli çerçeve', 'altin'),
  ],
  HIZMET_KARTLARI: [
    gt('beyaz-grid', 'Beyaz Grid', 'Klasik beyaz kart grid', 'notr'),
    gt('cam-yuzey', 'Cam Yüzey', 'Glassmorphism kartlar', 'okyanus'),
    gt('koyu-premium', 'Koyu Premium', 'Koyu arka plan, parlak ikonlar', 'gece'),
    gt('yesil-cizgi', 'Yeşil Çizgi', 'Sol yeşil vurgu çizgili kartlar', 'yesil'),
    gt('gradient-kart', 'Gradient Kart', 'Her kart hafif gradient', 'mor'),
    gt('yatay-liste', 'Yatay Liste', 'Dikey liste, ikon solda', 'mint'),
  ],
  KATEGORI: [
    gt('grid-ikon', 'Grid İkon', 'Ikonlu kare grid', 'notr'),
    gt('pill-renkli', 'Pill Renkli', 'Renkli yuvarlak pill', 'gunes'),
    gt('buyuk-gorsel', 'Büyük Görsel', 'Geniş görsel kartlar', 'okyanus'),
    gt('koyu-etiket', 'Koyu Etiket', 'Koyu zemin etiketler', 'gece'),
    gt('cizgili-minimal', 'Çizgili Minimal', 'Alt çizgili sade linkler', 'lavanta'),
    gt('korall-vurgu', 'Korall Vurgu', 'Pembe vurgulu kartlar', 'korall'),
  ],
  REFERANSLAR: [
    gt('logo-grid', 'Logo Grid', 'Logo/metin ızgarası', 'notr'),
    gt('kayan-serit', 'Kayan Şerit', 'Yatay kaydırmalı', 'okyanus'),
    gt('buyuk-alinti', 'Büyük Alıntı', 'Tek büyük alıntı', 'mor'),
    gt('koyu-band', 'Koyu Band', 'Koyu arka plan şerit', 'gece'),
    gt('cerceveli-kutu', 'Çerçeveli Kutu', 'İnce çerçeveli kutular', 'altin'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Minimal yeşil ton', 'yesil'),
  ],
  SSS: [
    gt('accordion-beyaz', 'Accordion Beyaz', 'Beyaz accordion', 'notr'),
    gt('iki-kolon-mavi', 'İki Kolon Mavi', 'Mavi ton iki kolon', 'okyanus'),
    gt('kart-golgeli', 'Kart Gölgeli', 'Gölgeli kart SSS', 'lavanta'),
    gt('koyu-panel', 'Koyu Panel', 'Koyu arka plan panel', 'gece'),
    gt('turuncu-vurgu', 'Turuncu Vurgu', 'Turuncu açık vurgu', 'gunes'),
    gt('cizgili-sade', 'Çizgili Sade', 'Alt çizgili sade liste', 'mint'),
  ],
  GALERI: [
    gt('esit-grid', 'Eşit Grid', 'Düzenli grid galeri', 'notr'),
    gt('masonry-mor', 'Masonry Mor', 'Pinterest mor ton', 'mor'),
    gt('lightbox-koyu', 'Lightbox Koyu', 'Koyu lightbox odak', 'gece'),
    gt('cerceveli-altin', 'Çerçeveli Altın', 'Altın çerçeveli', 'altin'),
    gt('yesil-hover', 'Yeşil Hover', 'Yeşil hover efekt', 'yesil'),
    gt('genis-serit', 'Geniş Şerit', 'Yatay geniş şerit', 'okyanus'),
  ],
  HARITA: [
    gt('tam-genislik', 'Tam Genişlik', 'Kenardan kenara harita', 'notr'),
    gt('bolunmus-bilgi', 'Bölünmüş Bilgi', 'Sol metin, sağ harita', 'okyanus'),
    gt('kart-golge', 'Kart Gölge', 'Gölgeli harita kartı', 'lavanta'),
    gt('koyu-cerceve', 'Koyu Çerçeve', 'Koyu çerçeveli harita', 'gece'),
    gt('mint-kart', 'Mint Kart', 'Mint ton kart içinde', 'mint'),
    gt('turuncu-baslik', 'Turuncu Başlık', 'Turuncu başlıklı bölüm', 'gunes'),
  ],
  ILETISIM_FORMU: [
    gt('merkez-basit', 'Merkez Basit', 'Ortalanmış tek buton', 'notr'),
    gt('gradient-banner', 'Gradient Banner', 'Turuncu gradient CTA', 'gunes', 'SaaS'),
    gt('bol-split', 'Bölünmüş', 'Sol metin, sağ butonlar', 'okyanus'),
    gt('koyu-cam', 'Koyu Cam', 'Koyu glassmorphism panel', 'gece'),
    gt('mor-serit', 'Mor Şerit', 'Mor tam genişlik band', 'mor'),
    gt('yesil-cerceve', 'Yeşil Çerçeve', 'Yeşil çerçeveli minimal', 'yesil'),
  ],
  POPUP: [
    gt('ortada-modal', 'Ortada Modal', 'Klasik orta popup', 'notr'),
    gt('alt-kaydirma', 'Alt Kaydırma', 'Alttan kayan banner', 'okyanus'),
    gt('sag-kose', 'Sağ Köşe', 'Sağ alt bildirim', 'gece'),
    gt('mor-kart', 'Mor Kart', 'Mor ton kart popup', 'mor'),
    gt('turuncu-uyari', 'Turuncu Uyarı', 'Turuncu dikkat bandı', 'gunes'),
    gt('mint-minimal', 'Mint Minimal', 'Küçük mint bildirim', 'mint'),
  ],
  BASLIK_METIN: [
    gt('duz-paragraf', 'Düz Paragraf', 'Standart başlık + metin', 'notr'),
    gt('sol-cizgi', 'Sol Çizgi', 'Sol mor vurgu çizgisi', 'mor'),
    gt('hero-buyuk', 'Hero Büyük', 'Büyük hero tipografi', 'gece'),
    gt('okyanus-kutu', 'Okyanus Kutu', 'Mavi kutu içinde metin', 'okyanus'),
    gt('turuncu-badge', 'Turuncu Badge', 'Turuncu üst etiket', 'gunes'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil ton', 'yesil'),
  ],
  BASLIK_METIN_GORSEL: [
    gt('yan-yana', 'Yan Yana', 'Metin + görsel yan yana', 'notr'),
    gt('overlay-koyu', 'Overlay Koyu', 'Koyu görsel üzeri metin', 'gece'),
    gt('kart-mor', 'Kart Mor', 'Mor kart içinde', 'mor'),
    gt('gradient-arkaplan', 'Gradient Arkaplan', 'Gradient zemin', 'gunes'),
    gt('mint-cerceve', 'Mint Çerçeve', 'Mint çerçeveli düzen', 'mint'),
    gt('okyanus-split', 'Okyanus Split', 'Mavi bölünmüş layout', 'okyanus'),
  ],
  BLOG_KARUSEL: [
    gt('yatay-kart', 'Yatay Kart', 'Klasik yatay karusel', 'notr'),
    gt('buyuk-onizleme', 'Büyük Önizleme', 'Geniş kart önizleme', 'okyanus'),
    gt('kompakt-liste', 'Kompakt Liste', 'Dikey kompakt liste', 'lavanta'),
    gt('koyu-kart', 'Koyu Kart', 'Koyu arka plan kartlar', 'gece'),
    gt('turuncu-vurgu', 'Turuncu Vurgu', 'Turuncu CTA vurgusu', 'gunes'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil liste', 'yesil'),
  ],
  LINK_KARTLARI: [
    gt('ikon-grid', 'İkon Grid', 'Ikonlu grid linkler', 'notr'),
    gt('cam-panel', 'Cam Panel', 'Glassmorphism panel', 'okyanus'),
    gt('dikey-liste', 'Dikey Liste', 'Dikey link listesi', 'mint'),
    gt('mor-kare', 'Mor Kare', 'Mor kare kartlar', 'mor'),
    gt('koyu-ikon', 'Koyu İkon', 'Koyu zemin ikonlar', 'gece'),
    gt('altin-cizgi', 'Altın Çizgi', 'Altın alt çizgili', 'altin'),
  ],
  GORSEL_GRID_BLOK: [
    gt('sol-panel', 'Sol Panel', 'Sol filtre + grid', 'notr'),
    gt('tam-grid-mavi', 'Tam Grid Mavi', 'Tam mavi ton grid', 'okyanus'),
    gt('hero-kart', 'Hero Kart', 'İlk kart büyük hero', 'mor'),
    gt('koyu-overlay', 'Koyu Overlay', 'Koyu overlay kartlar', 'gece'),
    gt('yesil-filtre', 'Yeşil Filtre', 'Yeşil filtre çipleri', 'yesil'),
    gt('turuncu-vurgu', 'Turuncu Vurgu', 'Turuncu hover vurgu', 'gunes'),
  ],
  GORSEL_ETIKET_KARTLARI: [
    gt('alt-etiket', 'Alt Etiket', 'Görsel + alt etiket', 'notr'),
    gt('ust-overlay', 'Üst Overlay', 'Görsel üzeri etiket', 'gece'),
    gt('mor-cerceve', 'Mor Çerçeve', 'Mor çerçeveli kart', 'mor'),
    gt('mint-kucuk', 'Mint Küçük', 'Kompakt mint kart', 'mint'),
    gt('okyanus-buyuk', 'Okyanus Büyük', 'Geniş mavi kartlar', 'okyanus'),
    gt('korall-hover', 'Korall Hover', 'Pembe hover efekt', 'korall'),
  ],
  EKIP_KARUSEL: [
    gt('yuvarlak-foto', 'Yuvarlak Foto', 'Yuvarlak foto + bilgi', 'notr'),
    gt('kare-kart', 'Kare Kart', 'Kare kart stili', 'lavanta'),
    gt('sade-isim', 'Sade İsim', 'Minimal foto + isim', 'mint'),
    gt('koyu-profil', 'Koyu Profil', 'Koyu arka plan profil', 'gece'),
    gt('mor-unvan', 'Mor Unvan', 'Mor unvan vurgusu', 'mor'),
    gt('turuncu-cerceve', 'Turuncu Çerçeve', 'Turuncu çerçeveli', 'gunes'),
  ],
  SAYAC_BLOK: [
    gt('buyuk-rakam', 'Büyük Rakam', 'Büyük rakam grid', 'notr'),
    gt('pill-serit', 'Pill Şerit', 'Kapsül istatistik şeridi', 'okyanus'),
    gt('cam-kartlar', 'Cam Kartlar', 'Glassmorphism sayaç', 'lavanta'),
    gt('koyu-neon', 'Koyu Neon', 'Koyu neon rakamlar', 'gece'),
    gt('yesil-artis', 'Yeşil Artış', 'Yeşil trend vurgusu', 'yesil'),
    gt('altin-premium', 'Altın Premium', 'Altın premium sayaç', 'altin'),
  ],
  YORUM_KARUSEL: [
    gt('kart-karusel', 'Kart Karusel', 'Yorum kart karuseli', 'notr'),
    gt('tek-alinti', 'Tek Alıntı', 'Büyük tek alıntı', 'mor'),
    gt('kompakt-yildiz', 'Kompakt Yıldız', 'Küçük yıldızlı liste', 'lavanta'),
    gt('koyu-panel', 'Koyu Panel', 'Koyu arka plan yorum', 'gece'),
    gt('okyanus-kart', 'Okyanus Kart', 'Mavi ton kartlar', 'okyanus'),
    gt('mint-minimal', 'Mint Minimal', 'Sade mint liste', 'mint'),
  ],
  YORUM_KARTLARI: [
    gt('grid-beyaz', 'Grid Beyaz', 'Beyaz kart grid', 'notr'),
    gt('yildiz-vurgu', 'Yıldız Vurgu', 'Altın yıldız vurgulu kartlar', 'altin'),
    gt('koyu-kart', 'Koyu Kart', 'Koyu arka plan yorum kartı', 'gece'),
    gt('mor-cerceve', 'Mor Çerçeve', 'Mor çerçeveli kartlar', 'mor'),
    gt('okyanus-liste', 'Okyanus Liste', 'Mavi ton kart grid', 'okyanus'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil yorum kartları', 'yesil'),
  ],
  FIYATLANDIRMA: [
    gt('uc-kolon', 'Üç Kolon', 'Klasik 3 kolon fiyat', 'notr'),
    gt('orta-vurgu', 'Orta Vurgu', 'Orta paket öne çıkar', 'mor'),
    gt('tablo-sade', 'Tablo Sade', 'Sade tablo stili', 'mint'),
    gt('koyu-premium', 'Koyu Premium', 'Koyu premium kartlar', 'gece'),
    gt('turuncu-populer', 'Turuncu Popüler', 'Turuncu popüler etiket', 'gunes'),
    gt('yesil-ekonomik', 'Yeşil Ekonomik', 'Yeşil ekonomik paket', 'yesil'),
  ],
  ZAMAN_CIZELGESI: [
    gt('dikey-cizgi', 'Dikey Çizgi', 'Dikey timeline', 'notr'),
    gt('yatay-adim', 'Yatay Adım', 'Yatay adım çizgisi', 'okyanus'),
    gt('kart-zaman', 'Kart Zaman', 'Kart bazlı timeline', 'lavanta'),
    gt('koyu-milestone', 'Koyu Milestone', 'Koyu milestone noktalar', 'gece'),
    gt('turuncu-nokta', 'Turuncu Nokta', 'Turuncu nokta vurgusu', 'gunes'),
    gt('yesil-akış', 'Yeşil Akış', 'Yeşil akış çizgisi', 'yesil'),
  ],
  SUREC_ADIMLARI: [
    gt('kart-grid', 'Kart Grid', 'Beyaz numaralı kart grid', 'notr'),
    gt('koyu-yatay-adim', 'Koyu Yatay', 'Koyu yatay 3 adım', 'gece', 'SaaS'),
    gt('dikey-zaman', 'Dikey Zaman', 'Dikey adım akışı', 'okyanus'),
    gt('renkli-kart', 'Renkli Kart', 'Her adım farklı renk', 'mor'),
    gt('ok-baglantili', 'Ok Bağlantılı', 'Ok ile bağlı adımlar', 'yesil'),
    gt('buyuk-simge', 'Büyük Simge', 'Büyük simge daireleri', 'gunes'),
  ],
  MARKA_SERIDI: [
    gt('logo-kayan', 'Logo Kayan', 'Yatay kayan logo şeridi', 'notr'),
    gt('egik-metin-seridi', 'Eğik Metin', 'Turuncu eğik metin bandı', 'gunes', 'Landing'),
    gt('istatistik-kapsul', 'İstatistik Kapsül', 'KPI pill şerit', 'okyanus', 'Dashboard'),
    gt('neon-gece', 'Neon Gece', 'Koyu neon kayan metin', 'gece'),
    gt('dalga-mor', 'Dalga Mor', 'Mor-pembe dalga gradient', 'mor'),
    gt('cift-serit', 'Çift Şerit', 'Zıt yönde çift şerit', 'mint'),
  ],
  KARSILASTIRMA_TABLOSU: [
    gt('tam-tablo', 'Tam Tablo', 'Klasik karşılaştırma tablosu', 'notr'),
    gt('mobil-kart', 'Mobil Kart', 'Kart bazlı görünüm', 'okyanus'),
    gt('minimal-cizgi', 'Minimal Çizgi', 'İnce çizgili sade tablo', 'mint'),
    gt('koyu-baslik', 'Koyu Başlık', 'Koyu başlık satırı', 'gece'),
    gt('mor-vurgu', 'Mor Vurgu', 'Mor öne çıkan sütun', 'mor'),
    gt('yesil-onay', 'Yeşil Onay', 'Yeşil onay işaretleri', 'yesil'),
  ],
  GERI_SAYIM: [
    gt('koyu-buyuk', 'Koyu Büyük', 'Koyu büyük sayaç + CTA', 'gece'),
    gt('kompakt-serit', 'Kompakt Şerit', 'Küçük inline sayaç', 'notr'),
    gt('tam-banner', 'Tam Banner', 'Tam genişlik banner', 'gunes'),
    gt('mor-gradient', 'Mor Gradient', 'Mor gradient arka plan', 'mor'),
    gt('okyanus-sade', 'Okyanus Sade', 'Mavi sade sayaç', 'okyanus'),
    gt('yesil-kampanya', 'Yeşil Kampanya', 'Yeşil kampanya bandı', 'yesil'),
  ],
  VIDEO_BANNER: [
    gt('tam-video', 'Tam Video', 'Tam genişlik video arka plan', 'gece'),
    gt('bolunmus-metin', 'Bölünmüş Metin', 'Sol metin, sağ video', 'okyanus'),
    gt('cerceveli-kart', 'Çerçeveli Kart', 'Çerçeveli video kart', 'notr'),
    gt('mor-overlay', 'Mor Overlay', 'Mor gradient overlay', 'mor'),
    gt('turuncu-cta', 'Turuncu CTA', 'Turuncu CTA vurgusu', 'gunes'),
    gt('mint-minimal', 'Mint Minimal', 'Küçük mint video kart', 'mint'),
  ],
  ONCESI_SONRASI: [
    gt('surukle-karsilastir', 'Sürükle Karşılaştır', 'Kaydırmalı slider', 'notr'),
    gt('yan-yana-sabit', 'Yan Yana Sabit', 'Sabit iki görsel', 'okyanus'),
    gt('cerceveli-kart', 'Çerçeveli Kart', 'Çerçeveli karşılaştırma', 'lavanta'),
    gt('koyu-etiket', 'Koyu Etiket', 'Koyu etiketli slider', 'gece'),
    gt('turuncu-cizgi', 'Turuncu Çizgi', 'Turuncu tutamaç çizgisi', 'gunes'),
    gt('yesil-etiket', 'Yeşil Etiket', 'Yeşil önce/sonra etiket', 'yesil'),
  ],
  BULTEN_KAYIT: [
    gt('ortalanmis-form', 'Ortalanmış Form', 'Ortada abonelik formu', 'notr'),
    gt('tam-banner-mavi', 'Tam Banner Mavi', 'Mavi tam genişlik band', 'okyanus'),
    gt('kart-golge', 'Kart Gölge', 'Gölgeli kart form', 'lavanta'),
    gt('koyu-cam', 'Koyu Cam', 'Koyu glassmorphism form', 'gece'),
    gt('turuncu-serit', 'Turuncu Şerit', 'Turuncu bülten şeridi', 'gunes'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil form', 'yesil'),
  ],
  BLOK_OLUSTURUCU: [
    gt('standart-grid', 'Standart Grid', 'Standart grid parçalar', 'notr'),
    gt('cam-parca', 'Cam Parça', 'Glassmorphism parçalar', 'okyanus'),
    gt('sade-duzen', 'Sade Düzen', 'Minimal sade düzen', 'mint'),
    gt('koyu-modul', 'Koyu Modül', 'Koyu modül blokları', 'gece'),
    gt('mor-kart', 'Mor Kart', 'Mor ton kart parçalar', 'mor'),
    gt('turuncu-vurgu', 'Turuncu Vurgu', 'Turuncu kenar vurgusu', 'gunes'),
  ],
  KOSE_YAZARLARI: [
    gt('karusel-kart', 'Karusel Kart', 'Yazar kart karuseli', 'notr'),
    gt('dikey-liste', 'Dikey Liste', 'Dikey yazar listesi', 'lavanta'),
    gt('buyuk-profil', 'Büyük Profil', 'Geniş profil kartları', 'okyanus'),
    gt('koyu-yazar', 'Koyu Yazar', 'Koyu arka plan yazar', 'gece'),
    gt('turuncu-unvan', 'Turuncu Unvan', 'Turuncu unvan vurgusu', 'gunes'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil liste', 'yesil'),
  ],
  ILETISIM_BLOK: [
    gt('kart-harita', 'Kart + Harita', 'Kartlar ve harita yan yana', 'notr'),
    gt('bolunmus-panel', 'Bölünmüş Panel', 'Sol kartlar, sağ harita', 'okyanus'),
    gt('kompakt-kart', 'Kompakt Kart', 'Kompakt kart düzeni', 'mint'),
    gt('koyu-iletisim', 'Koyu İletişim', 'Koyu iletişim paneli', 'gece'),
    gt('mor-kart', 'Mor Kart', 'Mor ton kartlar', 'mor'),
    gt('turuncu-baslik', 'Turuncu Başlık', 'Turuncu başlıklı bölüm', 'gunes'),
  ],
  KATEGORI_HABER_LISTESI: [
    gt('yatay-liste', 'Yatay Liste', 'Yatay haber kart listesi', 'notr'),
    gt('hero-liste', 'Hero Liste', 'İlk haber büyük hero', 'okyanus'),
    gt('kompakt-satir', 'Kompakt Satır', 'Kompakt satır listesi', 'mint'),
    gt('koyu-kart', 'Koyu Kart', 'Koyu haber kartları', 'gece'),
    gt('turuncu-kategori', 'Turuncu Kategori', 'Turuncu kategori vurgusu', 'gunes'),
    gt('mor-overlay', 'Mor Overlay', 'Mor ton overlay', 'mor'),
  ],
  KATEGORI_HABER_OVERLAY: [
    gt('overlay-grid', 'Overlay Grid', 'Görsel üzeri başlık grid', 'notr'),
    gt('hero-grid', 'Hero Grid', 'İlk kart büyük hero', 'okyanus'),
    gt('kucuk-grid', 'Küçük Grid', 'Kompakt küçük grid', 'mint'),
    gt('koyu-overlay', 'Koyu Overlay', 'Koyu gradient overlay', 'gece'),
    gt('korall-baslik', 'Korall Başlık', 'Pembe başlık vurgusu', 'korall'),
    gt('yesil-etiket', 'Yeşil Etiket', 'Yeşil kategori etiketi', 'yesil'),
  ],
  VIDEO_GALERISI: [
    gt('kapak-grid', 'Kapak Grid', 'Video kapak grid', 'notr'),
    gt('hero-video', 'Hero Video', 'İlk video büyük', 'gece'),
    gt('dikey-liste', 'Dikey Liste', 'Dikey video listesi', 'lavanta'),
    gt('okyanus-kart', 'Okyanus Kart', 'Mavi ton video kart', 'okyanus'),
    gt('turuncu-play', 'Turuncu Play', 'Turuncu play butonu', 'gunes'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil liste', 'yesil'),
  ],
  SEKMELI_HABER: [
    gt('alt-cizgi-sekme', 'Alt Çizgi Sekme', 'Klasik alt çizgili sekme', 'notr'),
    gt('pill-sekme', 'Pill Sekme', 'Yuvarlak pill sekmeler', 'okyanus'),
    gt('sade-sekme', 'Sade Sekme', 'Minimal sade sekme', 'mint'),
    gt('koyu-panel', 'Koyu Panel', 'Koyu sekme paneli', 'gece'),
    gt('turuncu-aktif', 'Turuncu Aktif', 'Turuncu aktif sekme', 'gunes'),
    gt('mor-vurgu', 'Mor Vurgu', 'Mor aktif sekme', 'mor'),
  ],
  HAVA_DURUMU: [
    gt('detayli-panel', 'Detaylı Panel', 'Detaylı hava paneli', 'okyanus'),
    gt('kompakt-ozet', 'Kompakt Özet', 'Küçük hava özeti', 'notr'),
    gt('tam-banner', 'Tam Banner', 'Tam genişlik hava bandı', 'gece'),
    gt('turuncu-gunes', 'Turuncu Güneş', 'Turuncu güneş ikonlu', 'gunes'),
    gt('yesil-tahmin', 'Yeşil Tahmin', 'Yeşil tahmin kartı', 'yesil'),
    gt('mor-gece', 'Mor Gece', 'Mor gece modu', 'mor'),
  ],
  KRIPTO_LISTESI: [
    gt('fiyat-tablosu', 'Fiyat Tablosu', 'Klasik fiyat tablosu', 'notr'),
    gt('kart-liste', 'Kart Liste', 'Kart bazlı liste', 'gece'),
    gt('ticker-serit', 'Ticker Şerit', 'Kayan ticker şerit', 'okyanus'),
    gt('yesil-artis', 'Yeşil Artış', 'Yeşil/kırmızı trend', 'yesil'),
    gt('mor-koyu', 'Mor Koyu', 'Mor koyu tablo', 'mor'),
    gt('altin-premium', 'Altın Premium', 'Altın premium liste', 'altin'),
  ],
  GUNCEL_KONULAR: [
    gt('numarali-liste', 'Numaralı Liste', 'Numaralı haber listesi', 'notr'),
    gt('hero-konu', 'Hero Konu', 'İlk konu büyük hero', 'korall'),
    gt('kompakt-liste', 'Kompakt Liste', 'Kompakt liste', 'mint'),
    gt('koyu-numara', 'Koyu Numara', 'Koyu numaralı liste', 'gece'),
    gt('okyanus-vurgu', 'Okyanus Vurgu', 'Mavi vurgu numaralar', 'okyanus'),
    gt('turuncu-baslik', 'Turuncu Başlık', 'Turuncu başlık satırı', 'gunes'),
  ],
  SIRKET_GIRIS_CIKIS: [
    gt('saat-tablosu', 'Saat Tablosu', 'Açılış/kapanış tablosu', 'notr'),
    gt('canli-banner', 'Canlı Banner', 'Canlı saat bandı', 'okyanus'),
    gt('bilgi-kart', 'Bilgi Kart', 'Kompakt bilgi kartı', 'lavanta'),
    gt('koyu-saat', 'Koyu Saat', 'Koyu canlı saat', 'gece'),
    gt('yesil-acik', 'Yeşil Açık', 'Yeşil açık göstergesi', 'yesil'),
    gt('turuncu-uyari', 'Turuncu Uyarı', 'Turuncu kapanış uyarısı', 'gunes'),
  ],
  HABER_MAGAZIN: [
    gt('magazin-grid', 'Magazin Grid', 'Karışık magazin grid', 'notr'),
    gt('hero-magazin', 'Hero Magazin', 'Hero + küçük grid', 'mor'),
    gt('kompakt-magazin', 'Kompakt Magazin', 'Kompakt magazin', 'mint'),
    gt('koyu-editor', 'Koyu Editör', 'Koyu editoryal layout', 'gece'),
    gt('turuncu-spot', 'Turuncu Spot', 'Turuncu spot haber', 'gunes'),
    gt('okyanus-kategori', 'Okyanus Kategori', 'Mavi kategori bandı', 'okyanus'),
  ],
};

export function widgetGorunumTipleriBul(widgetTip: string): WidgetGorunumTipTanimi[] {
  const tipler = WIDGET_GORUNUM_TIP_TANIMLARI[widgetTip as AktifWidgetTipi];
  if (tipler?.length) return tipler;
  return [gt('klasik', 'Klasik', 'Varsayılan görünüm', 'notr')];
}

/** Eski kayıtlı widget'lar için geriye dönük eşleme */
const LEGACY_GORUNUM_TIPI: Partial<Record<AktifWidgetTipi, Record<string, string>>> = {
  GERI_SAYIM: { klasik: 'koyu-buyuk', kompakt: 'kompakt-serit', banner: 'tam-banner' },
  REFERANSLAR: { klasik: 'logo-grid', carousel: 'kayan-serit', quote: 'buyuk-alinti' },
  VIDEO_BANNER: { klasik: 'tam-video', 'bol-split': 'bolunmus-metin', kart: 'cerceveli-kart' },
  HARITA: { klasik: 'tam-genislik', 'bol-split': 'bolunmus-bilgi', kart: 'kart-golge' },
  KATEGORI: { klasik: 'grid-ikon', pill: 'pill-renkli', 'buyuk-kart': 'buyuk-gorsel' },
  KARSILASTIRMA_TABLOSU: { klasik: 'tam-tablo', kart: 'mobil-kart', minimal: 'minimal-cizgi' },
  BULTEN_KAYIT: { klasik: 'ortalanmis-form', banner: 'tam-banner-mavi', kart: 'kart-golge' },
  ONCESI_SONRASI: { klasik: 'surukle-karsilastir', 'yan-yana': 'yan-yana-sabit', kart: 'cerceveli-kart' },
  ZAMAN_CIZELGESI: { dikey: 'dikey-cizgi', yatay: 'yatay-adim', kart: 'kart-zaman' },
  ILETISIM_BLOK: { klasik: 'kart-harita', 'bol-split': 'bolunmus-panel', kart: 'kompakt-kart' },
  HIZMET_KARTLARI: { 'klasik-grid': 'beyaz-grid', 'cam-kart': 'cam-yuzey', 'minimal-liste': 'yatay-liste' },
  LINK_KARTLARI: { 'klasik-grid': 'ikon-grid', 'cam-kart': 'cam-panel', 'minimal-liste': 'dikey-liste' },
  SAYAC_BLOK: { klasik: 'buyuk-rakam', kapsul: 'pill-serit', 'cam-kart': 'cam-kartlar' },
  SLIDER: { klasik: 'sinematik', kart: 'kart-golge', bolunmus: 'bolunmus-metin' },
  GALERI: { 'klasik-grid': 'esit-grid' },
  GORSEL_ETIKET_KARTLARI: { 'klasik-grid': 'alt-etiket', overlay: 'ust-overlay', minimal: 'mint-kucuk' },
  BLOK_OLUSTURUCU: { klasik: 'standart-grid', 'cam-kart': 'cam-parca', minimal: 'sade-duzen' },
  KATEGORI_HABER_LISTESI: { klasik: 'yatay-liste', 'buyuk-onizleme': 'hero-liste', minimal: 'kompakt-satir' },
  KATEGORI_HABER_OVERLAY: { klasik: 'overlay-grid', 'buyuk-onizleme': 'hero-grid', minimal: 'kucuk-grid' },
  VIDEO_GALERISI: { klasik: 'kapak-grid', 'buyuk-onizleme': 'hero-video', liste: 'dikey-liste' },
  SEKMELI_HABER: { klasik: 'alt-cizgi-sekme', minimal: 'sade-sekme' },
  HAVA_DURUMU: { klasik: 'detayli-panel', kompakt: 'kompakt-ozet', banner: 'tam-banner' },
  KRIPTO_LISTESI: { klasik: 'fiyat-tablosu', kart: 'kart-liste', minimal: 'ticker-serit' },
  GUNCEL_KONULAR: { klasik: 'numarali-liste', 'buyuk-onizleme': 'hero-konu', minimal: 'kompakt-liste' },
  SIRKET_GIRIS_CIKIS: { klasik: 'saat-tablosu', banner: 'canli-banner', kart: 'bilgi-kart' },
  HABER_MAGAZIN: { klasik: 'magazin-grid', 'buyuk-onizleme': 'hero-magazin', minimal: 'kompakt-magazin' },
  FIYATLANDIRMA: { klasik: 'uc-kolon', 'vurgulu-orta': 'orta-vurgu', minimal: 'tablo-sade' },
  YORUM_KARUSEL: { klasik: 'kart-karusel', 'buyuk-alinti': 'tek-alinti', minimal: 'kompakt-yildiz' },
  YORUM_KARTLARI: { klasik: 'grid-beyaz', kart: 'yildiz-vurgu', minimal: 'yesil-minimal' },
  EKIP_KARUSEL: { klasik: 'yuvarlak-foto', kart: 'kare-kart', minimal: 'sade-isim' },
  BLOG_KARUSEL: { klasik: 'yatay-kart', 'buyuk-kart': 'buyuk-onizleme', minimal: 'kompakt-liste' },
  SSS: { klasik: 'accordion-beyaz', 'iki-kolon': 'iki-kolon-mavi', kart: 'kart-golgeli' },
  BASLIK_METIN: { klasik: 'duz-paragraf', 'vurgu-cizgi': 'sol-cizgi', 'buyuk-baslik': 'hero-buyuk' },
  POPUP: { klasik: 'ortada-modal', 'slide-alt': 'alt-kaydirma', kose: 'sag-kose' },
  KOSE_YAZARLARI: { klasik: 'karusel-kart', liste: 'dikey-liste', 'buyuk-kart': 'buyuk-profil' },
};

export function widgetGorunumTipiNormalize(widgetTip: string, gorunumTipi?: string | null): string {
  const tipler = widgetGorunumTipleriBul(widgetTip);
  const legacy = LEGACY_GORUNUM_TIPI[widgetTip as AktifWidgetTipi];
  const aday = gorunumTipi && legacy?.[gorunumTipi] ? legacy[gorunumTipi] : gorunumTipi;
  if (aday && tipler.some((t) => t.id === aday)) return aday;
  return tipler[0]?.id ?? 'klasik';
}

export function widgetGorunumTipTanimiBul(widgetTip: string, gorunumTipi?: string | null): WidgetGorunumTipTanimi {
  const id = widgetGorunumTipiNormalize(widgetTip, gorunumTipi);
  return widgetGorunumTipleriBul(widgetTip).find((t) => t.id === id) ?? widgetGorunumTipleriBul(widgetTip)[0];
}

export function widgetGorunumTemaAl(widgetTip: string, gorunumTipi?: string | null): WidgetGorunumTema {
  return widgetGorunumTipTanimiBul(widgetTip, gorunumTipi).tema;
}

export function varsayilanWidgetGorunumTipi(widgetTip: string): string {
  return widgetGorunumTipleriBul(widgetTip)[0]?.id ?? 'klasik';
}

/** CSS modifier: widget-marka-seridi--logo-kayan widget-gt-gunes */
export function widgetGorunumSinifi(widgetTip: string, gorunumTipi?: string | null): string {
  const tanim = widgetGorunumTipTanimiBul(widgetTip, gorunumTipi);
  const slug = widgetTip.toLowerCase().replace(/_/g, '-');
  return `widget-${slug} widget-${slug}--${tanim.id} widget-gt-${tanim.tema}`;
}

export function tumAktifWidgetTipleri(): readonly string[] {
  return AKTIF_WIDGET_TIPLERI;
}
