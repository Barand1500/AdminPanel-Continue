import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { blogAyarlariBirlestir, blogOnizlemeListesi } from '@/types/blog';
import { HeroSlider } from '@/components/eticaret/HeroSlider';
import { GuvenSerit } from '@/components/eticaret/GuvenSerit';
import { BlogBolumu } from '@/components/blog/BlogBolumu';
import { BlogHizmetBolumu } from '@/components/blog/BlogHizmetBolumu';
import { PopupWidgetlar } from '@/components/widget/WidgetBolge';
import { KonumluWidgetBolge } from '@/components/konumluSlider/KonumluWidgetBolge';
import { anaSayfaWidgetlari } from '@/utils/widgetYerlesim';
import { konumluSliderlarSayfaFiltre } from '@/utils/konumluSliderYerlesim';

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
  const { widgetlar, site, bloglar, konumluSliderlar = [] } = useOutletContext<SitePublicData>();
  const blogAyarlari = blogAyarlariBirlestir(site.ayarlar);
  const blogOnizleme = blogOnizlemeListesi(bloglar, blogAyarlari.listeAdet);
  const anaWidgetlar = useMemo(() => anaSayfaWidgetlari(widgetlar), [widgetlar]);
  const sayfaSliderlar = useMemo(
    () => konumluSliderlarSayfaFiltre(konumluSliderlar, null),
    [konumluSliderlar]
  );

  const blogBolumu =
    blogAyarlari.anaSayfa && blogOnizleme.length > 0 ? (
      <BlogBolumu bloglar={blogOnizleme} />
    ) : null;

  return (
    <>
      <KonumluWidgetBolge
        widgetlar={anaWidgetlar}
        bolge="header_alti"
        konumluSliderlar={sayfaSliderlar}
      />

      <HeroSlider heroJson={site.ayarlar?.heroJson} />
      <GuvenSerit heroJson={site.ayarlar?.heroJson} />

      <KonumluWidgetBolge
        widgetlar={anaWidgetlar}
        bolge="slider_alti"
        konumluSliderlar={sayfaSliderlar}
      />

      {blogAyarlari.anaSayfaKonum === 'urunler-ustu' && blogBolumu}
      {blogAyarlari.anaSayfaKonum === 'widgetlar-ustu' && blogBolumu}

      <KonumluWidgetBolge
        widgetlar={anaWidgetlar}
        bolge="icerik_alani"
        konumluSliderlar={sayfaSliderlar}
      />
      <AnaSayfaHizmetBlog
        widgetlar={anaWidgetlar}
        blogOnizleme={blogOnizleme}
        hizmetlerAlani={blogAyarlari.hizmetlerAlani}
      />

      {blogAyarlari.anaSayfaKonum === 'widgetlar-alti' && blogBolumu}
      <KonumluWidgetBolge
        widgetlar={anaWidgetlar}
        bolge="footer_ustu"
        konumluSliderlar={sayfaSliderlar}
      />

      <PopupWidgetlar widgetlar={anaWidgetlar} />
    </>
  );
}
