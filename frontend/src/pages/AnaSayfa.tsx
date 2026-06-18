import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { blogAyarlariBirlestir, blogOnizlemeListesi } from '@/types/blog';
import { HeroSlider } from '@/components/eticaret/HeroSlider';
import { GuvenSerit } from '@/components/eticaret/GuvenSerit';
import { BlogBolumu } from '@/components/blog/BlogBolumu';
import { BlogHizmetBolumu } from '@/components/blog/BlogHizmetBolumu';
import { PopupWidgetlar, WidgetBolge } from '@/components/widget/WidgetBolge';
import { anaSayfaWidgetlari } from '@/utils/widgetYerlesim';

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
  const { widgetlar, site, bloglar } = useOutletContext<SitePublicData>();
  const blogAyarlari = blogAyarlariBirlestir(site.ayarlar);
  const blogOnizleme = blogOnizlemeListesi(bloglar, blogAyarlari.listeAdet);
  const anaWidgetlar = useMemo(() => anaSayfaWidgetlari(widgetlar), [widgetlar]);

  const blogBolumu =
    blogAyarlari.anaSayfa && blogOnizleme.length > 0 ? (
      <BlogBolumu bloglar={blogOnizleme} />
    ) : null;

  return (
    <>
      <WidgetBolge widgetlar={anaWidgetlar} bolge="header_alti" />

      <HeroSlider heroJson={site.ayarlar?.heroJson} />
      <GuvenSerit heroJson={site.ayarlar?.heroJson} />

      <WidgetBolge widgetlar={anaWidgetlar} bolge="slider_alti" />

      {blogAyarlari.anaSayfaKonum === 'urunler-ustu' && blogBolumu}
      {blogAyarlari.anaSayfaKonum === 'widgetlar-ustu' && blogBolumu}

      <WidgetBolge widgetlar={anaWidgetlar} bolge="icerik_alani" />
      <AnaSayfaHizmetBlog
        widgetlar={anaWidgetlar}
        blogOnizleme={blogOnizleme}
        hizmetlerAlani={blogAyarlari.hizmetlerAlani}
      />

      {blogAyarlari.anaSayfaKonum === 'widgetlar-alti' && blogBolumu}
      <WidgetBolge widgetlar={anaWidgetlar} bolge="footer_ustu" />

      <PopupWidgetlar widgetlar={anaWidgetlar} />
    </>
  );
}
