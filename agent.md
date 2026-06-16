Bir multi-tenant CMS / web site yönetim paneli geliştirmeni istiyorum. Amaç: küçük ve orta ölçekli işletmelere web sitesi yapıp satmak. Başlangıçta herkese aynı görünen basit ve sabit bir frontend olacak. Daha sonra müşteri admin panelinden header, navbar, slider, içerik alanları, widgetlar, footer, renkler, logo, menüler ve sayfalar gibi bölümleri kod yazmadan değiştirebilecek.

Proje basit bir admin panel değil, satılabilir bir CMS ürünü olarak tasarlanmalı.

1. Başlangıçta basit bir frontend oluştur:

   * Ana sayfa
   * Hakkımızda
   * Ürünler / Hizmetler
   * İletişim
   * Header
   * Navbar
   * Slider
   * Ana içerik widget alanları
   * Footer
   * Mobil uyumlu responsive yapı
   * Temiz, sade, kurumsal görünüm

2. Admin panel `/gt-admin` adresinden açılmalı.

   * Login sistemi olmalı.
   * Kullanıcı rol sistemi olmalı.
   * Site sahibi kod yazmadan sitesini yönetebilmeli.
   * Panel sade ama güçlü olmalı.
   * Tema olarak Windows benzeri masaüstü arayüzü kullanılmalı.
   * Klasik sol sabit sidebar menü kullanılmamalı.

3. Admin panel Windows tarzı layout yapısına sahip olmalı:

   * Ekranın üst kısmında uygulama header’ı olmalı.
   * Header içinde logo, açık sekmeler, kullanıcı alanı ve bildirim alanı bulunmalı.
   * Sol tarafta sürekli açık duran uzun bir sidebar olmamalı.
   * Bunun yerine sol üstte veya header üzerinde bir “menü / başlat” ikonu olmalı.
   * Kullanıcı bu ikona bastığında Windows Başlat Menüsü benzeri bir panel açılmalı.
   * Açılan panelde arama kutusu bulunmalı.
   * Arama kutusundan modül, sayfa, ayar, ürün, widget, SEO kaydı gibi şeyler aranabilmeli.
   * Menü panelinde modüller kategori kategori listelenmeli.
   * Kullanıcı menüden bir modüle tıklayınca o modül üstte sekme olarak açılmalı.
   * Aynı anda birden fazla sekme açık kalabilmeli.
   * Sekmeler kapatılabilir, değiştirilebilir ve aktif sekme vurgulanabilir olmalı.
   * Bu yapı klasik web admin panelinden çok Windows uygulaması gibi hissettirmeli.

4. Windows tarzı menü yapısı şu mantıkta olmalı:

   Başlat / Menü ikonu açıldığında şu bölümler görünmeli:

   Arama:

   * Modül ara
   * Sayfa ara
   * Widget ara
   * Ayar ara
   * Ürün ara
   * SEO kaydı ara

   Hızlı Erişim:

   * Dashboard
   * Site Ayarları
   * Sayfalar
   * Widget Yönetimi
   * Menü Yönetimi
   * Medya Galerisi
   * SEO Ayarları

   Site Yönetimi:

   * Site Ayarları
   * Görünüm Ayarları
   * Menü Yönetimi
   * Header Yönetimi
   * Footer Yönetimi

   İçerik Yönetimi:

   * Sayfalar
   * Blog / Haberler
   * Medya Galerisi
   * Formlar

   Widget Yönetimi:

   * Slider Yönetimi
   * Ana Sayfa Widgetları
   * Hizmet Widgetları
   * Ürün Vitrin Widgetları
   * Referans Widgetları
   * Sık Sorulan Sorular Widgetları
   * Galeri Widgetları
   * İletişim Widgetları
   * Kampanya / Popup Widgetları

   Ürün Yönetimi:

   * Ürün Listesi
   * Kategoriler
   * Markalar
   * Özellikler
   * Yorumlar

   SEO Yönetimi:

   * Genel SEO
   * Sayfa SEO
   * Ürün SEO
   * Kategori SEO
   * Marka SEO

   Müşteri / Ajans Yönetimi:

   * Siteler
   * Müşteriler
   * Paketler
   * Kullanıcılar
   * Roller ve Yetkiler

   Sistem:

   * Dosya Yönetimi
   * Yedekler
   * Loglar
   * Ayarlar

5. Üst sekme sistemi:

   * Kullanıcı bir modüle tıkladığında üst header’da sekme açılmalı.
   * Örnek sekmeler:

     * Dashboard
     * Sayfalar
     * Widget Yönetimi
     * Header Yönetimi
     * SEO Ayarları
   * Sekmeler Windows / tarayıcı sekmesi gibi kapatılabilmeli.
   * Aktif sekme belirgin görünmeli.
   * Aynı modül tekrar açılırsa yeni sekme açmak yerine mevcut sekmeye geçilmeli.
   * Sekmeler arasında veri kaybı olmadan geçiş yapılmalı.
   * Kaydedilmemiş değişiklik varsa sekmede küçük uyarı ikonu görünmeli.

6. Alt sabit aksiyon barı:

   * Ekranın en altında sabit aksiyon barı olmalı.
   * Kaydet, Ekle, Sil, Kopyala, Önizle, Yayınla gibi butonlar her sayfada aynı yerde durmalı.
   * O sayfada kullanılmayan aksiyonlar pasif / soluk görünmeli.
   * Kullanıcı her ekranda buton aramamalı.
   * Aktif sekmeye göre alt aksiyon barı otomatik değişmeli.

   Örnek:
   Sayfalar ekranında:

   * Kaydet aktif
   * Yeni Ekle aktif
   * Sil aktif
   * Önizle aktif
   * Yayınla aktif

   SEO ekranında:

   * Kaydet aktif
   * Yeni Ekle pasif
   * Sil pasif
   * Önizle pasif
   * Yayınla pasif

7. Widget yönetimi en önemli kısım olacak.
   Her frontend bölümü widget mantığıyla yönetilmeli.

   Örnek widget tipleri:

   * Header Widget
   * Navbar Widget
   * Slider Widget
   * Hero Banner Widget
   * Hizmet Kartları Widget
   * Ürün Listeleme Widget
   * Kategori Widget
   * Referanslar Widget
   * SSS Widget
   * Galeri Widget
   * Harita Widget
   * İletişim Formu Widget
   * Popup Widget
   * Footer Widget

8. Her widget için şu alanlar olmalı:

   * Widget adı
   * Widget tipi
   * Bağlı olduğu sayfa
   * Sıra numarası
   * Aktif / pasif durumu
   * Başlık
   * Alt başlık
   * Açıklama
   * Görsel
   * Buton metni
   * Buton linki
   * Arka plan rengi
   * Yazı rengi
   * Mobilde göster / gizle
   * Masaüstünde göster / gizle
   * Yayın başlangıç tarihi
   * Yayın bitiş tarihi
   * JSON config alanı

9. Header yönetimi:

   * Logo değiştirilebilmeli.
   * Favicon değiştirilebilmeli.
   * Header tipi seçilebilmeli.
   * Sticky header aç/kapat olmalı.
   * Header arka plan rengi değiştirilebilmeli.
   * Telefon, mail, sosyal medya linkleri düzenlenebilmeli.

10. Navbar yönetimi:

* Menü linkleri eklenebilmeli.
* Menü sırası değiştirilebilmeli.
* Alt menü oluşturulabilmeli.
* Menü linki aktif/pasif yapılabilmeli.
* Menüde sayfa, kategori, özel URL seçilebilmeli.
* Drag & drop sıralama olmalı.

11. Slider yönetimi:

* Birden fazla slider eklenebilmeli.
* Görsel, başlık, açıklama, buton metni ve buton linki girilebilmeli.
* Sıralama yapılabilmeli.
* Mobil görsel ve masaüstü görsel ayrı yüklenebilmeli.
* Slider aktif/pasif yapılabilmeli.

12. Footer yönetimi:

* Firma adı
* Adres
* Telefon
* Mail
* WhatsApp
* Sosyal medya linkleri
* Footer menüleri
* KVKK / Gizlilik / Sözleşme linkleri
* Telif yazısı
  yönetilebilmeli.

13. Görünüm ayarları:

* Ana renk
* İkincil renk
* Font
* Buton tipi
* Kart tipi
* Resim gösterim şekli
* Resim kırp / sığdır seçeneği
* Site genişliği
* Tema modu
* Logo
* Favicon
* Popup görseli
* Üst kampanya görseli

14. Sayfa yönetimi:

* Yeni sayfa eklenebilmeli.
* Sayfa başlığı
* URL / slug
* İçerik editörü
* Kapak görseli
* SEO title
* SEO description
* Yayın durumu
* Menüde göster/gizle
* Sayfaya widget ekleme
* Sayfa içindeki widget sıralaması
  olmalı.

15. SEO yönetimi:

* Genel SEO
* Sayfa SEO
* Kategori SEO
* Ürün SEO
* Marka SEO
  alanları olmalı.

Her SEO kaydı için:

* URL
* Title
* Description
* Keywords
* Canonical URL
* Index / noindex
* Sitemap dahil / hariç
* Open Graph görseli
  olmalı.

16. Medya yönetimi:

* Görsel yükleme
* PDF yükleme
* Dosya klasörü oluşturma
* Görsel önizleme
* WebP dönüştürme
* Alt text girme
* Kullanıldığı yeri görme
  olmalı.

17. Çoklu müşteri / multi-tenant yapı:

* Her müşterinin ayrı sitesi olmalı.
* Her kayıt siteId / tenantId ile ayrılmalı.
* Bir müşterinin verisi diğer müşteriye karışmamalı.
* Ajans admin birden fazla siteyi yönetebilmeli.
* Müşteri admin sadece kendi sitesini yönetebilmeli.

18. Rol sistemi:
    Roller:

* Super Admin
* Ajans Admin
* Müşteri Admin
* Editör
* SEO Editörü
* Sadece Görüntüleme

Yetkiler:

* Görüntüleme
* Ekleme
* Düzenleme
* Silme
* Yayınlama
* Dosya yükleme
* SEO düzenleme
* Tema düzenleme

Proje profesyonel yazılımcıların geliştirebileceği şekilde modüler mimariyle kurulmalı.Frontend ve  Backend gibi İngilizce isimler kullanılabilir. Ancak frontend component isimleri, sayfa isimleri ve domain’e yakın dosya isimleri Türkçe mantıkta ama Türkçe karakter kullanmadan yazılmalı.

Türkçe karakter kullanılmayacak:
ş yerine s
ç yerine c
ğ yerine g
ü yerine u
ö yerine o
ı yerine i

Örnek:
Görünüm Ayarları -> GorunumAyarlari
Menü Yönetimi -> MenuYonetimi
Sayfa Kartı -> SayfaKarti
Widget Listesi -> WidgetListesi
Kullanıcı Yetkileri -> KullaniciYetkileri

Component yapısı özellikle parçalı olmalı. Büyük sayfaların içine her şey yazılmamalı. Sayfalar sadece container gibi davranmalı; asıl parçalar components ve features klasörlerinde tutulmalı.

Örnek doğru kullanım:

WidgetYonetimiSayfasi.tsx
- WidgetListesi componentini çağırır.
- WidgetDuzenleyici componentini çağırır.
- WidgetOnizleme componentini çağırır.
- API işlemlerini doğrudan sayfada yapmaz.
- widgetService veya widgetApi üzerinden veri alır.

Yanlış kullanım:
- Tüm tablo, form, API isteği, modal ve validasyonun tek dosyada yazılması.
- 1000 satırlık tek component oluşturulması.
- Her sayfanın kendi içinde tekrar tekrar buton, tablo, modal yazması.

Frontend component kuralları:
- Ortak kullanılan her şey components/ortak içine alınmalı.
- Form elemanları components/form altında tutulmalı.
- Widget ile ilgili parçalar components/widget altında tutulmalı.
- Medya ile ilgili parçalar components/medya altında tutulmalı.
- SEO ile ilgili parçalar components/seo altında tutulmalı.
- İş mantığı features klasöründe tutulmalı.
- API çağrıları feature bazlı ayrılmalı.
- Hook’lar hooks klasöründe tutulmalı.
- Yardımcı fonksiyonlar utils klasöründe tutulmalı.

Backend mimari kuralları:
- Controller içinde iş kuralı yazılmamalı.
- Controller sadece request alıp service’e göndermeli.
- Service katmanı iş kurallarını yönetmeli.
- Repository sadece veritabanı işlemlerini yapmalı.
- Entity dosyaları Domain katmanında tutulmalı.
- DTO dosyaları Application katmanında tutulmalı.
- Middleware dosyaları WebApi katmanında tutulmalı.
- Tenant kontrolü middleware veya service seviyesinde merkezi yapılmalı.
- Her sorguda tenantId / siteId kontrolü unutulmamalı.

İsimlendirme kuralları:
- Klasör isimleri İngilizce olabilir(sadece çok popüler olan ve akılda öyle kalanlar).
- Component, page, DTO, entity ve domain dosyaları Türkçe mantıkta ama Türkçe karaktersiz olmalı.
- Dosya isimleri PascalCase olmalı.
- Hook isimleri camelCase olmalı.
- Service, api ve utils dosyaları camelCase olabilir.
- Backend class isimleri PascalCase olmalı.

Örnek component isimleri:
- BaslatMenu.tsx
- BaslatMenuArama.tsx
- UstSekmeCubugu.tsx
- AltAksiyonCubugu.tsx
- WidgetDuzenleyici.tsx
- WidgetOnizleme.tsx
- SayfaDuzenleFormu.tsx
- MedyaSecici.tsx
- SeoFormu.tsx
- MenuAgaci.tsx
- GorunumAyarlariFormu.tsx

Bu mimari MVP için yeterince profesyonel olmalı, ama ileride ürün yönetimi, kampanya, çoklu dil, tema marketi, gelişmiş site builder ve e-ticaret özellikleri eklenebilecek kadar genişletilebilir tasarlanmalı.


## Dosya Adlandırma Kuralları

- Bileşenler: `PascalCase.tsx` → `MenuBuilder.tsx`
- Hooks: `useCamelCase.ts` → `useMenuItems.ts`
- API rotaları: `kebab-case` → `/api/menu-items`
- Veritabanı modelleri: `PascalCase` → `MenuItem`, `SiteConfig`
- Ortam değişkenleri: `SCREAMING_SNAKE_CASE` → `DATABASE_URL`


 Öncelik:
    İlk aşamada gelişmiş e-ticaret değil, widget yönetimli kurumsal site CMS’i yapılacak.
    Başlangıç frontend sabit olacak ama admin panelden değiştirilebilir alanlar hazırlanacak.
    Amaç, ileride her müşteriye farklı görünüm ve içerik sağlayabilecek esnek bir sistem kurmak.

Projeyi klasik sol sidebar’lı admin panel olarak tasarlama. Windows uygulaması gibi çalışan, başlat menüsü benzeri açılır menüsü olan, üstte sekmeli çalışma alanı bulunan ve altta sabit aksiyon barı olan bir CMS admin paneli olarak tasarla.