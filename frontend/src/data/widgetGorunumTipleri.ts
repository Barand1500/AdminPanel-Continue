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
    gt('split-ozellik-vitrin', 'Split Özellik Vitrin', 'Sol metin + özellik chip, sağ orbit görsel', 'notr'),
    gt('cam-hero-beyaz', 'Cam Hero Beyaz', 'Beyaz zemin cam efektli hero kart', 'okyanus'),
    gt('orbit-merkez', 'Orbit Merkez', 'Ortada görsel, etrafında orbit halka', 'lavanta'),
    gt('badge-modern', 'Badge Modern', 'Badge + başlık + mini özellik kartları', 'gunes'),
    gt('sinematik-acik', 'Sinematik Açık', 'Açık tema sinematik split slayt', 'mint'),
    gt('gradient-split', 'Gradient Split', 'Gradient zemin bölünmüş hero', 'mor'),
  ],
  HIZMET_KARTLARI: [
    gt('masonry-duvar', 'Masonry Duvar', 'Farklı yükseklikte Pinterest tarzı duvar', 'notr'),
    gt('hover-flip', 'Hover Flip', 'Ön yüz ikon, arka yüz detay + CTA', 'mor', 'Stripe'),
    gt('sekmeli-panel', 'Sekmeli Panel', 'Sekme seçince detay paneli açılır', 'okyanus'),
    gt('orbit-duzen', 'Orbit Düzen', 'Ortada başlık, etrafında dairesel kartlar', 'lavanta'),
    gt('hero-mini-grid', 'Hero + Mini Grid', 'İlk kart büyük vitrin, diğerleri küçük grid', 'gunes'),
    gt('yatay-serit', 'Yatay Şerit', 'Kaydırmalı kart şeridi, snap scroll', 'mint'),
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
    gt('iki-kolon-grid', 'İki Kolon Grid', 'İki sütun bağımsız accordion', 'okyanus'),
    gt('sekmeli-kategori', 'Sekmeli Kategori', 'Sekmelerle filtrelenmiş SSS', 'lavanta'),
    gt('arama-filtre', 'Arama Filtre', 'Anlık arama ile filtreleme', 'yesil'),
    gt('tek-acik-odak', 'Tek Açık Odak', 'Tek soru vurgulu açık', 'mor'),
    gt('kart-destesi', 'Kart Destesi', 'Gölgeli kart destesi', 'notr'),
    gt('yan-menu-icerik', 'Yan Menü İçerik', 'Sol menü, sağ cevap paneli', 'altin'),
  ],
  GALERI: [
    gt('snap-yatay-serit', 'Snap Yatay Şerit', 'Tam genişlik yatay kaydırma', 'okyanus'),
    gt('hero-vitrin', 'Hero Vitrin', 'Büyük öne çıkan + küçük şerit', 'mor'),
    gt('lightbox-odak', 'Lightbox Odak', 'Grid + tam ekran modal', 'gece'),
    gt('sekmeli-kategori', 'Sekmeli Kategori', 'Üst sekmelerle filtreleme', 'lavanta'),
    gt('hover-zoom-etiket', 'Hover Zoom Etiket', 'Kare grid, hover zoom', 'yesil'),
    gt('karusel-merkez', 'Karusel Merkez', 'Ortada büyük slayt, yan önizleme', 'altin'),
  ],
  HARITA: [
    gt('split-sol-bilgi', 'Split Sol Bilgi', 'Sol metin + sağ harita', 'okyanus'),
    gt('split-ters', 'Split Ters', 'Sol harita, sağ bilgi', 'lavanta'),
    gt('ust-bant-alt', 'Üst Bant Alt', 'Üst başlık bandı + harita', 'gunes'),
    gt('yan-ikon-liste', 'Yan İkon Liste', 'Harita + ikonlu bilgi listesi', 'yesil'),
    gt('kompakt-kart', 'Kompakt Kart', 'Ortalanmış kart + CTA', 'notr'),
    gt('sekme-subeler', 'Sekmeli Şubeler', 'Sekmelerle çoklu konum', 'mor'),
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
    gt('alt-kaydirma', 'Alt Kaydırma', 'Alttan kayan panel', 'okyanus'),
    gt('sag-kose', 'Sağ Köşe', 'Sağ alt bildirim kartı', 'gece'),
    gt('cam-kart', 'Cam Kart', 'Gradient cam efektli kart', 'lavanta'),
    gt('ust-serit', 'Üst Şerit', 'Üstte tam genişlik banner', 'gunes'),
    gt('pill-bildirim', 'Pill Bildirim', 'Yuvarlak kompakt bildirim', 'mint'),
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
    gt('sinematik-hero', 'Sinematik Hero', 'Tam genişlik görsel + alt metin şeridi', 'gece', 'Netflix'),
    gt('bento-grid', 'Bento Grid', 'Asimetrik kutu düzeni', 'notr', 'Apple'),
    gt('capraz-split', 'Çapraz Split', 'Diagonal kesimli bölünmüş layout', 'okyanus'),
    gt('dergi-editorial', 'Dergi Editöryal', 'Başlık görsel üzerine taşan düzen', 'mor'),
    gt('timeline-gorsel', 'Timeline + Görsel', 'Sol adım çizgisi, sağ görsel', 'yesil'),
    gt('polaroid-kolaj', 'Polaroid Kolaj', 'Polaroid foto + not kağıdı metin', 'gunes'),
  ],
  BLOG_KARUSEL: [
    gt('snap-serit', 'Snap Şerit', 'Yatay kaydırma, snap odak + oklar', 'notr', 'Medium'),
    gt('hero-mini-grid', 'Hero Mini Grid', 'Sol büyük yazı, sağ 2×2 mini kartlar', 'okyanus'),
    gt('kart-destesi', 'Kart Destesi', 'Üst üste yığılmış hover deste', 'lavanta'),
    gt('sekmeli-kategori', 'Sekmeli Kategori', 'Üst sekme, altta filtrelenmiş kartlar', 'mor'),
    gt('overlay-sinematik', 'Overlay Sinematik', 'Tam genişlik gradient overlay kaydırma', 'gece', 'Netflix'),
    gt('ticker-hero', 'Ticker Hero', 'Üstte kayan başlık şeridi + büyük öne çıkan kart', 'gunes'),
  ],
  LINK_KARTLARI: [
    gt('metro-tile', 'Metro Tile', 'Farklı boyutlu Windows tarzı kutular', 'notr', 'Windows'),
    gt('chip-serit', 'Chip Şeridi', 'Kaydırmalı yuvarlak pill linkler', 'mint'),
    gt('sidebar-nav', 'Sidebar Nav', 'Sol menü + sağ detay paneli', 'okyanus'),
    gt('orbit-ikon', 'Orbit İkon', 'Ortada başlık, etrafında dairesel linkler', 'lavanta'),
    gt('kart-destesi', 'Kart Destesi', 'Üst üste yığılmış, hover ile yayılan kartlar', 'mor'),
    gt('accordion-liste', 'Accordion Liste', 'Tıklanınca açılan link satırları', 'yesil'),
  ],
  GORSEL_GRID_BLOK: [
    gt('bento-grid', 'Bento Grid', 'Asimetrik ızgara + sol bilgi paneli', 'mor', 'Apple'),
    gt('snap-serit', 'Snap Şerit', 'Sol panel + yatay kaydırmalı grid', 'notr'),
    gt('hover-zoom', 'Hover Zoom', 'Zoom + etiket reveal grid', 'lavanta'),
    gt('sekmeli-panel', 'Sekmeli Panel', 'Üst sekmeli filtre + animasyonlu grid', 'okyanus'),
    gt('hero-banner-grid', 'Hero Banner Grid', 'Üstte büyük hero, altta küçük grid', 'gunes'),
    gt('flip-kart', 'Flip Kart', 'Ön görsel, arka açıklama + link', 'mint'),
  ],
  GORSEL_ETIKET_KARTLARI: [
    gt('masonry-galeri', 'Masonry Galeri', 'Pinterest tarzı farklı yükseklikte duvar', 'notr'),
    gt('hero-mini-grid', 'Hero + Mini Grid', 'İlk kategori büyük vitrin kartı', 'gunes'),
    gt('hover-zoom', 'Hover Zoom', 'Hover\'da zoom + etiket reveal', 'mor'),
    gt('polaroid-kolaj', 'Polaroid Kolaj', 'Döndürülmüş polaroid çerçeveler', 'korall'),
    gt('split-panel', 'Split Panel', 'Sol büyük görsel, sağ thumbnail listesi', 'okyanus'),
    gt('flip-kart', 'Flip Kart', 'Ön görsel, arka etiket + link', 'lavanta'),
  ],
  EKIP_KARUSEL: [
    gt('hero-merkez', 'Hero Merkez', 'Büyük öne çıkan üye + mini avatar grid', 'okyanus'),
    gt('kart-destesi', 'Kart Destesi', 'Üst üste yığılmış hover deste', 'lavanta'),
    gt('sekmeli-departman', 'Sekmeli Departman', 'Departman sekmeleri + üye kartları', 'mor'),
    gt('orbit-duzen', 'Orbit Düzen', 'Ortada başlık, etrafında dairesel avatarlar', 'mint'),
    gt('hover-flip', 'Hover Flip', 'Ön foto, arka biyografi + LinkedIn', 'gunes'),
    gt('marquee-spotlight', 'Marquee Spotlight', 'Kayan isim şeridi + büyük profil', 'notr'),
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
    gt('buyuk-alinti-hero', 'Büyük Alıntı Hero', 'Öne çıkan büyük yorum + seçici şerit', 'mor', 'Trustpilot'),
    gt('yatay-serit', 'Yatay Şerit', 'Kaydırmalı yorum kartları', 'mint'),
    gt('konusma-balonu', 'Konuşma Balonu', 'Chat tarzı alternatif balonlar', 'okyanus'),
    gt('split-testimonial', 'Split Testimonial', 'Sol büyük yorum, sağ liste', 'lavanta'),
    gt('kart-destesi', 'Kart Destesi', 'Üst üste yığılmış, hover ile yayılan', 'notr'),
    gt('quote-stil', 'Quote Stil', 'Büyük tırnak tipografisi', 'altin'),
  ],
  FIYATLANDIRMA: [
    gt('sekmeli-toggle', 'Sekmeli Panel', 'Üst sekme, altta büyük paket detayı', 'mor', 'SaaS'),
    gt('karsilastirma-tablo', 'Karşılaştırma Matrisi', 'Özellik satırı × paket sütunu tablosu', 'mint'),
    gt('spotlight-merkez', 'Spotlight Merkez', 'Orta paket büyük, yanlar küçük', 'lavanta'),
    gt('yatay-serit', 'Yatay Şerit', 'Kaydırmalı fiyat kartları', 'okyanus'),
    gt('split-hero', 'Split Hero', 'Sol büyük paket, sağ liste', 'notr'),
    gt('kart-destesi', 'Kart Destesi', 'Üst üste yığılmış hover deste', 'gunes'),
  ],
  MODUL_LOGO_BLOK: [
    gt('cerceveli-split', 'Çerçeveli Split', 'Sol modül metni, sağ logo grid — kart içinde', 'notr', 'SaaS'),
    gt('split-ters', 'Ters Split', 'Sol logo grid, sağ modül içeriği', 'okyanus'),
    gt('ust-alt-grid', 'Üst Alt Grid', 'Üstte açıklama, altta tam genişlik logo ızgarası', 'mint'),
    gt('gradient-kart', 'Gradient Kart', 'Renkli gradient arka planlı modül kartı', 'mor'),
    gt('logo-marquee', 'Logo Marquee', 'Sol içerik, sağda kayan logo şeridi', 'lavanta'),
    gt('bento-modul', 'Bento Modül', 'Asimetrik bento ızgara düzeni', 'gunes'),
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
    gt('surukle-slider', 'Sürükle Slider', 'Kaydırmalı önce/sonra karşılaştırma', 'notr'),
    gt('yan-yana-split', 'Yan Yana Split', 'İki sütun sabit karşılaştırma', 'okyanus'),
    gt('ust-alt-dizilim', 'Üst Alt Dizilim', 'Dikey üst üste görseller', 'lavanta'),
    gt('toggle-gecis', 'Toggle Geçiş', 'Butonla önce/sonra geçişi', 'yesil'),
    gt('tam-genis-band', 'Tam Geniş Band', 'Tam genişlik sürükle slider', 'gece'),
    gt('cerceveli-ikili', 'Çerçeveli İkili', 'Çerçeveli çift panel + slider', 'altin'),
  ],
  BULTEN_KAYIT: [
    gt('ortalanmis-form', 'Ortalanmış Form', 'Ortada abonelik formu', 'notr'),
    gt('tam-banner-mavi', 'Tam Banner Mavi', 'Mavi tam genişlik band', 'okyanus'),
    gt('kart-golge', 'Kart Gölge', 'Gölgeli kart form', 'lavanta'),
    gt('koyu-cam', 'Koyu Cam', 'Koyu glassmorphism form', 'gece'),
    gt('turuncu-serit', 'Turuncu Şerit', 'Turuncu bülten şeridi', 'gunes'),
    gt('yesil-minimal', 'Yeşil Minimal', 'Sade yeşil form', 'yesil'),
  ],
  UCRETSIZ_DENEME: [
    gt('split-form-sol', 'Split Form Sol', 'Sol özellikler + sağ kayıt formu', 'lavanta', 'SaaS'),
    gt('split-form-ters', 'Split Form Ters', 'Sol form + sağ özellikler', 'okyanus'),
    gt('dikey-ortali', 'Dikey Ortalı', 'Üst başlık, orta özellikler, alt form', 'notr'),
    gt('minimal-ortali', 'Minimal Ortalı', 'Sadece başlık ve form', 'mint'),
    gt('blob-arkaplan', 'Blob Arka Plan', 'Dekoratif blob zemin + kart', 'mor'),
    gt('kart-golge', 'Kart Gölge', 'Tek beyaz kart, gölge efektli', 'gunes'),
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
    gt('split-kart-harita', 'Split Kart Harita', 'Sol kartlar, sağ harita', 'okyanus'),
    gt('harita-ust-kart-alt', 'Harita Üst Kart Alt', 'Üstte harita, altta kart grid', 'notr'),
    gt('overlay-yuzen-kart', 'Overlay Yüzen Kart', 'Harita üzerinde yüzen iletişim kartı', 'gece'),
    gt('ikon-serit-harita', 'İkon Şerit Harita', 'İkon şeridi + geniş harita', 'yesil'),
    gt('cam-panel-harita', 'Cam Panel Harita', 'Cam efektli panel + harita', 'lavanta'),
    gt('sidebar-liste-harita', 'Sidebar Liste Harita', 'Dar liste, geniş harita', 'altin'),
  ],
  KATEGORI_HABER_LISTESI: [
    gt('hero-alt-liste', 'Hero Alt Liste', 'Büyük hero + alt liste', 'okyanus'),
    gt('magazin-asimetrik', 'Magazin Asimetrik', 'Asimetrik magazin grid', 'mor'),
    gt('snap-yatay-serit', 'Snap Yatay Şerit', 'Yatay snap kaydırmalı haberler', 'notr'),
    gt('numarali-haber', 'Numaralı Haber', 'Numaralı haber listesi', 'gunes'),
    gt('timeline-tarih', 'Timeline Tarih', 'Tarih çizgili haber akışı', 'mint'),
    gt('karusel-sayfali', 'Karusel Sayfalı', 'Sayfalı haber karuseli', 'lavanta'),
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
    gt('pill-sekmeli', 'Pill Sekmeli', 'Yuvarlak pill sekmeler + hero/liste', 'okyanus'),
    gt('dikey-sekme-panel', 'Dikey Sekme Panel', 'Sol dikey sekmeler, sağ içerik', 'lavanta'),
    gt('grid-kart-sekme', 'Grid Kart Sekme', 'Sekme başına kart grid', 'notr'),
    gt('hero-liste-sekme', 'Hero Liste Sekme', 'Öne çıkan + liste her sekmede', 'gece'),
    gt('chip-ust-filtre', 'Chip Üst Filtre', 'Üst chip filtreler + içerik', 'gunes'),
    gt('accordion-sekme', 'Accordion Sekme', 'Açılır accordion sekme blokları', 'mint'),
  ],
  HAVA_DURUMU: [
    gt('detayli-kart', 'Detaylı Kart', 'Detaylı sıcaklık + tahmin kartı', 'okyanus'),
    gt('kompakt-serit', 'Kompakt Şerit', 'Yatay kompakt özet şerit', 'notr'),
    gt('tam-genis-banner', 'Tam Geniş Banner', 'Tam genişlik hava bandı', 'gece'),
    gt('split-buyuk-tahmin', 'Split Büyük Tahmin', 'Sol büyük sıcaklık, sağ tahmin', 'gunes'),
    gt('cam-hava-kart', 'Cam Hava Kart', 'Cam efektli hava kartı', 'lavanta'),
    gt('ikon-tahmin-grid', 'İkon Tahmin Grid', 'İkon odaklı tahmin grid', 'yesil'),
  ],
  KRIPTO_LISTESI: [
    gt('tablo-detay', 'Tablo Detay', 'Klasik sütunlu fiyat tablosu', 'notr'),
    gt('kart-grid', 'Kart Grid', 'Kart grid düzeni', 'gece'),
    gt('ticker-kaydir', 'Ticker Kaydır', 'Yatay kaydırmalı ticker', 'okyanus'),
    gt('lider-podyum', 'Lider Podyum', 'İlk 3 podyum + liste', 'altin'),
    gt('kompakt-satir', 'Kompakt Satır', 'Sıkışık satır listesi', 'yesil'),
    gt('split-ozet-panel', 'Split Özet Panel', 'Sol özet, sağ coin listesi', 'lavanta'),
  ],
  GUNCEL_KONULAR: [
    gt('hero-alt-liste', 'Hero Alt Liste', 'Büyük hero konu + numaralı liste', 'korall'),
    gt('yan-gorsel-liste', 'Yan Görsel Liste', 'Görselli yan liste', 'notr'),
    gt('chip-konu-filtre', 'Chip Konu Filtre', 'Chip filtreler + konu listesi', 'gunes'),
    gt('timeline-konu', 'Timeline Konu', 'Tarih çizgili konu akışı', 'mint'),
    gt('snap-yatay-kart', 'Snap Yatay Kart', 'Yatay snap kaydırmalı kartlar', 'okyanus'),
    gt('buyuk-numara-dizilim', 'Büyük Numara Dizilim', 'Büyük numara + başlık dizilimi', 'lavanta'),
  ],
  SIRKET_GIRIS_CIKIS: [
    gt('tablo-gunler', 'Tablo Günler', 'Gün bazlı saat tablosu', 'notr'),
    gt('canli-genis-band', 'Canlı Geniş Band', 'Tam genişlik canlı saat bandı', 'okyanus'),
    gt('kart-grid-gun', 'Kart Grid Gün', 'Her gün için ayrı kart', 'lavanta'),
    gt('dikey-timeline-saat', 'Dikey Timeline Saat', 'Dikey zaman çizgisi', 'mint'),
    gt('durum-rozet-panel', 'Durum Rozet Panel', 'Açık/kapalı rozet + saatler', 'yesil'),
    gt('cam-saat-panel', 'Cam Saat Panel', 'Cam efektli saat paneli', 'gece'),
  ],
  HABER_MAGAZIN: [
    gt('asimetrik-grid', 'Asimetrik Grid', 'Asimetrik magazin grid', 'notr'),
    gt('hero-kucuk-grid', 'Hero Küçük Grid', 'Büyük hero + küçük grid', 'mor'),
    gt('overlay-editorial', 'Overlay Editöryal', 'Overlay kartlı editöryal grid', 'gece'),
    gt('iki-sutun-akis', 'İki Sütun Akış', 'İki sütunlu magazin akışı', 'okyanus'),
    gt('snap-yatay-serit', 'Snap Yatay Şerit', 'Yatay snap magazin şeridi', 'gunes'),
    gt('spotlight-liste', 'Spotlight Liste', 'Öne çıkan + alt liste', 'korall'),
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
  HARITA: {
    klasik: 'split-sol-bilgi',
    'tam-genislik': 'kompakt-kart',
    'bol-split': 'split-sol-bilgi',
    'bolunmus-bilgi': 'split-sol-bilgi',
    kart: 'kompakt-kart',
    'kart-golge': 'kompakt-kart',
    'koyu-cerceve': 'kompakt-kart',
    'mint-kart': 'split-sol-bilgi',
    'turuncu-baslik': 'ust-bant-alt',
  },
  KATEGORI: { klasik: 'grid-ikon', pill: 'pill-renkli', 'buyuk-kart': 'buyuk-gorsel' },
  KARSILASTIRMA_TABLOSU: { klasik: 'tam-tablo', kart: 'mobil-kart', minimal: 'minimal-cizgi' },
  BULTEN_KAYIT: { klasik: 'ortalanmis-form', banner: 'tam-banner-mavi', kart: 'kart-golge' },
  UCRETSIZ_DENEME: { klasik: 'split-form-sol' },
  ONCESI_SONRASI: {
    klasik: 'surukle-slider',
    'surukle-karsilastir': 'surukle-slider',
    'yan-yana': 'yan-yana-split',
    'yan-yana-sabit': 'yan-yana-split',
    kart: 'cerceveli-ikili',
    'cerceveli-kart': 'cerceveli-ikili',
    'koyu-etiket': 'tam-genis-band',
    'turuncu-cizgi': 'surukle-slider',
    'yesil-etiket': 'toggle-gecis',
  },
  ZAMAN_CIZELGESI: { dikey: 'dikey-cizgi', yatay: 'yatay-adim', kart: 'kart-zaman' },
  ILETISIM_BLOK: {
    klasik: 'split-kart-harita',
    'kart-harita': 'split-kart-harita',
    'bol-split': 'split-kart-harita',
    'bolunmus-panel': 'split-kart-harita',
    kart: 'sidebar-liste-harita',
    'kompakt-kart': 'harita-ust-kart-alt',
    'koyu-iletisim': 'cam-panel-harita',
    'mor-kart': 'overlay-yuzen-kart',
    'turuncu-baslik': 'ikon-serit-harita',
  },
  HIZMET_KARTLARI: {
    klasik: 'masonry-duvar',
    'klasik-grid': 'masonry-duvar',
    'cam-kart': 'hover-flip',
    'minimal-liste': 'yatay-serit',
    'beyaz-grid': 'hero-mini-grid',
    'cam-yuzey': 'masonry-duvar',
    'koyu-premium': 'hover-flip',
    'yesil-cizgi': 'sekmeli-panel',
    'gradient-kart': 'hero-mini-grid',
    'yatay-liste': 'yatay-serit',
  },
  LINK_KARTLARI: {
    klasik: 'metro-tile',
    'klasik-grid': 'metro-tile',
    'cam-kart': 'chip-serit',
    'minimal-liste': 'accordion-liste',
    'ikon-grid': 'metro-tile',
    'cam-panel': 'chip-serit',
    'dikey-liste': 'sidebar-nav',
    'mor-kare': 'kart-destesi',
    'koyu-ikon': 'orbit-ikon',
    'altin-cizgi': 'accordion-liste',
  },
  SAYAC_BLOK: { klasik: 'buyuk-rakam', kapsul: 'pill-serit', 'cam-kart': 'cam-kartlar' },
  SLIDER: {
    klasik: 'split-ozellik-vitrin',
    sinematik: 'sinematik-acik',
    'kart-golge': 'cam-hero-beyaz',
    kart: 'cam-hero-beyaz',
    'bolunmus-metin': 'split-ozellik-vitrin',
    bolunmus: 'split-ozellik-vitrin',
    'minimal-cizgi': 'badge-modern',
    minimal: 'badge-modern',
    'gradient-hero': 'gradient-split',
    'kenar-cerceve': 'orbit-merkez',
  },
  GALERI: {
    'klasik-grid': 'hover-zoom-etiket',
    'esit-grid': 'hover-zoom-etiket',
    'masonry-mor': 'hero-vitrin',
    'lightbox-koyu': 'lightbox-odak',
    'cerceveli-altin': 'hover-zoom-etiket',
    'yesil-hover': 'hover-zoom-etiket',
    'genis-serit': 'snap-yatay-serit',
  },
  GORSEL_GRID_BLOK: {
    klasik: 'bento-grid',
    'sol-panel': 'bento-grid',
    'tam-grid-mavi': 'hover-zoom',
    'hero-kart': 'hero-banner-grid',
    'koyu-overlay': 'hover-zoom',
    'yesil-filtre': 'sekmeli-panel',
    'turuncu-vurgu': 'flip-kart',
  },
  GORSEL_ETIKET_KARTLARI: {
    klasik: 'masonry-galeri',
    'klasik-grid': 'masonry-galeri',
    overlay: 'hover-zoom',
    minimal: 'hero-mini-grid',
    'alt-etiket': 'masonry-galeri',
    'ust-overlay': 'hover-zoom',
    'mor-cerceve': 'flip-kart',
    'mint-kucuk': 'hero-mini-grid',
    'okyanus-buyuk': 'split-panel',
    'korall-hover': 'polaroid-kolaj',
  },
  BLOK_OLUSTURUCU: { klasik: 'standart-grid', 'cam-kart': 'cam-parca', minimal: 'sade-duzen' },
  KATEGORI_HABER_LISTESI: {
    klasik: 'hero-alt-liste',
    'yatay-liste': 'numarali-haber',
    'buyuk-onizleme': 'hero-alt-liste',
    'hero-liste': 'hero-alt-liste',
    minimal: 'timeline-tarih',
    'kompakt-satir': 'timeline-tarih',
    'koyu-kart': 'magazin-asimetrik',
    'turuncu-kategori': 'snap-yatay-serit',
    'mor-overlay': 'karusel-sayfali',
  },
  KATEGORI_HABER_OVERLAY: { klasik: 'overlay-grid', 'buyuk-onizleme': 'hero-grid', minimal: 'kucuk-grid' },
  VIDEO_GALERISI: { klasik: 'kapak-grid', 'buyuk-onizleme': 'hero-video', liste: 'dikey-liste' },
  SEKMELI_HABER: {
    klasik: 'hero-liste-sekme',
    'alt-cizgi-sekme': 'hero-liste-sekme',
    'pill-sekme': 'pill-sekmeli',
    minimal: 'chip-ust-filtre',
    'sade-sekme': 'dikey-sekme-panel',
    'koyu-panel': 'grid-kart-sekme',
    'turuncu-aktif': 'chip-ust-filtre',
    'mor-vurgu': 'pill-sekmeli',
  },
  HAVA_DURUMU: {
    klasik: 'detayli-kart',
    'detayli-panel': 'detayli-kart',
    kompakt: 'kompakt-serit',
    'kompakt-ozet': 'kompakt-serit',
    banner: 'tam-genis-banner',
    'tam-banner': 'tam-genis-banner',
    'turuncu-gunes': 'split-buyuk-tahmin',
    'yesil-tahmin': 'ikon-tahmin-grid',
    'mor-gece': 'cam-hava-kart',
  },
  KRIPTO_LISTESI: {
    klasik: 'tablo-detay',
    'fiyat-tablosu': 'tablo-detay',
    kart: 'kart-grid',
    'kart-liste': 'kart-grid',
    minimal: 'ticker-kaydir',
    'ticker-serit': 'ticker-kaydir',
    'yesil-artis': 'kompakt-satir',
    'mor-koyu': 'kart-grid',
    'altin-premium': 'lider-podyum',
  },
  GUNCEL_KONULAR: {
    klasik: 'buyuk-numara-dizilim',
    'numarali-liste': 'buyuk-numara-dizilim',
    'buyuk-onizleme': 'hero-alt-liste',
    'hero-konu': 'hero-alt-liste',
    minimal: 'yan-gorsel-liste',
    'kompakt-liste': 'yan-gorsel-liste',
    'koyu-numara': 'buyuk-numara-dizilim',
    'okyanus-vurgu': 'timeline-konu',
    'turuncu-baslik': 'chip-konu-filtre',
  },
  SIRKET_GIRIS_CIKIS: {
    klasik: 'tablo-gunler',
    'saat-tablosu': 'tablo-gunler',
    banner: 'canli-genis-band',
    'canli-banner': 'canli-genis-band',
    kart: 'kart-grid-gun',
    'bilgi-kart': 'durum-rozet-panel',
    'koyu-saat': 'cam-saat-panel',
    'yesil-acik': 'durum-rozet-panel',
    'turuncu-uyari': 'canli-genis-band',
  },
  HABER_MAGAZIN: {
    klasik: 'asimetrik-grid',
    'magazin-grid': 'asimetrik-grid',
    'buyuk-onizleme': 'hero-kucuk-grid',
    'hero-magazin': 'hero-kucuk-grid',
    minimal: 'iki-sutun-akis',
    'kompakt-magazin': 'iki-sutun-akis',
    'koyu-editor': 'overlay-editorial',
    'turuncu-spot': 'spotlight-liste',
    'okyanus-kategori': 'snap-yatay-serit',
  },
  FIYATLANDIRMA: {
    klasik: 'sekmeli-toggle',
    'vurgulu-orta': 'spotlight-merkez',
    minimal: 'karsilastirma-tablo',
    'uc-kolon': 'sekmeli-toggle',
    'orta-vurgu': 'spotlight-merkez',
    'tablo-sade': 'karsilastirma-tablo',
    'koyu-premium': 'split-hero',
    'turuncu-populer': 'spotlight-merkez',
    'yesil-ekonomik': 'yatay-serit',
  },
  YORUM_KARUSEL: { klasik: 'kart-karusel', 'buyuk-alinti': 'tek-alinti', minimal: 'kompakt-yildiz' },
  YORUM_KARTLARI: {
    klasik: 'buyuk-alinti-hero',
    kart: 'quote-stil',
    minimal: 'konusma-balonu',
    'grid-beyaz': 'kart-destesi',
    'yildiz-vurgu': 'quote-stil',
    'koyu-kart': 'buyuk-alinti-hero',
    'mor-cerceve': 'split-testimonial',
    'okyanus-liste': 'yatay-serit',
    'yesil-minimal': 'konusma-balonu',
  },
  EKIP_KARUSEL: {
    klasik: 'hero-merkez',
    'yuvarlak-foto': 'hero-merkez',
    kart: 'hover-flip',
    'kare-kart': 'hover-flip',
    minimal: 'marquee-spotlight',
    'sade-isim': 'marquee-spotlight',
    'koyu-profil': 'orbit-duzen',
    'mor-unvan': 'sekmeli-departman',
    'turuncu-cerceve': 'kart-destesi',
  },
  BLOG_KARUSEL: {
    klasik: 'snap-serit',
    'yatay-kart': 'snap-serit',
    'buyuk-kart': 'hero-mini-grid',
    'buyuk-onizleme': 'hero-mini-grid',
    minimal: 'ticker-hero',
    'kompakt-liste': 'sekmeli-kategori',
    'koyu-kart': 'overlay-sinematik',
    'turuncu-vurgu': 'kart-destesi',
    'yesil-minimal': 'ticker-hero',
  },
  SSS: {
    klasik: 'tek-acik-odak',
    'accordion-beyaz': 'tek-acik-odak',
    'iki-kolon': 'iki-kolon-grid',
    'iki-kolon-mavi': 'iki-kolon-grid',
    kart: 'kart-destesi',
    'kart-golgeli': 'kart-destesi',
    'koyu-panel': 'tek-acik-odak',
    'turuncu-vurgu': 'kart-destesi',
    'cizgili-sade': 'yan-menu-icerik',
  },
  BASLIK_METIN: { klasik: 'duz-paragraf', 'vurgu-cizgi': 'sol-cizgi', 'buyuk-baslik': 'hero-buyuk' },
  BASLIK_METIN_GORSEL: {
    klasik: 'sinematik-hero',
    'yan-yana': 'bento-grid',
    'overlay-koyu': 'sinematik-hero',
    'kart-mor': 'dergi-editorial',
    'gradient-arkaplan': 'sinematik-hero',
    'mint-cerceve': 'polaroid-kolaj',
    'okyanus-split': 'capraz-split',
  },
  POPUP: {
    klasik: 'ortada-modal',
    'slide-alt': 'alt-kaydirma',
    kose: 'sag-kose',
    'mor-kart': 'cam-kart',
    'turuncu-uyari': 'ust-serit',
    'mint-minimal': 'pill-bildirim',
  },
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
