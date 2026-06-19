import type { SistemKesifTur } from '@/types/sistemKesif';

const panelAdimlari = [
  {
    id: 'hosgeldin',
    baslik: 'Güzel Teknoloji Admin Paneline Hoş Geldiniz',
    aciklama:
      'Bu kısa turda panelin ana bölümlerini adım adım göstereceğiz. İleri ile devam edin; istediğiniz zaman atlayabilirsiniz.',
  },
  {
    id: 'baslat',
    hedef: 'baslat-menu',
    okYonu: 'sag' as const,
    baslik: 'Başlat Menüsü',
    aciklama:
      'Sol üstteki ızgaraya tıklayarak tüm modüllere ulaşın. Sayfalar, widgetlar, SEO, kullanıcılar ve sistem ayarları buradan açılır.',
  },
  {
    id: 'sekmeler',
    hedef: 'sekme-cubugu',
    okYonu: 'alt' as const,
    baslik: 'Sekme Çubuğu',
    aciklama:
      'Açtığınız modüller sekme olarak üstte listelenir. Sürükleyerek sıralayabilir, gruplayabilir veya kapatıp tekrar açabilirsiniz.',
  },
  {
    id: 'icerik',
    hedef: 'modul-icerik',
    okYonu: 'ust' as const,
    baslik: 'Çalışma Alanı',
    aciklama:
      'Seçili modülün içeriği bu alanda düzenlenir. Liste, form ve önizleme panelleri modüle göre değişir.',
  },
  {
    id: 'aksiyon',
    hedef: 'aksiyon-cubugu',
    okYonu: 'ust' as const,
    baslik: 'Alt Aksiyon Çubuğu',
    aciklama:
      'Kaydet, ekle, sil ve önizle gibi işlemler her modülde burada görünür. Değişikliklerinizi buradan kaydedin.',
  },
];

const dashboardAdimlari = [
  {
    id: 'dash-kpi',
    hedef: 'dash-kpi',
    modulId: 'dashboard',
    okYonu: 'alt' as const,
    baslik: 'Özet Kartları',
    aciklama:
      'Ziyaret, sayfa görüntüleme ve form gönderimi gibi temel metrikleri buradan takip edin. Analitik görünümde dönem seçerek filtreleyebilirsiniz.',
  },
  {
    id: 'dash-hizli',
    hedef: 'dash-hizli-erisim',
    modulId: 'dashboard',
    okYonu: 'ust' as const,
    baslik: 'Hızlı Erişim',
    aciklama:
      'Sık kullandığınız modüllere tek tıkla gidin. Dişli simgesiyle kartları kendinize göre düzenleyin.',
  },
  {
    id: 'dash-gorunum',
    hedef: 'dash-gorunum',
    modulId: 'dashboard',
    okYonu: 'alt' as const,
    baslik: 'Dashboard Görünümü',
    aciklama: 'Analitik veya sade görünüm arasında geçiş yapın. Tercihiniz tarayıcıda saklanır.',
  },
  {
    id: 'site-onizle',
    hedef: 'site-onizle',
    modulId: 'dashboard',
    okYonu: 'alt' as const,
    baslik: 'Canlı Site Önizlemesi',
    aciklama: 'Yaptığınız değişiklikleri yayındaki sitede yeni sekmede görüntüleyin.',
  },
];

export const SISTEM_KESIF_TURLARI: SistemKesifTur[] = [
  {
    id: 'tam-tur',
    baslik: 'Tam Panel Turu',
    aciklama: 'Panel arayüzü ve dashboard özelliklerini baştan sona keşfedin.',
    ikon: '🚀',
    adimlar: [
      ...panelAdimlari,
      ...dashboardAdimlari,
      {
        id: 'bildirim',
        hedef: 'bildirim-tray',
        okYonu: 'ust' as const,
        baslik: 'Bildirimler ve Görev Çubuğu',
        aciklama:
          'Sağ alttaki simgelerden log kayıtlarına, yedeklemeye ve bildirimlere hızlıca ulaşın.',
      },
      {
        id: 'bitis',
        baslik: 'Tur Tamamlandı',
        aciklama:
          'Artık panele hakimsiniz. İstediğiniz konuyu tekrar seçerek o alana özel tur başlatabilirsiniz.',
      },
    ],
  },
  {
    id: 'panel-arayuzu',
    baslik: 'Panel Arayüzü',
    aciklama: 'Menü, sekmeler, çalışma alanı ve aksiyon çubuğu.',
    ikon: '🖥️',
    adimlar: panelAdimlari,
  },
  {
    id: 'dashboard',
    baslik: 'Dashboard',
    aciklama: 'Özet kartlar, hızlı erişim ve görünüm seçenekleri.',
    ikon: '📊',
    adimlar: [
      {
        id: 'dash-giris',
        modulId: 'dashboard',
        baslik: 'Dashboard',
        aciklama: 'Ana sayfada sitenizin nabzını tutarsınız. Hadi önemli alanları tek tek görelim.',
      },
      ...dashboardAdimlari,
    ],
  },
  {
    id: 'icerik-yonetimi',
    baslik: 'İçerik Yönetimi',
    aciklama: 'Sayfalar, widgetlar, blog ve formlar.',
    ikon: '📝',
    adimlar: [
      {
        id: 'icerik-menu',
        hedef: 'baslat-menu',
        menuAc: true,
        okYonu: 'sag' as const,
        baslik: 'İçerik Modülleri',
        aciklama:
          'Başlat menüsünde İçerik Yönetimi bölümünde Sayfalar, Blog ve Formlar bulunur. Hızlı Erişimde Widget Yönetimi de vardır.',
      },
      {
        id: 'sayfalar',
        hedef: 'modul-kabuk',
        modulId: 'sayfalar',
        menuKapat: true,
        okYonu: 'alt' as const,
        baslik: 'Sayfa Yönetimi',
        aciklama:
          'Sol listeden sayfa seçin; sağda başlık, slug, içerik ve menü ayarlarını düzenleyin. Alt sayfalar hiyerarşik yapılandırılır.',
      },
      {
        id: 'widgetlar',
        hedef: 'modul-kabuk',
        modulId: 'widget-yonetimi',
        okYonu: 'alt' as const,
        baslik: 'Widget Yönetimi',
        aciklama:
          'Anasayfa ve sayfa bileşenlerini buradan ekleyin. Slider, hizmet kartları, haber blokları ve daha fazlası widget tipleriyle gelir.',
      },
      {
        id: 'blog',
        hedef: 'modul-kabuk',
        modulId: 'blog',
        okYonu: 'alt' as const,
        baslik: 'Blog / Haberler',
        aciklama: 'Yazı oluşturun, kategorilendirin ve yayına alın. SEO alanları her yazı için ayrı ayarlanır.',
      },
      {
        id: 'formlar',
        hedef: 'modul-kabuk',
        modulId: 'formlar',
        okYonu: 'alt' as const,
        baslik: 'Form Yönetimi',
        aciklama:
          'İletişim formları tasarlayın, alanları sürükleyerek düzenleyin ve gelen gönderimleri panelden takip edin.',
      },
    ],
  },
  {
    id: 'site-gorunumu',
    baslik: 'Site Görünümü',
    aciklama: 'Header, hero, footer ve kategori ayarları.',
    ikon: '🏠',
    adimlar: [
      {
        id: 'site-menu',
        hedef: 'baslat-menu',
        menuAc: true,
        okYonu: 'sag' as const,
        baslik: 'Site Yönetimi',
        aciklama: 'Başlat menüsündeki Site Yönetimi kategorisinde görünüm modülleri gruplanır.',
      },
      {
        id: 'header',
        hedef: 'modul-kabuk',
        modulId: 'header',
        menuKapat: true,
        okYonu: 'alt' as const,
        baslik: 'Header Yönetimi',
        aciklama: 'Üst menü tipini seçin, logo ve navigasyonu yapılandırın. Canlı önizleme sekmeleriyle sonucu görün.',
      },
      {
        id: 'hero',
        hedef: 'modul-kabuk',
        modulId: 'hero',
        okYonu: 'alt' as const,
        baslik: 'Hero Alanı',
        aciklama: 'Ana banner görseli, başlık ve çağrı butonlarını buradan düzenleyin.',
      },
      {
        id: 'footer',
        hedef: 'modul-kabuk',
        modulId: 'footer',
        okYonu: 'alt' as const,
        baslik: 'Footer Yönetimi',
        aciklama: 'Alt bilgi alanı tipini seçin; link sütunları, iletişim ve sosyal medya ayarlarını yapın.',
      },
      {
        id: 'kategoriler',
        hedef: 'modul-kabuk',
        modulId: 'kategoriler',
        okYonu: 'alt' as const,
        baslik: 'Kategori Yönetimi',
        aciklama: 'Menü ve haber kategorilerini hiyerarşik olarak oluşturun.',
      },
    ],
  },
  {
    id: 'seo-yayin',
    baslik: 'SEO ve Yayın',
    aciklama: 'Arama motoru ayarları ve site geneli SEO.',
    ikon: '🔍',
    adimlar: [
      {
        id: 'seo-giris',
        modulId: 'seo',
        baslik: 'SEO Ayarları',
        aciklama: 'Sitenizin Google ve diğer arama motorlarındaki görünürlüğünü buradan yönetirsiniz.',
      },
      {
        id: 'seo-modul',
        hedef: 'modul-kabuk',
        modulId: 'seo',
        okYonu: 'alt' as const,
        baslik: 'Meta ve 301 Yönlendirme',
        aciklama:
          'Her URL için title ve description girin. Yeşil + ile 301 yönlendirme ekleyin; alt satırda kırmızı rozetle görünür.',
      },
      {
        id: 'site-ayarlari',
        hedef: 'modul-kabuk',
        modulId: 'site-ayarlari',
        okYonu: 'alt' as const,
        baslik: 'Site Ayarları',
        aciklama: 'Logo, renkler, iletişim bilgileri ve genel site kimliği bu modülde toplanır.',
      },
    ],
  },
  {
    id: 'kullanici-sistem',
    baslik: 'Kullanıcı ve Sistem',
    aciklama: 'Yetkiler, ayarlar, sekmeler ve yedekleme.',
    ikon: '⚙️',
    adimlar: [
      {
        id: 'kullanicilar',
        hedef: 'modul-kabuk',
        modulId: 'kullanicilar',
        okYonu: 'alt' as const,
        baslik: 'Kullanıcı Yönetimi',
        aciklama: 'Panel kullanıcılarını ekleyin, roller atayın ve erişimi kontrol edin.',
      },
      {
        id: 'roller',
        hedef: 'modul-kabuk',
        modulId: 'roller',
        okYonu: 'alt' as const,
        baslik: 'Roller ve Yetkiler',
        aciklama: 'Her rol için hangi modüllere erişilebileceğini granüler olarak tanımlayın.',
      },
      {
        id: 'sekme-yonetimi',
        hedef: 'modul-kabuk',
        modulId: 'sekme-yonetimi',
        okYonu: 'alt' as const,
        baslik: 'Sekme Yönetimi',
        aciklama: 'Üst sekme çubuğunun boyutunu, görünümünü ve davranışını özelleştirin.',
      },
      {
        id: 'sistem-tray',
        hedef: 'gorev-tray',
        modulId: 'dashboard',
        okYonu: 'ust' as const,
        baslik: 'Log ve Yedekleme',
        aciklama: 'Alt çubuktaki simgelerden işlem geçmişine ve veri yedeklemeye erişin.',
      },
    ],
  },
];

export function sistemKesifTurBul(id: string): SistemKesifTur | undefined {
  return SISTEM_KESIF_TURLARI.find((t) => t.id === id);
}
