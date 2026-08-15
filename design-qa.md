# Design QA

## Referans ve kapsam

- Referans: Kullanıcının paylaştığı ekran görüntüleri ve [Safir İmza demo](https://safirdemo.com/imza/).
- Canlı sayfanın bölüm yapısı incelendi: Hakkımızda, ürün vitrini, hizmetler, ürün grupları, ekip, haberler, galeri, iletişim ve logo bandı.
- Uygulanan widget görünüm eşleşmeleri:
  - `SITE_HAKKINDA:bento-hakkimizda` — Kurumsal Tanıtım
  - `HIZMET_KARTLARI:masonry-duvar` — Dengeli Hizmet Kartları
  - `GORSEL_ETIKET_KARTLARI:masonry-galeri` — Ürün Grubu Kartları
  - `GORSEL_ETIKET_KARTLARI:flip-kart` — Öne Çıkan Ürün Vitrini
  - `EKIP_KARUSEL:marquee-spotlight` — Portre Kart Karuseli
  - `BLOG_KARUSEL:overlay-sinematik` — Kurumsal Haber Kartları
  - `GALERI:karusel-merkez` — Fotoğraf Kart Karuseli
  - `HARITA:yan-ikon-liste` — İletişim Bilgi + Harita
  - `MARKA_SERIDI:cift-serit` — Logo Kart Karuseli

## Kod ve davranış kontrolleri

- Hakkımızda görselinin köşe kırpması kapsayıcı ve görsel çocukta zorunlu olarak dört köşeye uygulanıyor.
- Öne çıkan ürün vitrini masaüstünde dört küçük kartı gösteren yatay, ok kontrollü bir şerit; servis ve ürün grupları ise üç büyük görsel + beyaz başlık altlığıdır.
- HARITA widgetındaki `İletişim Bilgi + Harita` görünümü, altı düzenlenebilir iletişim kartını sol tarafta ve gölgeli haritayı sağ tarafta gösterir.
- Yeni Marka Şeridi widgetları Logo Kart Karuseli görünümüyle başlar; seed, eksikse alt bölüme örnek bir logo karuseli de ekler.
- Ekip kartındaki kimlik katmanı yapılandırmadaki açık vurgu renginden bağımsız, yalnız alt bölümde koyu lacivert degrade kullanıyor.
- Ürün vitrini için rozet, kısa açıklama, eski fiyat ve fiyat alanları yönetim panelinden düzenlenebiliyor.
- Haber kartlarında yayın tarihi, özet ve bağlantı metni düzenlenebiliyor.
- Galeri ve logo kart karusellerindeki ileri/geri kontrolleri klavye odağına sahip düğmeler.
- `npm run build` başarılı: backend TypeScript, frontend TypeScript ve Vite üretim derlemesi tamamlandı.
- Hakkımızda ve Sayılarla Biz içerik panellerinde emoji/metin girişi yerine isimleri görünen çizgi ikon seçici bulunur; eski kayıtlar geriye uyumlu çalışır.
- Renk akışı ayrıştırıldı: üst etiket vurgu rengini, ana başlık başlık rengini, açıklama/kart metni metin rengini kullanır. Yeni widget varsayılanları beyaz zemin, `#111827` başlık/vurgu ve `#4b5563` metindir.
- İki başlıklı desteklenen widgetlarda üst başlık alt çizgisi Görünüm ayarından açılıp kapatılabilir; sayaç, ekip, yorum, blog ve galeri bu ayarı doğrudan render eder.
- Hizmet kartları uzun metni satır kırarak doğal yüksekliğine büyütür. İletişim CTA'sında arka plan görseli ile birincil butonun sol ikonu ayrı ayarlanabilir.
- Yorum, blog, galeri ve fiyat kartları renk ayarlarını kullanır; logo karuseli ve hızlı logo şeridinin dış zemini şeffaftır.
- Çizgi ikon seçici, tetikleyicinin hemen altında açılan ve satırın yüksekliğini bozmayan bir açılır menüdür. Harita iletişim kartları da aynı seçiciyi kullanır.
- Portre ekip kartına tıklanınca erişilebilir detay penceresi açılır: görsel solda, üye bilgileri sağdadır; Escape ve kapat düğmesi desteklenir.
- Yorum karuseli başlığı ve yorum metni ortalandı. `imza-kurumsal` header ile `kurumsal` footer koyu mavi kurumsal hiyerarşiye göre güncellendi.

## Görsel QA durumu

- Bu oturumda kullanılabilir bir tarayıcı yüzeyi bulunmadığı için yerel uygulamanın ekran görüntüsü alınamadı.
- Bu nedenle aynı viewportta referans ve uygulama yan yana piksel düzeyi karşılaştırılamadı.
- Tarayıcı erişimi sağlandığında masaüstü ve mobilde özellikle fotoğraf kırpması, kart aralıkları, koyu ekip degradeleri ve logo kartlarının görünür sayısı tekrar doğrulanmalı.

final result: blocked
