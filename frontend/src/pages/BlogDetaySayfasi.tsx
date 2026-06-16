import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogDetayGetir } from '@/features/site/blogApi';
import type { BlogYazisiDetay } from '@/types/blog';
import { blogTarihFormatla } from '@/types/blog';
import { medyaTamUrl } from '@/features/admin/medyaApi';

export function BlogDetaySayfasi() {
  const { slug } = useParams<{ slug: string }>();
  const [yazi, setYazi] = useState<BlogYazisiDetay | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [bulunamadi, setBulunamadi] = useState(false);

  useEffect(() => {
    if (!slug) {
      setBulunamadi(true);
      setYukleniyor(false);
      return;
    }

    const controller = new AbortController();
    setYukleniyor(true);
    setBulunamadi(false);

    blogDetayGetir(slug, controller.signal).then((veri) => {
      if (controller.signal.aborted) return;
      if (!veri) setBulunamadi(true);
      else setYazi(veri);
      setYukleniyor(false);
    });

    return () => controller.abort();
  }, [slug]);

  if (yukleniyor) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (bulunamadi || !yazi) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-4xl">📰</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Yazı bulunamadı</h1>
        <p className="mt-2 text-slate-500">Bu blog yazısı yayında değil veya kaldırılmış olabilir.</p>
        <Link to="/blog" className="mt-6 inline-block font-semibold text-primary hover:underline">
          ← Blog listesine dön
        </Link>
      </div>
    );
  }

  const gorsel = yazi.kapakGorsel ? medyaTamUrl(yazi.kapakGorsel) : null;

  return (
    <article>
      <header className="bg-gradient-to-br from-primary/5 to-violet-50 py-12">
        <div className="container-site max-w-3xl">
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
            ← Blog
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {yazi.kategori && (
              <span className="rounded-full bg-primary/10 px-3 py-0.5 font-medium text-primary">
                {yazi.kategori}
              </span>
            )}
            <time dateTime={yazi.olusturma}>{blogTarihFormatla(yazi.olusturma)}</time>
            {yazi.yazar && <span>· {yazi.yazar}</span>}
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">{yazi.baslik}</h1>
          {yazi.ozet && <p className="mt-4 text-lg leading-relaxed text-slate-600">{yazi.ozet}</p>}
        </div>
      </header>

      {gorsel && (
        <div className="container-site max-w-4xl -mt-2">
          <img
            src={gorsel}
            alt={yazi.baslik}
            className="w-full rounded-2xl border border-slate-200 object-cover shadow-lg"
          />
        </div>
      )}

      <div className="container-site max-w-3xl py-12">
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: yazi.icerik }}
        />
      </div>
    </article>
  );
}
