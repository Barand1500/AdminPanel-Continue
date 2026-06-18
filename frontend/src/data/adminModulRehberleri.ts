import type { RehberKart } from '@/components/admin/ortak/AdminRehberModal';

export interface ModulRehber {
  baslik: string;
  altBaslik: string;
  bolumBaslik: string;
  kartlar: RehberKart[];
  ipucu?: string;
}

const sayfaKartlari: RehberKart[] = [
  {
    ikon: '➕',
    baslik: 'Yeni Sayfa Nasıl Eklenir?',
    aciklama:
      'Alt bardan Yeni Ekle butonuna basın. Başlık yazın — slug otomatik üretilir. İçerik ve SEO sekmelerini doldurup Kaydet ile kaydedin.',
    renk: 'mor',
  },
  {
    ikon: '✏️',
    baslik: 'Mevcut Sayfayı Düzenlemek',
    aciklama:
      'İçerik sekmesinde zengin metin editörü ile başlık, liste ve bağlantı ekleyebilirsiniz. Kaydet ile güncelleyin.',
    renk: 'turuncu',
  },
  {
    ikon: '🚀',
    baslik: 'Yayınlamak',
    aciklama:
      'Ayarlar sekmesinde Yayında anahtarını açabilir veya doğrudan alt bardaki Yayınla butonunu kullanabilirsiniz.',
    renk: 'mavi',
  },
  {
    ikon: '📋',
    baslik: 'Menü ve Slug',
    aciklama:
      "Menüde göster seçeneği sayfanın navbar'da görünmesini sağlar. Sıralama için Menü Yönetimi modülünü kullanın.",
    renk: 'sari',
  },
  {
    ikon: '🔍',
    baslik: 'SEO Ayarları',
    aciklama: 'SEO sekmesinden sayfa başlığı ve meta açıklaması ekleyin. Boş bırakırsanız sayfa başlığı kullanılır.',
    renk: 'camgobegi',
  },
];

export const ADMIN_MODUL_REHBERLERI: Record<string, ModulRehber> = {
  dashboard: {
    baslik: 'Dashboard Rehberi',
    altBaslik: 'Panele hızlı bakış ve kısayollar',
    bolumBaslik: 'Dashboard',
    kartlar: [
      {
        ikon: '📊',
        baslik: 'Özet Kartları',
        aciklama: 'Üstteki kartlar sayfa, blog, form ve widget sayılarını gösterir. Kurumsal sitenizin içerik durumunu buradan takip edin.',
        renk: 'mavi',
      },
      {
        ikon: '🧭',
        baslik: 'Modül Açma',
        aciklama: 'Hızlı erişim kartlarına tıklayarak ilgili modülü yeni sekmede açabilirsiniz.',
        renk: 'mor',
      },
      {
        ikon: '📬',
        baslik: 'Son Formlar',
        aciklama: 'Gelen form başvuruları listelenir. Okunmamış kayıtlar vurgulanır; Formlar modülünden detay görürsünüz.',
        renk: 'turuncu',
      },
    ],
    ipucu: 'Başlat menüsünden veya üst sekmelerden birden fazla modülü aynı anda açabilirsiniz.',
  },

  'site-ayarlari': {
    baslik: 'Site Ayarları Rehberi',
    altBaslik: 'Marka, tema ve iletişim',
    bolumBaslik: 'Site Ayarları',
    kartlar: [
      {
        ikon: '🖼️',
        baslik: 'Logo ve Favicon',
        aciklama: 'URL girebilir veya yükle ikonuna tıklayarak bilgisayardan dosya seçip yükleyebilirsiniz.',
        renk: 'mor',
      },
      {
        ikon: '🔤',
        baslik: 'Yazı Tipi',
        aciklama: 'Font kartlarından birini seçin. Her kart kendi fontuyla önizlenir; kaydettikten sonra sitede uygulanır.',
        renk: 'mavi',
      },
      {
        ikon: '📞',
        baslik: 'İletişim Alanları',
        aciklama: 'Telefon, e-posta ve WhatsApp otomatik formatlanır. Footer ve iletişim sayfasında kullanılır.',
        renk: 'yesil',
      },
    ],
    ipucu: 'Değişiklikleri alt bardaki Kaydet ile kaydedin; Önizle ile public siteyi yeni sekmede açın.',
  },

  sayfalar: {
    baslik: 'Sayfa Rehberi',
    altBaslik: 'Tüm bölümlerin açıklamaları',
    bolumBaslik: 'Sayfa Yönetimi',
    kartlar: sayfaKartlari,
    ipucu: 'Sol listedeki arama kutusuna yazarak sayfaları anlık filtreleyebilirsiniz.',
  },

  'widget-yonetimi': {
    baslik: 'Widget Rehberi',
    altBaslik: 'Ana sayfa bloklarını yönetin',
    bolumBaslik: 'Widget Yönetimi',
    kartlar: [
      {
        ikon: '🧩',
        baslik: 'Widget Nedir?',
        aciklama: 'Slider, hizmet kartları ve özel bloklar ana sayfada sırayla gösterilir. Her widget tipi farklı alanlar içerir.',
        renk: 'mor',
      },
      {
        ikon: '➕',
        baslik: 'Yeni Widget',
        aciklama: 'Tip seçin, İçerik ve Görünüm sekmelerinden düzenleyin. Footer Önizle ile canlı önizleme açılır.',
        renk: 'turuncu',
      },
      {
        ikon: '👁️',
        baslik: 'Önizleme',
        aciklama: 'Genel sekmesinde tip kartına veya listeden widget seçince Önizle aktif olur.',
        renk: 'yesil',
      },
      {
        ikon: '🔢',
        baslik: 'Sıralama',
        aciklama: 'Sıra numarası küçük olan widget önce görünür. Aktif/pasif anahtarı ile gizleyebilirsiniz.',
        renk: 'mavi',
      },
      {
        ikon: '🗂️',
        baslik: 'Widget Kategorileri',
        aciklama: 'Yeni widget eklerken tipler kategorilere ayrılır: Slider, Görsel+Metin, Kart, Karusel, Resimli, İstatistik, İletişim.',
        renk: 'turuncu',
      },
    ],
    ipucu: 'Safir tarzı site için: Metin+Görsel (hakkımızda), Hizmet Kartları, Görsel Etiket Kartları, Ekip Karuseli, Sayaç, Yorum ve Fiyatlandırma widgetlarını kullanın.',
  },

  'menu-yonetimi': {
    baslik: 'Menü Rehberi',
    altBaslik: 'Navbar linklerini düzenleyin',
    bolumBaslik: 'Menü Yönetimi',
    kartlar: [
      {
        ikon: '📋',
        baslik: 'Menü Öğeleri',
        aciklama: 'Başlık ve yol (URL) girerek yeni link ekleyin. Sürükle-bırak veya sıra numarası ile sıralayın.',
        renk: 'mor',
      },
      {
        ikon: '🔗',
        baslik: 'İç ve Dış Linkler',
        aciklama: 'İç linkler / ile başlar (örneğin /hakkimizda). Dış linkler https:// ile tam URL olmalıdır.',
        renk: 'mavi',
      },
      {
        ikon: '👁️',
        baslik: 'Önizleme',
        aciklama: 'Kaydettikten sonra public sitede header menüsünü kontrol edin.',
        renk: 'yesil',
      },
    ],
  },

  medya: {
    baslik: 'Medya Rehberi',
    altBaslik: 'Görsel ve dosya yönetimi',
    bolumBaslik: 'Medya Galerisi',
    kartlar: [
      {
        ikon: '📤',
        baslik: 'Dosya Yükleme',
        aciklama: 'PNG, JPG, WEBP dosyalarını bilgisayardan yükleyin veya URL ile ekleyin. Max 5MB.',
        renk: 'mor',
      },
      {
        ikon: '🔗',
        baslik: 'URL Kullanımı',
        aciklama: "Yüklenen dosyanın URL'sini kopyalayıp sayfa, widget veya site ayarlarında kullanın.",
        renk: 'mavi',
      },
      {
        ikon: '🗑️',
        baslik: 'Silme',
        aciklama: 'Kullanılmayan medyayı seçip alt bardaki Sil ile kaldırabilirsiniz.',
        renk: 'turuncu',
      },
    ],
  },

  seo: {
    baslik: 'SEO Rehberi',
    altBaslik: 'Arama motoru optimizasyonu',
    bolumBaslik: 'SEO Ayarları',
    kartlar: [
      {
        ikon: '🔍',
        baslik: 'Genel SEO',
        aciklama: 'Site başlığı, meta açıklama ve anahtar kelimeleri girin. Google arama sonuçlarında görünür.',
        renk: 'mavi',
      },
      {
        ikon: '🖼️',
        baslik: 'OG Görseli',
        aciklama: 'Sosyal medyada paylaşımda çıkan önizleme görselidir. 1200x630 px önerilir.',
        renk: 'mor',
      },
      {
        ikon: '📄',
        baslik: 'Sayfa Bazlı SEO',
        aciklama: 'Her sayfanın kendi SEO sekmesi vardır. Genel ayarlar tüm site için varsayılan olur.',
        renk: 'camgobegi',
      },
    ],
  },

  header: {
    baslik: 'Header Rehberi',
    altBaslik: 'Navbar site adı',
    bolumBaslik: 'Header Yönetimi',
    kartlar: [
      {
        ikon: '🏷️',
        baslik: 'Site Adı',
        aciklama:
          "Navbar'da görünen firma adını buradan değiştirin. Logo yoksa bu metin gösterilir; logo ve diğer marka ayarları için Site Ayarları modülünü kullanın.",
        renk: 'mor',
      },
    ],
    ipucu: 'Site adını kaydettikten sonra Önizle ile navbar görünümünü kontrol edin.',
  },

  kategoriler: {
    baslik: 'Kategori Yönetimi Rehberi',
    altBaslik: 'Header mega menü kategorileri',
    bolumBaslik: 'Kategori Yönetimi',
    kartlar: [
      {
        ikon: '➕',
        baslik: 'Yeni Kategori',
        aciklama:
          'Alt bardaki Yeni Ekle ile ana kategori oluşturun. Bir kategori seçip Alt Ekle ile alt ve alt-alt kategori ekleyebilirsiniz (en fazla 3 seviye).',
        renk: 'mor',
      },
      {
        ikon: '✏️',
        baslik: 'Düzenleme',
        aciklama:
          'Listeden kategori seçin; ad, slug, link, sıra ve görseli değiştirip Kaydet ile güncelleyin. Slug boş bırakılırsa başlıktan otomatik üretilir.',
        renk: 'turuncu',
      },
      {
        ikon: '👁️',
        baslik: 'Aktif / Pasif',
        aciklama: 'Pasif kategoriler sitede görünmez; silmeden geçici olarak gizlemek için kullanın.',
        renk: 'mavi',
      },
      {
        ikon: '🖥️',
        baslik: 'Önizleme',
        aciklama:
          'Sağ paneldeki menü önizlemesi, Header Yönetimi’ndeki açılış modunu (dropdown, sidebar, liste) yansıtır.',
        renk: 'camgobegi',
      },
      {
        ikon: '🔝',
        baslik: 'Header Bağlantısı',
        aciklama:
          '“Tüm Kategoriler” buton metni ve menü açılış stili Header Yönetimi → Kategori & Arama sekmesinden ayarlanır.',
        renk: 'sari',
      },
    ],
    ipucu: 'Kategoriler kaydedildikten sonra public sitede header altındaki menüde görünür.',
  },

  hero: {
    baslik: 'Hero Rehberi',
    altBaslik: 'Ana sayfa slider ve güven kartları',
    bolumBaslik: 'Hero Yönetimi',
    kartlar: [
      {
        ikon: '🖼️',
        baslik: 'Slider Ekleme',
        aciklama: 'Yeni Slider ile görsel yükleyin. Birden fazla slider otomatik döner.',
        renk: 'mor',
      },
      {
        ikon: '🎨',
        baslik: 'Stil ve Buton',
        aciklama: '3 farklı stil seçin. Butonu açıp metin, link ve 9 noktalı konum belirleyin.',
        renk: 'mavi',
      },
      {
        ikon: '✅',
        baslik: 'Güven Kartları',
        aciklama: 'Alttaki ikonlu kutuları açıp kapatabilir, emoji ve metinleri düzenleyebilirsiniz.',
        renk: 'yesil',
      },
    ],
    ipucu: 'Değişiklikleri Kaydet ile kaydedin; Önizle ile ana sayfayı kontrol edin.',
  },

  footer: {
    baslik: 'Footer Rehberi',
    altBaslik: 'Alt bilgi alanı',
    bolumBaslik: 'Footer Yönetimi',
    kartlar: [
      {
        ikon: '📱',
        baslik: 'Sosyal Medya',
        aciklama: 'Platform linklerini Marka & Görünüm sekmesinden ekleyin; footer ve header görünürlüğünü ayrı ayrı yönetin.',
        renk: 'camgobegi',
      },
      {
        ikon: '📍',
        baslik: 'İletişim Görünürlüğü',
        aciklama: "İletişim verileri Site Ayarları'ndan gelir; burada yalnızca footer'da göster/gizle ayarlanır.",
        renk: 'yesil',
      },
      {
        ikon: '🔗',
        baslik: 'Link Kolonları',
        aciklama: 'Footer menü kolonlarını ve linklerini bu modülden yönetin.',
        renk: 'mavi',
      },
      {
        ikon: '👁️',
        baslik: 'Önizleme',
        aciklama: 'Sayfa altındaki footer önizlemesini kontrol edin.',
        renk: 'mor',
      },
    ],
  },

  blog: {
    baslik: 'Blog Rehberi',
    altBaslik: 'Haber ve blog yazıları',
    bolumBaslik: 'Blog Yönetimi',
    kartlar: [
      {
        ikon: '📝',
        baslik: 'Yazı Ekleme',
        aciklama: 'Başlık, içerik ve kapak görseli ile yeni yazı oluşturun. Slug otomatik üretilir.',
        renk: 'mor',
      },
      {
        ikon: '🚀',
        baslik: 'Yayınlama',
        aciklama: 'Yayında anahtarı açık yazılar /blog sayfasında listelenir. Görünüm Ayarları ile ana sayfa, hizmetler ve header menüsünü yönetin.',
        renk: 'yesil',
      },
      {
        ikon: '📍',
        baslik: 'Görünüm Yerleri',
        aciklama: 'Ana sayfa bandı, hizmetler alanı ve varsayılan header menüsünde Blog linki ayrı ayrı açılıp kapatılabilir.',
        renk: 'mavi',
      },
      {
        ikon: '🔍',
        baslik: 'SEO',
        aciklama: 'Her yazı için meta başlık ve açıklama ekleyebilirsiniz.',
        renk: 'camgobegi',
      },
    ],
  },

  formlar: {
    baslik: 'Form Rehberi',
    altBaslik: 'İletişim formları ve başvurular',
    bolumBaslik: 'Form Yönetimi',
    kartlar: [
      {
        ikon: '📋',
        baslik: 'Form Oluşturma',
        aciklama: 'Form adı ve alanları tanımlayın. Metin, e-posta, telefon gibi alan tipleri seçilebilir.',
        renk: 'mor',
      },
      {
        ikon: '📬',
        baslik: 'Gelen Başvurular',
        aciklama: 'Gönderilen formlar listede görünür. Okundu işareti ve detay görüntüleme mevcuttur.',
        renk: 'mavi',
      },
    ],
  },

  kullanicilar: {
    baslik: 'Kullanıcı Rehberi',
    altBaslik: 'Panel kullanıcıları',
    bolumBaslik: 'Kullanıcılar',
    kartlar: [
      {
        ikon: '👤',
        baslik: 'Kullanıcı Ekleme',
        aciklama: 'E-posta, ad soyad ve rol ile yeni kullanıcı oluşturun. Şifre ilk girişte belirlenir.',
        renk: 'mor',
      },
      {
        ikon: '🔐',
        baslik: 'Roller',
        aciklama: 'Her kullanıcıya ADMIN, EDITOR vb. rol atanır. Yetkiler Roller modülünden yönetilir.',
        renk: 'mavi',
      },
      {
        ikon: '⏸️',
        baslik: 'Aktif / Pasif',
        aciklama: 'Pasif kullanıcılar panele giriş yapamaz.',
        renk: 'turuncu',
      },
    ],
  },

  roller: {
    baslik: 'Rol Rehberi',
    altBaslik: 'Yetki ve erişim kontrolü',
    bolumBaslik: 'Roller ve Yetkiler',
    kartlar: [
      {
        ikon: '🔐',
        baslik: 'Rol Tanımları',
        aciklama: 'Her rol hangi modüllere erişebileceğini belirler. Sadece admin kullanıcılar düzenleyebilir.',
        renk: 'mor',
      },
      {
        ikon: '✅',
        baslik: 'Yetki Matrisi',
        aciklama: 'Modül bazlı okuma/yazma yetkilerini işaretleyin ve kaydedin.',
        renk: 'yesil',
      },
    ],
    ipucu: 'MÜŞTERİ rolü site müşterileri içindir; admin paneline erişemez.',
  },

  ayarlar: {
    baslik: 'Sistem Rehberi',
    altBaslik: 'Panel ve site durumu',
    bolumBaslik: 'Sistem Ayarları',
    kartlar: [
      {
        ikon: '🌐',
        baslik: 'Site Durumu',
        aciklama: 'Site aktif/pasif ve bakım modu buradan yönetilir. Bakım modunda ziyaretçilere mesaj gösterilir.',
        renk: 'mavi',
      },
      {
        ikon: '🔗',
        baslik: 'Domain',
        aciklama: 'Özel domain tanımlayabilirsiniz. DNS ayarları sunucu tarafında yapılmalıdır.',
        renk: 'mor',
      },
      {
        ikon: '📜',
        baslik: 'Log Saklama',
        aciklama: 'İşlem loglarının kaç gün tutulacağını belirleyin.',
        renk: 'camgobegi',
      },
    ],
  },

  loglar: {
    baslik: 'Log Rehberi',
    altBaslik: 'İşlem geçmişi',
    bolumBaslik: 'Log Takibi',
    kartlar: [
      {
        ikon: '📜',
        baslik: 'Log Kayıtları',
        aciklama: 'Panelde yapılan işlemler (kaydet, sil, modül açma) otomatik loglanır.',
        renk: 'mavi',
      },
      {
        ikon: '🔍',
        baslik: 'Filtreleme',
        aciklama: 'Modül veya işlem tipine göre logları inceleyin.',
        renk: 'mor',
      },
    ],
    ipucu: 'Görev çubuğundaki tray ikonundan veya alt aksiyon çubuğundan Loglar modülüne ulaşabilirsiniz.',
  },

  'sekme-yonetimi': {
    baslik: 'Sekme Yönetimi Rehberi',
    altBaslik: 'Panel sekmelerini özelleştirin',
    bolumBaslik: 'Sekme Yönetimi',
    kartlar: [
      {
        ikon: '📐',
        baslik: 'Sekme Boyutu',
        aciklama: 'Sekme genişliği ve yüksekliğini ayarlayın. Değişiklikler üst sekme çubuğunda anında yansır.',
        renk: 'mavi',
      },
      {
        ikon: '🔀',
        baslik: 'Yan Yana Görünüm',
        aciklama: 'İlgili sekmeleri gruplayarak aynı anda iki modülü yan yana açabilirsiniz.',
        renk: 'mor',
      },
      {
        ikon: '🪟',
        baslik: 'Ayrı Pencere',
        aciklama: 'Sekmeyi aşağı sürükleyerek yüzen pencere olarak ayırabilirsiniz.',
        renk: 'turuncu',
      },
    ],
    ipucu: 'Ayarlar tarayıcıda saklanır; farklı cihazlarda ayrı yapılandırma gerekir.',
  },

  'kisayol-ayarlari': {
    baslik: 'Kısayol Ayarları Rehberi',
    altBaslik: 'Klavye kısayollarını düzenleyin',
    bolumBaslik: 'Kısayol Ayarları',
    kartlar: [
      {
        ikon: '⌨️',
        baslik: 'Kısayol Atama',
        aciklama: 'Kaydet, önizle ve yardım gibi aksiyonlara özel tuş kombinasyonları tanımlayın.',
        renk: 'yesil',
      },
      {
        ikon: '📖',
        baslik: 'F1 Yardım',
        aciklama: 'Varsayılan F1 tuşu modül rehberini açar. İsterseniz farklı bir tuşa atayabilirsiniz.',
        renk: 'mavi',
      },
    ],
    ipucu: 'Çakışan kısayollar uyarı verir; kaydetmeden önce kontrol edin.',
  },

  'veri-yedekleme': {
    baslik: 'Yedekleme Rehberi',
    altBaslik: 'Veri güvenliği',
    bolumBaslik: 'Veri Yedekleme',
    kartlar: [
      {
        ikon: '💾',
        baslik: 'Yedek Oluşturma',
        aciklama: 'Mevcut site verilerinin anlık yedeğini alın. JSON formatında indirilebilir.',
        renk: 'yesil',
      },
      {
        ikon: '📥',
        baslik: 'Geri Yükleme',
        aciklama: 'Önceki yedek dosyasını seçerek verileri geri yükleyin. Dikkatli kullanın.',
        renk: 'turuncu',
      },
    ],
    ipucu: 'Düzenli yedek almayı alışkanlık haline getirin.',
  },
};

const VARSAYILAN_REHBER: ModulRehber = {
  baslik: 'Modül Rehberi',
  altBaslik: 'Bu modül hakkında genel bilgi',
  bolumBaslik: 'Yardım',
  kartlar: [
    {
      ikon: '⌨️',
      baslik: 'Kısayollar',
      aciklama: 'F1 ile bu rehberi açıp kapatabilirsiniz. ESC ile de kapanır.',
      renk: 'yesil',
    },
    {
      ikon: '💾',
      baslik: 'Kaydetme',
      aciklama: 'Değişikliklerinizi alt aksiyon çubuğundaki Kaydet ile kaydedin.',
      renk: 'mavi',
    },
    {
      ikon: '👁️',
      baslik: 'Önizleme',
      aciklama: 'Önizle butonu varsa public siteyi yeni sekmede açar.',
      renk: 'mor',
    },
  ],
};

export function modulRehberBul(modulId: string): ModulRehber {
  return ADMIN_MODUL_REHBERLERI[modulId] ?? VARSAYILAN_REHBER;
}
