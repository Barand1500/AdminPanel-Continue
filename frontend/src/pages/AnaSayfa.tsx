import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { blogAyarlariBirlestir, blogOnizlemeListesi } from '@/types/blog';
import { HeroSlider } from '@/components/eticaret/HeroSlider';
import { GuvenSerit } from '@/components/eticaret/GuvenSerit';
import { UrunBolumu } from '@/components/eticaret/UrunBolumu';
import { BlogBolumu } from '@/components/blog/BlogBolumu';
import { BlogHizmetBolumu } from '@/components/blog/BlogHizmetBolumu';
import { PopupWidgetlar, WidgetBolge } from '@/components/widget/WidgetBolge';

function AnaSayfaHizmetBlog({
  widgetlar,
  blogOnizleme,
  hizmetlerAlani,
}: {
  widgetlar: SitePublicData['widgetlar'];
  blogOnizleme: ReturnType<typeof blogOnizlemeListesi>;
  hizmetlerAlani: boolean;
}) {
  const hizmetWidgetVar = widgetlar.some((w) => w.aktif && w.tip === 'HIZMET_KARTLARI');
  const hizmetBlog =
    hizmetlerAlani && blogOnizleme.length > 0 && hizmetWidgetVar ? (
      <BlogHizmetBolumu bloglar={blogOnizleme} />
    ) : null;

  if (!hizmetBlog) return null;
  return hizmetBlog;
}

export function AnaSayfa() {
  const { widgetlar, urunler, site, bloglar } = useOutletContext<SitePublicData>();
  const blogAyarlari = blogAyarlariBirlestir(site.ayarlar);
  const blogOnizleme = blogOnizlemeListesi(bloglar, blogAyarlari.listeAdet);

  const yeniUrunler = urunler.filter((u) => u.yeni);
  const cokSatanlar = urunler.filter((u) => u.cokSatan);

  const blogBolumu =
    blogAyarlari.anaSayfa && blogOnizleme.length > 0 ? (
      <BlogBolumu bloglar={blogOnizleme} />
    ) : null;

  const urunBloklari = (
    <>
      {yeniUrunler.length > 0 ? (
        <UrunBolumu baslik="Yeni Ürünler" urunler={yeniUrunler} filtre="yeni" />
      ) : null}
      {cokSatanlar.length > 0 ? (
        <UrunBolumu baslik="Çok Satanlar" urunler={cokSatanlar} filtre="cokSatan" />
      ) : null}
      {urunler.length > 0 && !yeniUrunler.length && !cokSatanlar.length && (
        <UrunBolumu baslik="Ürünlerimiz" urunler={urunler} />
      )}
    </>
  );

  return (
    <>
      <WidgetBolge widgetlar={widgetlar} bolge="header_alti" />

      <HeroSlider heroJson={site.ayarlar?.heroJson} />
      <GuvenSerit heroJson={site.ayarlar?.heroJson} />

      <WidgetBolge widgetlar={widgetlar} bolge="slider_alti" />

      {blogAyarlari.anaSayfaKonum === 'urunler-ustu' && blogBolumu}
      <WidgetBolge widgetlar={widgetlar} bolge="urunler_ustu" />
      {urunBloklari}
      {blogAyarlari.anaSayfaKonum === 'widgetlar-ustu' && blogBolumu}

      <WidgetBolge widgetlar={widgetlar} bolge="urunler_alti" />
      <AnaSayfaHizmetBlog
        widgetlar={widgetlar}
        blogOnizleme={blogOnizleme}
        hizmetlerAlani={blogAyarlari.hizmetlerAlani}
      />

      {blogAyarlari.anaSayfaKonum === 'widgetlar-alti' && blogBolumu}
      <WidgetBolge widgetlar={widgetlar} bolge="footer_ustu" />

      <PopupWidgetlar widgetlar={widgetlar} />
    </>
  );
}
