import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { uid } from '@/types/widget';

function metin(mevcut: string | null | undefined, ornek: string): string {
  return mevcut?.trim() ? mevcut : ornek;
}

function dizi<T>(mevcut: T[] | undefined, ornek: T[]): T[] {
  return mevcut && mevcut.length > 0 ? mevcut : ornek;
}

const ONIZLEME_GORSEL = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop';

function mockConfig(tip: string): WidgetConfig {
  const id = () => uid();

  switch (tip) {
    case 'SLIDER':
      return {
        slides: [
          {
            id: id(),
            gorselUrl: '',
            baslik: 'Teknolojinin En Güzel Hali',
            altBaslik: 'Güzel Teknoloji',
            butonMetni: 'Keşfet',
            butonLink: '/urunler',
            aktif: true,
          },
          {
            id: id(),
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Yenilikçi Çözümler',
            altBaslik: 'Kurumsal',
            butonMetni: 'İletişim',
            butonLink: '/iletisim',
            aktif: true,
          },
        ],
      };
    case 'HIZMET_KARTLARI':
      return {
        kartlar: [
          { id: id(), baslik: 'Web Tasarım', aciklama: 'Modern ve mobil uyumlu web siteleri.', ikon: '🌐', link: '#', butonMetni: 'Detayları Gör' },
          { id: id(), baslik: 'Yazılım Geliştirme', aciklama: 'İhtiyacınıza özel yazılım çözümleri.', ikon: '💻', link: '#', butonMetni: 'Detayları Gör' },
          { id: id(), baslik: 'Teknik Destek', aciklama: '7/24 uzman destek ekibi.', ikon: '🎧', link: '#', butonMetni: 'Detayları Gör' },
        ],
      };
    case 'BASLIK_METIN':
      return { metin: 'Bu alan örnek metin içeriğidir. Widget düzenleyicide kendi metninizi yazabilirsiniz.\n\nParagraflar ve satır araları desteklenir.' };
    case 'BASLIK_METIN_GORSEL':
      return {
        metin: 'Şirketimiz hakkında kısa ve etkileyici bir tanıtım metni burada yer alır.',
        ikonKartlar: [
          { id: id(), ikon: '🛡️', metin: 'Güvenilir hizmet' },
          { id: id(), ikon: '⚡', metin: 'Hızlı teslimat' },
          { id: id(), ikon: '🎯', metin: 'Müşteri odaklı' },
        ],
      };
    case 'BLOG_KARUSEL':
      return {
        blogKartlari: [
          { id: id(), baslik: 'Yeni Ürün Lansmanı', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku' },
          { id: id(), baslik: 'Sektör Trendleri 2026', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku' },
          { id: id(), baslik: 'Müşteri Başarı Hikayesi', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku' },
        ],
        tumunuGorMetin: 'Tümünü Gör',
        tumunuGorLink: '/blog',
      };
    case 'LINK_KARTLARI':
      return {
        linkler: [
          { id: id(), metin: 'Ürünler', ikon: '📦', link: '/urunler' },
          { id: id(), metin: 'Hakkımızda', ikon: '🏢', link: '/hakkimizda' },
          { id: id(), metin: 'İletişim', ikon: '📞', link: '/iletisim' },
          { id: id(), metin: 'Blog', ikon: '📰', link: '/blog' },
        ],
      };
    case 'GORSEL_GRID_BLOK':
      return {
        solBaslik: 'Hizmetlerimiz',
        solAciklama: 'Geniş ürün yelpazemizle ihtiyacınıza uygun çözümler sunuyoruz.',
        filtreler: ['Tümü', 'Yazılım', 'Donanım'],
        gridKartlar: [
          { id: id(), etiket: 'Bulut Çözümleri', gorselUrl: ONIZLEME_GORSEL, link: '#', filtreEtiketi: 'Yazılım' },
          { id: id(), etiket: 'Ağ Altyapısı', gorselUrl: ONIZLEME_GORSEL, link: '#', filtreEtiketi: 'Donanım' },
          { id: id(), etiket: 'Güvenlik', gorselUrl: ONIZLEME_GORSEL, link: '#', filtreEtiketi: 'Yazılım' },
          { id: id(), etiket: 'Danışmanlık', gorselUrl: ONIZLEME_GORSEL, link: '#' },
        ],
      };
    case 'GORSEL_ETIKET_KARTLARI':
      return {
        etiketKartlar: [
          { id: id(), etiket: 'Laptop', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'Monitör', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'Aksesuar', gorselUrl: ONIZLEME_GORSEL, link: '#' },
        ],
      };
    case 'EKIP_KARUSEL':
      return {
        uyeler: [
          { id: id(), ad: 'Ayşe Yılmaz', unvan: 'Genel Müdür', gorselUrl: ONIZLEME_GORSEL, aciklama: '15 yıllık sektör deneyimi' },
          { id: id(), ad: 'Mehmet Kaya', unvan: 'Yazılım Lideri', gorselUrl: ONIZLEME_GORSEL },
          { id: id(), ad: 'Zeynep Demir', unvan: 'Tasarım Uzmanı', gorselUrl: ONIZLEME_GORSEL },
        ],
        otomatikKaydir: true,
      };
    case 'SAYAC_BLOK':
      return {
        sayaclar: [
          { id: id(), deger: 500, sonEk: '+', etiket: 'Mutlu Müşteri' },
          { id: id(), deger: 1200, sonEk: '', etiket: 'Tamamlanan Proje' },
          { id: id(), deger: 15, sonEk: '', etiket: 'Yıllık Deneyim' },
          { id: id(), deger: 98, sonEk: '%', etiket: 'Memnuniyet' },
        ],
      };
    case 'YORUM_KARUSEL':
      return {
        yorumlar: [
          { id: id(), metin: 'Harika bir ekip, projemizi zamanında ve kaliteli teslim ettiler.', ad: 'Ali Veli', firma: 'ABC Ltd.' },
          { id: id(), metin: 'Profesyonel yaklaşım ve sürekli destek için teşekkürler.', ad: 'Fatma Şahin', firma: 'XYZ A.Ş.' },
        ],
        otomatikKaydir: true,
      };
    case 'FIYATLANDIRMA':
      return {
        paketler: [
          {
            id: id(),
            ad: 'Başlangıç',
            fiyat: '₺999',
            aciklama: 'Küçük işletmeler için',
            ozellikler: [{ metin: '5 sayfa', dahil: true }, { metin: 'E-posta desteği', dahil: true }],
            butonMetni: 'Seç',
            butonLink: '#',
            oneCikan: false,
          },
          {
            id: id(),
            ad: 'Profesyonel',
            fiyat: '₺2.499',
            aciklama: 'Büyüyen ekipler için',
            ozellikler: [{ metin: 'Sınırsız sayfa', dahil: true }, { metin: 'Öncelikli destek', dahil: true }],
            butonMetni: 'Seç',
            butonLink: '#',
            oneCikan: true,
          },
        ],
      };
    case 'GALERI':
      return {
        galeri: [
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 1', link: '#' },
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 2', link: '#' },
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 3', link: '#' },
        ],
        galeriDuzeni: 'grid',
      };
    case 'SSS':
      return {
        sorular: [
          { id: id(), soru: 'Teslimat süresi ne kadar?', cevap: 'Proje kapsamına göre 1-4 hafta arasında değişmektedir.' },
          { id: id(), soru: 'Destek hizmeti var mı?', cevap: 'Evet, tüm paketlerimizde e-posta ve telefon desteği sunuyoruz.' },
        ],
      };
    case 'REFERANSLAR':
      return { referanslar: ['Acme Corp', 'TechStart', 'GlobalSoft', 'InnovateLab', 'DataFlow'] };
    case 'KATEGORI':
      return {
        kategoriler: [
          { id: id(), metin: 'Yazılım', ikon: '💻', link: '#' },
          { id: id(), metin: 'Donanım', ikon: '🖥️', link: '#' },
          { id: id(), metin: 'Ağ', ikon: '🌐', link: '#' },
        ],
      };
    case 'HARITA':
      return { haritaLat: '41.0082', haritaLng: '28.9784', haritaZoom: 14 };
    case 'ILETISIM_FORMU':
      return {};
    case 'POPUP':
      return { popupGecikme: 0, popupTetikleyici: 'sayfa_yukle' };
    default:
      return {};
  }
}

function configBirlestir(mevcut: WidgetConfig, mock: WidgetConfig): WidgetConfig {
  const sonuc: WidgetConfig = { ...mevcut };

  if (!sonuc.metin?.trim() && mock.metin) sonuc.metin = mock.metin;
  if (!sonuc.solBaslik?.trim() && mock.solBaslik) sonuc.solBaslik = mock.solBaslik;
  if (!sonuc.solAciklama?.trim() && mock.solAciklama) sonuc.solAciklama = mock.solAciklama;
  if (!sonuc.haritaLat && mock.haritaLat) sonuc.haritaLat = mock.haritaLat;
  if (!sonuc.haritaLng && mock.haritaLng) sonuc.haritaLng = mock.haritaLng;
  if (!sonuc.haritaUrl && mock.haritaUrl) sonuc.haritaUrl = mock.haritaUrl;
  if (sonuc.haritaZoom == null && mock.haritaZoom != null) sonuc.haritaZoom = mock.haritaZoom;

  sonuc.slides = dizi(sonuc.slides, mock.slides ?? []);
  sonuc.kartlar = dizi(sonuc.kartlar, mock.kartlar ?? []);
  sonuc.galeri = dizi(sonuc.galeri, mock.galeri ?? []);
  sonuc.sorular = dizi(sonuc.sorular, mock.sorular ?? []);
  sonuc.referanslar = dizi(sonuc.referanslar, mock.referanslar ?? []);
  sonuc.linkler = dizi(sonuc.linkler, mock.linkler ?? []);
  sonuc.blogKartlari = dizi(sonuc.blogKartlari, mock.blogKartlari ?? []);
  sonuc.gridKartlar = dizi(sonuc.gridKartlar, mock.gridKartlar ?? []);
  sonuc.etiketKartlar = dizi(sonuc.etiketKartlar, mock.etiketKartlar ?? []);
  sonuc.uyeler = dizi(sonuc.uyeler, mock.uyeler ?? []);
  sonuc.sayaclar = dizi(sonuc.sayaclar, mock.sayaclar ?? []);
  sonuc.yorumlar = dizi(sonuc.yorumlar, mock.yorumlar ?? []);
  sonuc.paketler = dizi(sonuc.paketler, mock.paketler ?? []);
  sonuc.ikonKartlar = dizi(sonuc.ikonKartlar, mock.ikonKartlar ?? []);
  sonuc.kategoriler = dizi(sonuc.kategoriler, mock.kategoriler ?? []);
  sonuc.filtreler = dizi(sonuc.filtreler, mock.filtreler ?? []);

  if (!sonuc.tumunuGorMetin && mock.tumunuGorMetin) sonuc.tumunuGorMetin = mock.tumunuGorMetin;
  if (!sonuc.tumunuGorLink && mock.tumunuGorLink) sonuc.tumunuGorLink = mock.tumunuGorLink;

  return sonuc;
}

/** Önizleme için boş alanları örnek verilerle doldurur — kayıtlı içeriğe dokunmaz */
export function onizlemeMockVerisiUygula(widget: Widget): Widget {
  const cfg = (widget.configJson ?? {}) as WidgetConfig;
  const mock = mockConfig(widget.tip);
  const birlesik = configBirlestir(cfg, mock);

  return {
    ...widget,
    ad: metin(widget.ad, 'Örnek Widget'),
    baslik: metin(widget.baslik, mockBaslik(widget.tip)),
    altBaslik: metin(widget.altBaslik, 'Güzel Teknoloji'),
    aciklama: metin(
      widget.aciklama,
      widget.tip === 'ILETISIM_FORMU'
        ? 'Sorularınız için bize ulaşın, en kısa sürede dönüş yapalım.'
        : 'Bu bölüm önizleme amaçlı örnek içerik göstermektedir.'
    ),
    gorselUrl: widget.gorselUrl?.trim() ? widget.gorselUrl : (widget.tip === 'BASLIK_METIN_GORSEL' ? ONIZLEME_GORSEL : widget.gorselUrl),
    butonMetni: metin(widget.butonMetni, 'Daha Fazla'),
    butonLink: metin(widget.butonLink, '/iletisim'),
    configJson: birlesik as Record<string, unknown>,
  };
}

function mockBaslik(tip: string): string {
  const basliklar: Record<string, string> = {
    SLIDER: 'Hoş Geldiniz',
    HIZMET_KARTLARI: 'Hizmetlerimiz',
    BASLIK_METIN: 'Hakkımızda',
    BASLIK_METIN_GORSEL: 'Neden Biz?',
    BLOG_KARUSEL: 'Son Yazılar',
    LINK_KARTLARI: 'Hızlı Erişim',
    GORSEL_GRID_BLOK: 'Çözümlerimiz',
    GORSEL_ETIKET_KARTLARI: 'Kategoriler',
    EKIP_KARUSEL: 'Ekibimiz',
    SAYAC_BLOK: 'Rakamlarla Biz',
    YORUM_KARUSEL: 'Müşteri Yorumları',
    FIYATLANDIRMA: 'Paketlerimiz',
    GALERI: 'Galeri',
    SSS: 'Sık Sorulan Sorular',
    REFERANSLAR: 'Referanslarımız',
    KATEGORI: 'Kategoriler',
    HARITA: 'Konumumuz',
    ILETISIM_FORMU: 'İletişime Geçin',
    POPUP: 'Özel Teklif',
  };
  return basliklar[tip] ?? 'Örnek Başlık';
}
