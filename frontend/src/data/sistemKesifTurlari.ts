import type { SistemKesifTur } from '@/types/sistemKesif';

const MODUL_HEDEF = {
  hedef: 'modul-icerik' as const,
  hedefYedek: ['modul-kabuk', 'modul-yukleniyor'] as string[],
};

const panelAdimlari = [
  {
    id: 'hosgeldin',
    baslik: 'Hoş Geldiniz — Buradan Başlayalım',
    aciklama:
      'Bu panel, web sitenizin tüm içeriğini, görünümünü ve ayarlarını yönettiğiniz merkezdir. Hiç deneyiminiz olmasa bile adım adım ilerleyerek her şeyi öğrenebilirsiniz.',
    ipuclari: [
      'İleri butonu ile bir sonraki adıma geçin',
      'İstediğiniz zaman "Turu Kapat" diyebilirsiniz',
      'ESC tuşu da turu sonlandırır',
    ],
  },
  {
    id: 'baslat',
    hedef: 'baslat-menu',
    okYonu: 'sag' as const,
    baslik: 'Başlat Menüsü — Tüm Modüller Burada',
    aciklama:
      'Sol üstteki dört kareli simgeye tıklayınca tüm yönetim modülleri açılır. Sayfa eklemek, blog yazmak, SEO ayarlamak veya kullanıcı eklemek için önce buraya gelirsiniz.',
    ipuclari: [
      'Menüde arama kutusu ile modül adı yazarak hızlı bulun',
      'Modüller kategorilere ayrılmıştır: Hızlı Erişim, Site Yönetimi, İçerik…',
    ],
  },
  {
    id: 'sekmeler',
    hedef: 'sekme-cubugu',
    okYonu: 'alt' as const,
    baslik: 'Sekmeler — Açık Sayfalarınız',
    aciklama:
      'Birden fazla modül açtığınızda üstte sekme olarak görünür. Tıpkı tarayıcı sekmeleri gibi çalışır: istediğiniz sekmeye tıklayarak geçiş yapın, X ile kapatabilirsiniz.',
    ipuclari: [
      'Sekmeleri sürükleyerek sıralayabilirsiniz',
      'İki sekmeyi üst üste bırakarak gruplayabilirsiniz',
      'Yeni açılan sekme listenin başına eklenir',
    ],
  },
  {
    id: 'icerik',
    hedef: 'modul-icerik',
    okYonu: 'ust' as const,
    baslik: 'Çalışma Alanı — Asıl İş Burada Yapılır',
    aciklama:
      'Seçtiğiniz modülün listesi, formları ve düzenleme ekranı bu geniş alanda görünür. Sol tarafta liste, sağ tarafta düzenleme paneli olan modüller çok yaygındır.',
    ipuclari: [
      'Değişiklik yaptıktan sonra mutlaka Kaydet\'e basın',
      'Bazı modüllerde sekmeler (üst menü) farklı ayar grupları sunar',
    ],
  },
  {
    id: 'aksiyon',
    hedef: 'aksiyon-cubugu',
    okYonu: 'ust' as const,
    baslik: 'Alt Çubuk — Kaydet, Ekle, Sil',
    aciklama:
      'Ekranın en altındaki bu çubukta o anki modüle ait işlem butonları görünür. Kaydet butonu genelde mavi renktedir; değişikliklerinizi kaydetmeyi unutmayın.',
    ipuclari: [
      'Ctrl+S ile de kaydedebilirsiniz (Kısayol Ayarlarından değiştirilebilir)',
      'Sağ taraftaki ? simgesi o sayfanın kısa yardım rehberini açar',
      'Bildirim zili yeni işlemleri gösterir',
    ],
  },
];

const dashboardAdimlari = [
  {
    id: 'dash-kpi',
    hedef: 'dash-kpi',
    modulId: 'dashboard',
    okYonu: 'alt' as const,
    baslik: 'Sayılar — Sitenizin Durumu',
    aciklama:
      'Yayındaki sayfa, blog, form, widget ve medya kartları burada durur. Bir karta tıklayınca ilgili modül açılır.',
    ipuclari: ['Bekleyen sayısı, okunmamış form yanıtlarını gösterir'],
  },
  {
    id: 'dash-hizli',
    hedef: 'dash-hizli-erisim',
    modulId: 'dashboard',
    okYonu: 'ust' as const,
    baslik: 'Modüller — Sık Kullandıklarınız',
    aciklama:
      'En çok girdiğiniz sayfalara tek tıkla geçin. Düzenle ile listede hangilerinin duracağını siz seçersiniz.',
    ipuclari: ['Profil ayarlarından da bu liste düzenlenir'],
  },
  {
    id: 'site-onizle',
    hedef: 'site-onizle',
    modulId: 'dashboard',
    okYonu: 'alt' as const,
    baslik: 'Siteyi Önizle',
    aciklama:
      'Yaptığınız değişikliklerin ziyaretçilere nasıl göründüğünü kontrol etmek için canlı siteyi yeni sekmede açın. Her modülde de bu link bulunur.',
  },
];

export const SISTEM_KESIF_TURLARI: SistemKesifTur[] = [
  {
    id: 'tam-tur',
    baslik: 'Tam Panel Turu',
    aciklama: 'Panel arayüzü ve dashboard — sıfırdan başlayanlar için.',
    ikon: '🚀',
    adimlar: [
      ...panelAdimlari,
      ...dashboardAdimlari,
      {
        id: 'bildirim',
        hedef: 'bildirim-tray',
        okYonu: 'ust' as const,
        baslik: 'Bildirimler ve Araçlar',
        aciklama:
          'Sağ alttaki simgeler: zil (bildirimler), belge (log kayıtları), indirme (yedekleme). Panelde ne olduğunu takip etmek için kullanılır.',
      },
      {
        id: 'bitis',
        baslik: 'Tebrikler — Tur Bitti!',
        aciklama:
          'Temel panel yapısını öğrendiniz. Belirli bir konuyu derinlemesine görmek için "Sistemi Keşfet"ten o konuyu seçerek mini tur başlatabilirsiniz.',
        ipuclari: ['Sayfalar, SEO, Widget gibi konular için ayrı turlar mevcut'],
      },
    ],
  },
  {
    id: 'panel-arayuzu',
    baslik: 'Panel Arayüzü',
    aciklama: 'Menü, sekmeler, çalışma alanı ve kaydetme çubuğu.',
    ikon: '🖥️',
    adimlar: panelAdimlari,
  },
  {
    id: 'dashboard',
    baslik: 'Dashboard',
    aciklama: 'Ana sayfa: sayılar, son hareket ve modüller.',
    ikon: '📊',
    adimlar: [
      {
        id: 'dash-giris',
        modulId: 'dashboard',
        baslik: 'Dashboard — Başlangıç Noktanız',
        aciklama:
          'Panele her girdiğinizde buradan başlarsınız. Sitenizin genel durumunu görür, sık kullandığınız modüllere hızlıca gidersiniz.',
        ipuclari: ['Sol menüden Dashboard\'a her zaman dönebilirsiniz'],
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
        baslik: 'İçerik Modülleri Nerede?',
        aciklama:
          'Başlat menüsünde "İçerik Yönetimi" bölümünde Blog ve Formlar var. "Hızlı Erişim" bölümünde Sayfalar ve Widget Yönetimi bulunur. Şimdi her birini tek tek ziyaret edeceğiz.',
        ipuclari: ['Menü açıkken arama kutusuna "sayfa" yazarak filtreleyebilirsiniz'],
      },
      {
        id: 'sayfalar',
        ...MODUL_HEDEF,
        modulId: 'sayfalar',
        menuKapat: true,
        okYonu: 'alt' as const,
        baslik: 'Sayfa Yönetimi',
        aciklama:
          'Sitenizdeki tüm sayfaları buradan oluşturur ve düzenlersiniz. Sol listeden sayfa seçin; sağda başlık, URL (slug), içerik editörü ve menü ayarlarını bulursunuz.',
        ipuclari: [
          'Yeni sayfa: alttaki + veya üst çubuktaki Ekle',
          'Alt sayfa: bir sayfanın altına hiyerarşik sayfa ekleyebilirsiniz',
          'Yayında olmayan sayfalar ziyaretçiye görünmez',
        ],
      },
      {
        id: 'widgetlar',
        ...MODUL_HEDEF,
        modulId: 'widget-yonetimi',
        okYonu: 'alt' as const,
        baslik: 'Widget Yönetimi',
        aciklama:
          'Sayfalardaki bileşenleri buradan yönetin. Yeni Widget’ta önce görsel kartlardan tipi seçin; listeden tıklayınca düzenleme açılır. Aktif anahtarı sitede gösterir. Önizle kartı modalda açar.',
        ipuclari: [
          'Listeden tıklayınca düzenleme açılır',
          'Aktif anahtarı widgetı sitede gösterir',
          'Önizle ile sonucu modalda kontrol edin',
        ],
      },
      {
        id: 'blog',
        ...MODUL_HEDEF,
        modulId: 'blog',
        okYonu: 'alt' as const,
        baslik: 'Blog / Haberler',
        aciklama:
          'Haber ve blog yazılarını buradan yönetin. Listeden seçip Düzenle; Yeni Yazı ile ekleyin. Yayında anahtarı yazıyı sitede gösterir. Görünüm sekmesinde menü ve ana sayfa bandını ayarlayın. Önizle kartı modalda açar.',
        ipuclari: [
          'Slug boş bırakılırsa başlıktan otomatik oluşur',
          'SEO başlık ve açıklama her yazı için ayrı ayarlanabilir',
        ],
      },
      {
        id: 'formlar',
        ...MODUL_HEDEF,
        modulId: 'formlar',
        okYonu: 'alt' as const,
        baslik: 'Form Yönetimi',
        aciklama:
          'İletişim ve başvuru formlarını buradan yönetin. Listeden seçip Düzenle; Yeni Form ile ekleyin. Alanlar, yerleşim ve bildirim editörde. Gönderimler ayrı sekmede. Önizle formu modalda test eder.',
        ipuclari: [
          'Yayında anahtarı formu sitede gösterir',
          'Bildirim e-postası ile yeni gönderimde haberdar olun',
        ],
      },
    ],
  },
  {
    id: 'site-gorunumu',
    baslik: 'Site Görünümü',
    aciklama: 'Header, hero, footer ve menü.',
    ikon: '🏠',
    adimlar: [
      {
        id: 'site-menu',
        hedef: 'baslat-menu',
        menuAc: true,
        okYonu: 'sag' as const,
        baslik: 'Site Yönetimi Kategorisi',
        aciklama:
          'Başlat menüsünde "Site Yönetimi" altında sitenin görsel iskeletini oluşturan modüller vardır: üst menü (Header), ana banner (Hero), alt bilgi (Footer) ve menü.',
      },
      {
        id: 'header',
        ...MODUL_HEDEF,
        modulId: 'header',
        menuKapat: true,
        okYonu: 'alt' as const,
        baslik: 'Header — Üst Menü',
        aciklama:
          'Ziyaretçilerin sitede en üstte gördüğü alan. Header Tipleri galerisinden bir düzen seçin, Düzenleme hapından logo ve bant ayarlarını yapın. Önizle üst menüyü modalda gösterir.',
      },
      {
        id: 'hero',
        ...MODUL_HEDEF,
        modulId: 'hero',
        okYonu: 'alt' as const,
        baslik: 'Hero — Ana Banner',
        aciklama:
          'Anasayfanın büyük giriş alanı. Listeden slider seçip Düzenle; Yeni Ekle ile slayt ekleyin. Güven Kartları ayrı sekmede. Önizle bannerı modalda gösterir.',
      },
      {
        id: 'footer',
        ...MODUL_HEDEF,
        modulId: 'footer',
        okYonu: 'alt' as const,
        baslik: 'Footer — Alt Bilgi',
        aciklama:
          'Sitenin en altındaki alan. Footer Tipleri galerisinden bir düzen seçin, Düzenleme hapından marka ve kolonları ayarlayın. Önizle alt bilgiyi modalda gösterir.',
      },
      {
        id: 'kategoriler',
        ...MODUL_HEDEF,
        modulId: 'kategoriler',
        okYonu: 'alt' as const,
        baslik: 'Menü Yönetimi',
        aciklama:
          'Header’daki menüyü ağaç olarak yönetin. Listeden seçip Düzenle; Yeni Alt Ekle ile 3 seviyeye kadar alt menü ekleyin.',
      },
    ],
  },
  {
    id: 'seo-yayin',
    baslik: 'SEO ve Yayın',
    aciklama: 'Google görünürlüğü ve genel site ayarları.',
    ikon: '🔍',
    adimlar: [
      {
        id: 'seo-giris',
        modulId: 'seo',
        baslik: 'SEO Nedir, Neden Önemli?',
        aciklama:
          'SEO (Arama Motoru Optimizasyonu), sitenizin Google\'da nasıl göründüğünü belirler. Title ve description doğru yazılırsa daha fazla ziyaretçi gelir.',
        ipuclari: ['Şimdi SEO modülünü birlikte açacağız — birkaç saniye bekleyin'],
      },
      {
        id: 'seo-modul',
        ...MODUL_HEDEF,
        modulId: 'seo',
        okYonu: 'alt' as const,
        baslik: 'SEO Ayarları Modülü',
        aciklama:
          'Genel sekmesinde site geneli ayarlar vardır. Kategori ve Sabit Sayfa listesinden bir URL seçip Düzenle ile title/description girilir. Önizle Google sonucunu modalda gösterir.',
        ipuclari: [
          '301 yönlendirme: düzenleme ekranında Yeni Ekle ile eski adresi yönlendirin',
          'Değişiklikler aksiyon çubuğundaki Kaydet ile kaydedilir',
        ],
      },
      {
        id: 'site-ayarlari',
        ...MODUL_HEDEF,
        modulId: 'site-ayarlari',
        okYonu: 'alt' as const,
        baslik: 'Site Ayarları',
        aciklama:
          'Logo, site adı, ana renkler, telefon, e-posta, adres ve sosyal medya linkleri burada toplanır. Tüm sitede ortak kullanılır.',
      },
    ],
  },
  {
    id: 'kullanici-sistem',
    baslik: 'Kullanıcı ve Sistem',
    aciklama: 'Yetkiler, panel davranışı ve yedekleme.',
    ikon: '⚙️',
    adimlar: [
      {
        id: 'kullanicilar',
        ...MODUL_HEDEF,
        modulId: 'kullanicilar',
        okYonu: 'alt' as const,
        baslik: 'Kullanıcı Yönetimi',
        aciklama:
          'Panele giriş yapabilecek kişileri ekleyin. Her kullanıcıya bir rol atarsınız; rol ne yapabileceğini belirler.',
        ipuclari: ['Şifre güvenli olmalı; kullanıcıya e-posta ile bilgi verin'],
      },
      {
        id: 'roller',
        ...MODUL_HEDEF,
        modulId: 'roller',
        okYonu: 'alt' as const,
        baslik: 'Roller ve Yetkiler',
        aciklama:
          'Örneğin "Editör" yalnızca içerik modüllerini, "Admin" her şeyi görebilir. Her rol için modül bazında izin işaretleyin.',
      },
      {
        id: 'sekme-yonetimi',
        ...MODUL_HEDEF,
        modulId: 'sekme-yonetimi',
        okYonu: 'alt' as const,
        baslik: 'Sekme Yönetimi',
        aciklama:
          'Üst sekme çubuğunun boyutunu, yazı tipini ve davranışını (yan yana açma, sürükleyince ayırma vb.) buradan kişiselleştirin.',
      },
      {
        id: 'sistem-tray',
        hedef: 'gorev-tray',
        modulId: 'dashboard',
        hedefYedek: ['aksiyon-cubugu'],
        okYonu: 'ust' as const,
        baslik: 'Log ve Yedekleme',
        aciklama:
          'Alt çubuktaki belge simgesi işlem geçmişini (log), indirme simgesi veri yedeklemeyi açar. Düzenli yedek almak veri kaybını önler.',
      },
    ],
  },
];

export function sistemKesifTurBul(id: string): SistemKesifTur | undefined {
  return SISTEM_KESIF_TURLARI.find((t) => t.id === id);
}
