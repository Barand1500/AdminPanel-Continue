import { useOutletContext, useSearchParams } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { BlogKart } from '@/components/blog/BlogKart';
import { siteBlogYazilariHazirla } from '@/utils/blogKaruselYardimci';
import { BlogSidebar } from '@/components/blog/BlogSidebar';

export function BlogSayfasi() {
  const veri = useOutletContext<SitePublicData>();
  const [aramaParametreleri] = useSearchParams();
  const { bloglar, widgetlar } = veri;
  const tumBloglar = siteBlogYazilariHazirla(bloglar, widgetlar);
  const arama = aramaParametreleri.get('ara')?.trim().toLocaleLowerCase('tr-TR') ?? '';
  const kategori = aramaParametreleri.get('kategori') ?? '';
  const ay = aramaParametreleri.get('ay') ?? '';
  const gosterilecekBloglar = tumBloglar.filter((blog) => (!arama || `${blog.baslik} ${blog.ozet ?? ''}`.toLocaleLowerCase('tr-TR').includes(arama)) && (!kategori || blog.kategori === kategori) && (!ay || blog.olusturma.startsWith(ay)));

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-violet-700 to-fuchsia-800 py-16 text-white">
        <div className="container-site relative">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
            Blog
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Blog & Haberler</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Güncel haberler, duyurular ve içeriklerimizi buradan takip edebilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
          {gosterilecekBloglar.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
              <p className="text-4xl">📰</p>
              <p className="mt-4 text-lg font-semibold text-slate-700">Henüz yayınlanmış yazı yok</p>
              <p className="mt-1 text-sm text-slate-500">Yeni içerikler yakında burada olacak.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gosterilecekBloglar.map((yazi) => (
                <BlogKart key={yazi.id} yazi={yazi} />
              ))}
            </div>
          )}</div>
          <BlogSidebar veri={veri} />
        </div>
      </section>
    </>
  );
}
