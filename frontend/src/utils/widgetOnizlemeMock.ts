import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import type { WidgetFormDegeri } from '@/types/admin';
import type { WidgetAcilisKapanisSaati } from '@/types/haberWidget';
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
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Düşük internet hızına ayıplı hizmet kararı',
            altBaslik: 'SON GÜN BUGÜN',
            butonMetni: 'Devamını Oku',
            butonLink: '/haber/1',
            aktif: true,
          },
          {
            id: id(),
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Teknoloji sektöründe yeni dönem',
            altBaslik: 'GÜNDEM',
            butonMetni: 'Devamını Oku',
            butonLink: '/haber/2',
            aktif: true,
          },
          {
            id: id(),
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Ekonomide son gelişmeler',
            altBaslik: 'EKONOMİ',
            butonMetni: 'Devamını Oku',
            butonLink: '/haber/3',
            aktif: true,
          },
          {
            id: id(),
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Spor dünyasından manşetler',
            altBaslik: 'SPOR',
            butonMetni: 'Devamını Oku',
            butonLink: '/haber/4',
            aktif: true,
          },
          {
            id: id(),
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Sağlık alanında önemli buluş',
            altBaslik: 'SAĞLIK',
            butonMetni: 'Devamını Oku',
            butonLink: '/haber/5',
            aktif: true,
          },
          {
            id: id(),
            gorselUrl: ONIZLEME_GORSEL,
            baslik: 'Eğitimde dijital dönüşüm',
            altBaslik: 'EĞİTİM',
            butonMetni: 'Devamını Oku',
            butonLink: '/haber/6',
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
          { id: id(), baslik: 'Yeni Ürün Lansmanı', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku', kategori: 'Teknoloji', ozet: 'Yeni nesil ürünümüz piyasaya çıktı.' },
          { id: id(), baslik: 'Sektör Trendleri 2026', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku', kategori: 'Analiz', ozet: '2026 yılında öne çıkan teknoloji trendleri.' },
          { id: id(), baslik: 'Müşteri Başarı Hikayesi', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku', kategori: 'Teknoloji', ozet: 'Kurumsal müşterimizin dijital dönüşüm yolculuğu.' },
          { id: id(), baslik: 'E-Ticaret Rehberi', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku', kategori: 'Rehber', ozet: 'Online satışa başlamak için adım adım kılavuz.' },
          { id: id(), baslik: 'Güvenlik İpuçları', gorselUrl: ONIZLEME_GORSEL, link: '#', butonMetni: 'Daha Fazla Oku', kategori: 'Analiz', ozet: 'Siber güvenlik için temel öneriler.' },
        ],
        filtreler: ['Teknoloji', 'Analiz', 'Rehber'],
        tumunuGorMetin: 'Tümünü Gör',
        tumunuGorLink: '/blog',
      };
    case 'LINK_KARTLARI':
      return {
        linkler: [
          { id: id(), metin: 'Blog', ikon: '📰', link: '/blog' },
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
          { id: id(), ad: 'Ayşe Yılmaz', unvan: 'Genel Müdür', departman: 'Yönetim', gorselUrl: ONIZLEME_GORSEL, aciklama: '15 yıllık sektör deneyimi', linkedin: '#' },
          { id: id(), ad: 'Mehmet Kaya', unvan: 'Yazılım Lideri', departman: 'Teknik', gorselUrl: ONIZLEME_GORSEL, aciklama: 'Full-stack ve bulut mimarisi uzmanı' },
          { id: id(), ad: 'Zeynep Demir', unvan: 'Tasarım Uzmanı', departman: 'Tasarım', gorselUrl: ONIZLEME_GORSEL },
          { id: id(), ad: 'Can Öztürk', unvan: 'Satış Müdürü', departman: 'Satış', gorselUrl: ONIZLEME_GORSEL },
          { id: id(), ad: 'Elif Arslan', unvan: 'UX Araştırmacı', departman: 'Tasarım', gorselUrl: ONIZLEME_GORSEL },
        ],
        filtreler: ['Yönetim', 'Teknik', 'Tasarım', 'Satış'],
        otomatikKaydir: true,
      };
    case 'SAYAC_BLOK':
      return {
        sayaclar: [
          { id: id(), deger: 500, sonEk: '+', etiket: 'Mutlu Müşteri', ikon: '⚡' },
          { id: id(), deger: 1200, sonEk: '', etiket: 'Tamamlanan Proje', ikon: '🔌' },
          { id: id(), deger: 15, sonEk: '', etiket: 'Yıllık Deneyim', ikon: '💳' },
          { id: id(), deger: 98, sonEk: '%', etiket: 'Memnuniyet', ikon: '🎨' },
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
    case 'YORUM_KARTLARI':
      return {
        yorumlar: [
          {
            id: id(),
            metin: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            ad: 'Hayrettin Elalmış',
            firma: 'Seda Makina',
            yildiz: 5,
            gorselUrl: ONIZLEME_GORSEL,
          },
          {
            id: id(),
            metin: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            ad: 'Hüseyin Fidan',
            firma: 'Fidan Danışmanlık',
            yildiz: 5,
            gorselUrl: ONIZLEME_GORSEL,
          },
          {
            id: id(),
            metin: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            ad: 'Selma Güroğlu',
            firma: 'Hakimiyet Hukuk Bürosu',
            yildiz: 4,
            gorselUrl: ONIZLEME_GORSEL,
          },
        ],
      };
    case 'FIYATLANDIRMA':
      return {
        paketler: [
          {
            id: id(),
            ad: 'Başlangıç',
            fiyat: '₺999',
            aciklama: 'Küçük işletmeler için',
            ozellikler: [
              { metin: '5 sayfa', dahil: true },
              { metin: 'E-posta desteği', dahil: true },
              { metin: 'API erişimi', dahil: false },
            ],
            butonMetni: 'Seç',
            butonLink: '#',
            oneCikan: false,
          },
          {
            id: id(),
            ad: 'Profesyonel',
            fiyat: '₺2.499',
            aciklama: 'Büyüyen ekipler için',
            ozellikler: [
              { metin: 'Sınırsız sayfa', dahil: true },
              { metin: 'Öncelikli destek', dahil: true },
              { metin: 'API erişimi', dahil: true },
            ],
            butonMetni: 'Seç',
            butonLink: '#',
            oneCikan: true,
          },
          {
            id: id(),
            ad: 'Kurumsal',
            fiyat: '₺4.999',
            aciklama: 'Büyük organizasyonlar',
            ozellikler: [
              { metin: 'Özel entegrasyon', dahil: true },
              { metin: '7/24 destek', dahil: true },
              { metin: 'SLA garantisi', dahil: true },
            ],
            butonMetni: 'İletişime Geç',
            butonLink: '#',
            oneCikan: false,
          },
        ],
      };
    case 'MODUL_LOGO_BLOK':
      return {
        modulIkon: '💳',
        dahaFazlaMetin: '+ Daha Fazlası',
        dahaFazlaLink: '#',
        ikonKartlar: [
          { id: id(), ikon: '✓', metin: 'Tüm bankalarla entegrasyon' },
          { id: id(), ikon: '✓', metin: 'Sanal POS ve taksit desteği' },
          { id: id(), ikon: '✓', metin: 'Güvenli ödeme altyapısı' },
        ],
        logoKartlar: [
          { id: id(), etiket: 'PayTR', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'iyzico', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'Tosla', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'Ziraat', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'İş Bankası', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'ING', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), etiket: 'VakıfBank', gorselUrl: ONIZLEME_GORSEL, link: '#' },
        ],
      };
    case 'GALERI':
      return {
        galeri: [
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 1', link: '#', kategori: 'Ofis' },
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 2', link: '#', kategori: 'Etkinlik' },
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 3', link: '#', kategori: 'Ofis' },
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 4', link: '#', kategori: 'Etkinlik' },
          { id: id(), gorselUrl: ONIZLEME_GORSEL, baslik: 'Proje 5', link: '#', kategori: 'Ofis' },
        ],
        filtreler: ['Tümü', 'Ofis', 'Etkinlik'],
      };
    case 'SSS':
      return {
        sorular: [
          { id: id(), soru: 'Teslimat süresi ne kadar?', cevap: 'Proje kapsamına göre 1-4 hafta arasında değişmektedir.', kategori: 'Sipariş' },
          { id: id(), soru: 'Destek hizmeti var mı?', cevap: 'Evet, tüm paketlerimizde e-posta ve telefon desteği sunuyoruz.', kategori: 'Destek' },
          { id: id(), soru: 'İade politikanız nedir?', cevap: '14 gün içinde koşulsuz iade hakkınız bulunmaktadır.', kategori: 'Sipariş' },
          { id: id(), soru: 'Kurulum ücretsiz mi?', cevap: 'Temel kurulum tüm paketlerde ücretsizdir.', kategori: 'Destek' },
        ],
        filtreler: ['Tümü', 'Sipariş', 'Destek'],
        solBaslik: 'Konu seçin',
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
      return {
        haritaLat: '41.0082',
        haritaLng: '28.9784',
        haritaZoom: 14,
        ikonKartlar: [
          { id: id(), ikon: '📍', metin: 'Maslak Mah. Büyükdere Cad. No:1 İstanbul' },
          { id: id(), ikon: '📞', metin: '+90 212 000 00 00' },
          { id: id(), ikon: '🕐', metin: 'Pzt–Cum 09:00–18:00' },
        ],
        haritaSubeler: [
          { id: id(), ad: 'İstanbul', haritaLat: '41.0082', haritaLng: '28.9784', haritaZoom: 14 },
          { id: id(), ad: 'Ankara', haritaLat: '39.9334', haritaLng: '32.8597', haritaZoom: 14 },
          { id: id(), ad: 'İzmir', haritaLat: '38.4237', haritaLng: '27.1428', haritaZoom: 14 },
        ],
      };
    case 'ILETISIM_FORMU':
      return {};
    case 'POPUP':
      return { popupGecikme: 0, popupTetikleyici: 'sayfa_yukle' };
    case 'ZAMAN_CIZELGESI':
      return {
        timeline: [
          { id: id(), tarih: '2015', baslik: 'Kuruluş', aciklama: 'Güzel Teknoloji faaliyete başladı.' },
          { id: id(), tarih: '2019', baslik: 'Büyüme', aciklama: '100+ kurumsal müşteriye ulaştık.' },
          { id: id(), tarih: '2024', baslik: 'Yeni Dönem', aciklama: 'Bulut ve yapay zeka çözümleri portföyü genişledi.' },
        ],
      };
    case 'SUREC_ADIMLARI':
      return {
        surecAdimlari: [
          { id: id(), baslik: 'Analiz', aciklama: 'İhtiyaçlarınızı dinliyoruz.', ikon: '🔍' },
          { id: id(), baslik: 'Tasarım', aciklama: 'Size özel çözüm planlıyoruz.', ikon: '✏️' },
          { id: id(), baslik: 'Geliştirme', aciklama: 'Uzman ekibimiz hayata geçiriyor.', ikon: '⚙️' },
          { id: id(), baslik: 'Teslimat', aciklama: 'Destek ile birlikte teslim ediyoruz.', ikon: '🚀' },
        ],
      };
    case 'MARKA_SERIDI':
      return {
        markaHizi: 'normal',
        markalar: [
          { id: id(), ad: 'TechCorp', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), ad: 'DataFlow', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), ad: 'CloudNet', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), ad: 'InnoLab', gorselUrl: ONIZLEME_GORSEL, link: '#' },
          { id: id(), ad: 'SmartSys', gorselUrl: ONIZLEME_GORSEL, link: '#' },
        ],
      };
    case 'KARSILASTIRMA_TABLOSU':
      return {
        karsilastirmaPaketler: [
          { id: id(), ad: 'Temel', fiyat: '₺499', oneCikan: false },
          { id: id(), ad: 'Pro', fiyat: '₺999', oneCikan: true },
          { id: id(), ad: 'Kurumsal', fiyat: '₺1.999', oneCikan: false },
        ],
        karsilastirmaSatirlari: [
          { id: id(), ozellik: 'Kullanıcı sayısı', hucreler: ['5', '25', 'Sınırsız'] },
          { id: id(), ozellik: 'Destek', hucreler: ['E-posta', 'Öncelikli', '7/24'] },
          { id: id(), ozellik: 'API erişimi', hucreler: ['✗', '✓', '✓'] },
        ],
      };
    case 'GERI_SAYIM':
      return { bitisTarihi: new Date(Date.now() + 7 * 86400000).toISOString() };
    case 'VIDEO_BANNER':
      return { videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoTip: 'youtube' };
    case 'ONCESI_SONRASI':
      return { onceGorsel: ONIZLEME_GORSEL, sonraGorsel: ONIZLEME_GORSEL };
    case 'BULTEN_KAYIT':
      return { formSlug: 'bulten', bultenPlaceholder: 'E-posta adresiniz', bultenKvkk: 'Abone olarak gizlilik politikasını kabul etmiş olursunuz.' };
    case 'UCRETSIZ_DENEME':
      return {
        formSlug: 'ucretsiz-deneme',
        bultenKvkk: 'Kişisel verileriniz gizlilik politikamız kapsamında korunmaktadır.',
        rolSecenekleri: ['Kurucu / Sahip', 'Pazarlama', 'Satış', 'IT / Teknik', 'Diğer'],
        ikonKartlar: [
          { id: id(), ikon: '🎧', metin: '7/24 teknik destek' },
          { id: id(), ikon: '📚', metin: 'Ücretsiz ve sınırsız eğitim' },
          { id: id(), ikon: '👔', metin: 'VIP e-ticaret danışmanı' },
          { id: id(), ikon: '📦', metin: 'Ücretsiz kargo entegrasyonu' },
          { id: id(), ikon: '💳', metin: 'Ücretsiz sanal POS' },
          { id: id(), ikon: '🔄', metin: 'Ücretsiz güncellemeler' },
        ],
      };
    case 'KOSE_YAZARLARI':
      return {
        koseYazarlari: [
          { id: id(), yazarAd: 'Ertan Yılmazlar', yazarGorsel: ONIZLEME_GORSEL, tarih: '10.05.2026', baslik: 'Ekonomide yeni dönem', ozet: 'Bu alana yazınızla ilgili kısa bir özet ekleyebilirsiniz.', link: '#' },
          { id: id(), yazarAd: 'Ayşe Demir', yazarGorsel: ONIZLEME_GORSEL, tarih: '09.05.2026', baslik: 'Teknoloji ve toplum', ozet: 'Bu alana yazınızla ilgili kısa bir özet ekleyebilirsiniz.', link: '#' },
          { id: id(), yazarAd: 'Mehmet Kaya', yazarGorsel: ONIZLEME_GORSEL, tarih: '08.05.2026', baslik: 'Siyaset gündemi', ozet: 'Bu alana yazınızla ilgili kısa bir özet ekleyebilirsiniz.', link: '#' },
          { id: id(), yazarAd: 'Zeynep Arslan', yazarGorsel: ONIZLEME_GORSEL, tarih: '07.05.2026', baslik: 'Kültür sanat', ozet: 'Bu alana yazınızla ilgili kısa bir özet ekleyebilirsiniz.', link: '#' },
        ],
        tumunuGorMetin: 'TÜM YAZARLAR',
        tumunuGorLink: '/yazarlar',
      };
    case 'ILETISIM_BLOK':
      return {
        iletisimKartlari: [
          { id: id(), etiket: 'Merkez Şube', deger: 'Muratpaşa/Antalya', ikon: '📍' },
          { id: id(), etiket: 'Sabit Telefon', deger: '0 123 456 78 90', ikon: '📞' },
          { id: id(), etiket: 'Cep Telefonu', deger: '0 123 456 78 90', ikon: '📱' },
          { id: id(), etiket: 'Whatsapp', deger: '05551112233', ikon: '💬' },
          { id: id(), etiket: 'Email Adresimiz', deger: 'bilgi@siteadresi.com', ikon: '✉️' },
          { id: id(), etiket: 'Çalışma Saatleri', deger: 'Pts-Cts: 09:00-20:00', ikon: '🕐' },
        ],
        haritaUrl: 'Antalya',
      };
    case 'KATEGORI_HABER_LISTESI':
    case 'HABER_MAGAZIN':
      return {
        haberKartlari: Array.from({ length: 6 }, (_, i) => ({
          id: id(),
          baslik: `Örnek haber başlığı ${i + 1}`,
          ozet: 'Bu alana eklemiş olduğunuz haberle ilgili kısa bir özet bilgisi.',
          gorselUrl: ONIZLEME_GORSEL,
          link: '#',
          tarih: '10.05.2026',
          yorumSayisi: i % 3,
          badge: i === 4 ? 'DİJİTAL TÜRK LİRASI' : undefined,
          kartStili: i === 1 ? 'overlay' as const : undefined,
        })),
        tumunuGorMetin: '+ TÜMÜNÜ GÖRÜNTÜLE',
        tumunuGorLink: '#',
      };
    case 'KATEGORI_HABER_OVERLAY':
      return {
        haberKartlari: Array.from({ length: 6 }, (_, i) => ({
          id: id(),
          baslik: `Teknoloji haberi ${i + 1}`,
          gorselUrl: ONIZLEME_GORSEL,
          link: '#',
        })),
        tumunuGorMetin: '+ TÜMÜNÜ GÖRÜNTÜLE',
        tumunuGorLink: '#',
      };
    case 'VIDEO_GALERISI':
      return {
        videoKartlari: Array.from({ length: 4 }, (_, i) => ({
          id: id(),
          baslik: `Video haber ${i + 1}`,
          gorselUrl: ONIZLEME_GORSEL,
          videoLink: '#',
          link: '#',
        })),
        tumunuGorMetin: '+ TÜMÜNÜ GÖRÜNTÜLE',
        tumunuGorLink: '#',
      };
    case 'SEKMELI_HABER':
      return {
        haberSekmeler: [
          {
            id: id(),
            baslik: 'Dünya',
            kartlar: [
              { id: id(), baslik: 'ABD\'den 3 ülkeye 150 milyon dolarlık yeni askeri yardım', ozet: 'Bu alan öne çıkan haber özeti için kullanılır.', gorselUrl: ONIZLEME_GORSEL, link: '#', tarih: '13.05.2026', yorumSayisi: 0 },
              { id: id(), baslik: 'İran\'da siyasi gelişmeler', gorselUrl: ONIZLEME_GORSEL, link: '#', tarih: '10.05.2026', yorumSayisi: 2 },
              { id: id(), baslik: 'Meksika\'da gazeteciler protesto etti', gorselUrl: ONIZLEME_GORSEL, link: '#', tarih: '10.05.2026', yorumSayisi: 0 },
              { id: id(), baslik: 'Brüksel\'de sokak isimleri değişiyor', gorselUrl: ONIZLEME_GORSEL, link: '#', tarih: '10.05.2026', yorumSayisi: 1 },
            ],
          },
          { id: id(), baslik: 'Gündem', kartlar: [{ id: id(), baslik: 'Gündem haberi', gorselUrl: ONIZLEME_GORSEL, link: '#', tarih: '10.05.2026' }] },
          { id: id(), baslik: 'Teknoloji', kartlar: [{ id: id(), baslik: 'Teknoloji haberi', gorselUrl: ONIZLEME_GORSEL, link: '#', tarih: '10.05.2026' }] },
        ],
      };
    case 'HAVA_DURUMU':
      return {
        havaSehir: 'İstanbul',
        havaIlce: 'Kadıköy',
        havaKaynak: 'api',
      };
    case 'KRIPTO_LISTESI':
      return {
        kriptoKaynak: 'api',
        kriptoLimit: 10,
        tumunuGorMetin: 'Tümünü Göster →',
        tumunuGorLink: '#',
      };
    case 'GUNCEL_KONULAR':
      return {
        haberKartlari: Array.from({ length: 10 }, (_, i) => ({
          id: id(),
          baslik: `Güncel konu başlığı ${i + 1} — örnek haber manşeti`,
          link: '#',
        })),
      };
    case 'SIRKET_GIRIS_CIKIS':
      return {
        sirketKonum: 'Merkez Ofis — İstanbul',
        sirketAnlikSaat: '09:50:28',
        kapanisaKalan: '08:09:32',
        acilisKapanisSaatleri: {
          haftaIciAcilis: '09:00',
          haftaIciKapanis: '18:00',
          cumartesiAcilis: '09:00',
          cumartesiKapanis: '13:00',
          pazarAcilis: 'Kapalı',
          pazarKapanis: 'Kapalı',
        },
      };
    case 'BLOK_OLUSTURUCU':
      return {
        olusturucu: {
          parcaSayisi: 2,
          duzen: 'yan_yana',
          hucreler: [
            {
              id: id(),
              bloklar: [
                { id: id(), tip: 'baslik', metin: 'Örnek Başlık' },
                { id: id(), tip: 'metin', metin: 'Grid parçalarıyla oluşturulmuş örnek widget.' },
                { id: id(), tip: 'buton', butonMetni: 'Detay', butonLink: '#' },
              ],
            },
            {
              id: id(),
              bloklar: [
                { id: id(), tip: 'gorsel', gorselUrl: ONIZLEME_GORSEL, metin: 'Görsel' },
                { id: id(), tip: 'yildiz', yildiz: 5 },
              ],
            },
          ],
        },
      };
    default:
      return {};
  }
}

function metinDolu(deger: string | undefined | null): boolean {
  return Boolean(deger?.trim());
}

function nesneBirlestir<T extends Record<string, string | undefined>>(
  mevcut: T | undefined,
  mock: T | undefined
): T | undefined {
  if (!mock) return mevcut;
  const sonuc = { ...mock, ...(mevcut ?? {}) } as T;
  for (const k of Object.keys(mock) as (keyof T)[]) {
    if (!metinDolu(sonuc[k] as string | undefined)) sonuc[k] = mock[k];
  }
  return sonuc;
}

function acilisKapanisBirlestir(
  mevcut: WidgetAcilisKapanisSaati | undefined,
  mock: WidgetAcilisKapanisSaati | undefined
): WidgetAcilisKapanisSaati | undefined {
  return nesneBirlestir(
    mevcut as Record<string, string | undefined> | undefined,
    mock as Record<string, string | undefined> | undefined
  ) as WidgetAcilisKapanisSaati | undefined;
}

function diziZorla<T>(mevcut: T[] | undefined, ornek: T[]): T[] {
  if (!ornek.length) return mevcut ?? [];
  return mevcut && mevcut.length > 0 ? mevcut : ornek;
}

const HABER_PORTAL_TIPLERI = new Set([
  'KOSE_YAZARLARI',
  'ILETISIM_BLOK',
  'KATEGORI_HABER_LISTESI',
  'KATEGORI_HABER_OVERLAY',
  'VIDEO_GALERISI',
  'SEKMELI_HABER',
  'GUNCEL_KONULAR',
  'HABER_MAGAZIN',
]);

function configBirlestir(mevcut: WidgetConfig, mock: WidgetConfig, tip?: string): WidgetConfig {
  const sonuc: WidgetConfig = { ...mevcut };

  if (!sonuc.modulIkon && mock.modulIkon) sonuc.modulIkon = mock.modulIkon;
  if (!sonuc.dahaFazlaMetin && mock.dahaFazlaMetin) sonuc.dahaFazlaMetin = mock.dahaFazlaMetin;
  if (!sonuc.dahaFazlaLink && mock.dahaFazlaLink) sonuc.dahaFazlaLink = mock.dahaFazlaLink;
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
  sonuc.haritaSubeler = dizi(sonuc.haritaSubeler, mock.haritaSubeler ?? []);
  sonuc.logoKartlar = dizi(sonuc.logoKartlar, mock.logoKartlar ?? []);
  sonuc.kategoriler = dizi(sonuc.kategoriler, mock.kategoriler ?? []);
  sonuc.filtreler = dizi(sonuc.filtreler, mock.filtreler ?? []);
  sonuc.timeline = dizi(sonuc.timeline, mock.timeline ?? []);
  sonuc.surecAdimlari = dizi(sonuc.surecAdimlari, mock.surecAdimlari ?? []);
  sonuc.markalar = dizi(sonuc.markalar, mock.markalar ?? []);
  sonuc.karsilastirmaPaketler = dizi(sonuc.karsilastirmaPaketler, mock.karsilastirmaPaketler ?? []);
  sonuc.karsilastirmaSatirlari = dizi(sonuc.karsilastirmaSatirlari, mock.karsilastirmaSatirlari ?? []);

  if (!sonuc.bitisTarihi && mock.bitisTarihi) sonuc.bitisTarihi = mock.bitisTarihi;
  if (!sonuc.videoUrl && mock.videoUrl) sonuc.videoUrl = mock.videoUrl;
  if (!sonuc.videoTip && mock.videoTip) sonuc.videoTip = mock.videoTip;
  if (!sonuc.onceGorsel && mock.onceGorsel) sonuc.onceGorsel = mock.onceGorsel;
  if (!sonuc.sonraGorsel && mock.sonraGorsel) sonuc.sonraGorsel = mock.sonraGorsel;
  if (!sonuc.bultenPlaceholder && mock.bultenPlaceholder) sonuc.bultenPlaceholder = mock.bultenPlaceholder;
  if (!sonuc.bultenKvkk && mock.bultenKvkk) sonuc.bultenKvkk = mock.bultenKvkk;
  if (!sonuc.markaHizi && mock.markaHizi) sonuc.markaHizi = mock.markaHizi;

  if (!sonuc.tumunuGorMetin && mock.tumunuGorMetin) sonuc.tumunuGorMetin = mock.tumunuGorMetin;
  if (!sonuc.tumunuGorLink && mock.tumunuGorLink) sonuc.tumunuGorLink = mock.tumunuGorLink;

  sonuc.haberKartlari = dizi(sonuc.haberKartlari, mock.haberKartlari ?? []);
  sonuc.koseYazarlari = dizi(sonuc.koseYazarlari, mock.koseYazarlari ?? []);
  sonuc.iletisimKartlari = dizi(sonuc.iletisimKartlari, mock.iletisimKartlari ?? []);
  sonuc.videoKartlari = dizi(sonuc.videoKartlari, mock.videoKartlari ?? []);
  sonuc.haberSekmeler = dizi(sonuc.haberSekmeler, mock.haberSekmeler ?? []);
  sonuc.kriptoParalar = dizi(sonuc.kriptoParalar, mock.kriptoParalar ?? []);
  sonuc.havaGunler = dizi(sonuc.havaGunler, mock.havaGunler ?? []);

  if (!sonuc.havaSehir && mock.havaSehir) sonuc.havaSehir = mock.havaSehir;
  if (!sonuc.havaIlce && mock.havaIlce) sonuc.havaIlce = mock.havaIlce;
  sonuc.havaAnlik = nesneBirlestir(sonuc.havaAnlik, mock.havaAnlik);
  sonuc.acilisKapanisSaatleri = acilisKapanisBirlestir(sonuc.acilisKapanisSaatleri, mock.acilisKapanisSaatleri);
  if (!sonuc.sirketKonum && mock.sirketKonum) sonuc.sirketKonum = mock.sirketKonum;
  if (!sonuc.sirketAnlikSaat && mock.sirketAnlikSaat) sonuc.sirketAnlikSaat = mock.sirketAnlikSaat;
  if (!sonuc.kapanisaKalan && mock.kapanisaKalan) sonuc.kapanisaKalan = mock.kapanisaKalan;

  if (tip === 'GUNCEL_KONULAR') {
    sonuc.haberKartlari = diziZorla(sonuc.haberKartlari, mock.haberKartlari ?? []);
  }
  if (tip === 'SIRKET_GIRIS_CIKIS') {
    sonuc.acilisKapanisSaatleri = acilisKapanisBirlestir(
      sonuc.acilisKapanisSaatleri,
      mock.acilisKapanisSaatleri
    );
  }
  if (tip && HABER_PORTAL_TIPLERI.has(tip)) {
    if (mock.haberKartlari?.length) {
      sonuc.haberKartlari = diziZorla(sonuc.haberKartlari, mock.haberKartlari);
    }
    if (mock.koseYazarlari?.length) {
      sonuc.koseYazarlari = diziZorla(sonuc.koseYazarlari, mock.koseYazarlari);
    }
    if (mock.videoKartlari?.length) {
      sonuc.videoKartlari = diziZorla(sonuc.videoKartlari, mock.videoKartlari);
    }
    if (mock.haberSekmeler?.length) {
      sonuc.haberSekmeler = diziZorla(sonuc.haberSekmeler, mock.haberSekmeler);
    }
    if (mock.iletisimKartlari?.length) {
      sonuc.iletisimKartlari = diziZorla(sonuc.iletisimKartlari, mock.iletisimKartlari);
    }
  }

  return sonuc;
}

/** Önizleme için boş alanları örnek verilerle doldurur — kayıtlı içeriğe dokunmaz */
export function onizlemeMockVerisiUygula(widget: Widget): Widget {
  const cfg = (widget.configJson ?? {}) as WidgetConfig;
  const mock = mockConfig(widget.tip);
  const birlesik = configBirlestir(cfg, mock, widget.tip);

  return {
    ...widget,
    ad: metin(widget.ad, 'Örnek Widget'),
    baslik: metin(widget.baslik, mockBaslik(widget.tip)),
    altBaslik: metin(widget.altBaslik, 'Güzel Teknoloji'),
    aciklama: metin(
      widget.aciklama,
      widget.tip === 'ILETISIM_FORMU'
        ? 'Sorularınız için bize ulaşın, en kısa sürede dönüş yapalım.'
        : widget.tip === 'MODUL_LOGO_BLOK'
          ? 'Güvenli ve hızlı ödeme altyapısı ile tüm banka ve ödeme kuruluşlarıyla entegre çalışın.'
          : widget.tip === 'UCRETSIZ_DENEME'
            ? "2005'ten bu yana 50.000+ işletme yanılıyor olamaz — 15 gün ücretsiz deneyin."
            : 'Bu bölüm önizleme amaçlı örnek içerik göstermektedir.'
    ),
    gorselUrl: widget.gorselUrl?.trim()
      ? widget.gorselUrl
      : ['BASLIK_METIN_GORSEL', 'VIDEO_BANNER'].includes(widget.tip)
        ? ONIZLEME_GORSEL
        : widget.gorselUrl,
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
    YORUM_KARTLARI: 'Müşterilerimizin Görüşleri',
    FIYATLANDIRMA: 'Paketlerimiz',
    MODUL_LOGO_BLOK: '1. Ödeme Sistemleri ve Finans Modülü',
    GALERI: 'Galeri',
    SSS: 'Sık Sorulan Sorular',
    REFERANSLAR: 'Referanslarımız',
    KATEGORI: 'Kategoriler',
    HARITA: 'Konumumuz',
    ILETISIM_FORMU: 'İletişime Geçin',
    POPUP: 'Özel Teklif',
    ZAMAN_CIZELGESI: 'Yolculuğumuz',
    SUREC_ADIMLARI: 'Nasıl Çalışıyoruz?',
    MARKA_SERIDI: 'Güvenen Markalar',
    KARSILASTIRMA_TABLOSU: 'Paket Karşılaştırması',
    GERI_SAYIM: 'Kampanya Bitiyor!',
    VIDEO_BANNER: 'Tanıtım Videosu',
    ONCESI_SONRASI: 'Farkı Görün',
    BULTEN_KAYIT: 'Bültenimize Katılın',
    UCRETSIZ_DENEME: 'Hemen Ücretsiz Deneyin',
    KOSE_YAZARLARI: 'KÖŞE YAZARLARI',
    ILETISIM_BLOK: 'Bizimle Çalışmaya Hazır mısınız?',
    KATEGORI_HABER_LISTESI: 'OTOMOBİL',
    KATEGORI_HABER_OVERLAY: 'TEKNOLOJİ',
    VIDEO_GALERISI: 'Video Galeri',
    SEKMELI_HABER: 'Haberler',
    HAVA_DURUMU: 'Hava Durumu',
    KRIPTO_LISTESI: 'KRİPTO PARALAR',
    GUNCEL_KONULAR: 'GÜNCEL KONULAR',
    SIRKET_GIRIS_CIKIS: 'Şirket Açılış / Kapanış',
    HABER_MAGAZIN: 'EKONOMİ',
  };
  return basliklar[tip] ?? 'Örnek Başlık';
}

function formdanWidget(form: WidgetFormDegeri): Widget {
  let configJson: Record<string, unknown> | null = null;
  try {
    configJson = JSON.parse(form.configJsonMetin || '{}') as Record<string, unknown>;
  } catch {
    configJson = {};
  }
  return {
    id: 'mock-fill',
    ad: form.ad,
    tip: form.tip,
    sira: form.sira,
    aktif: form.aktif,
    baslik: form.baslik || null,
    altBaslik: form.altBaslik || null,
    aciklama: form.aciklama || null,
    gorselUrl: form.gorselUrl || null,
    butonMetni: form.butonMetni || null,
    butonLink: form.butonLink || null,
    arkaPlanRenk: form.arkaPlanRenk || null,
    yaziRenk: form.yaziRenk || null,
    mobilGoster: form.mobilGoster,
    masaustuGoster: form.masaustuGoster,
    configJson,
  };
}

/** Formdaki boş alanları örnek içerikle doldurur; dolu alanlara dokunmaz */
export function widgetFormMockUygula(form: WidgetFormDegeri): WidgetFormDegeri {
  const widget = onizlemeMockVerisiUygula(formdanWidget(form));
  let configJson = { ...(widget.configJson ?? {}) } as WidgetConfig;

  if (form.tip === 'SIRKET_GIRIS_CIKIS') {
    const simdi = new Date();
    const saat = simdi.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    if (!configJson.sirketAnlikSaat?.trim()) {
      configJson = { ...configJson, sirketAnlikSaat: saat };
    }
  }

  return {
    ...form,
    ad: widget.ad ?? form.ad,
    baslik: widget.baslik ?? '',
    altBaslik: widget.altBaslik ?? '',
    aciklama: widget.aciklama ?? '',
    gorselUrl: widget.gorselUrl ?? '',
    butonMetni: widget.butonMetni ?? '',
    butonLink: widget.butonLink ?? '',
    configJsonMetin: JSON.stringify(configJson, null, 2),
  };
}
