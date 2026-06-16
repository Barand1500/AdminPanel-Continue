import { Link } from 'react-router-dom';
import type { BlogYazisiOzet } from '@/types/blog';
import { blogTarihFormatla } from '@/types/blog';

interface BlogHizmetBolumuProps {
  bloglar: BlogYazisiOzet[];
}

/** Hizmet kartları stilinde kompakt blog bandı */
export function BlogHizmetBolumu({ bloglar }: BlogHizmetBolumuProps) {
  if (bloglar.length === 0) return null;

  return (
    <section className="bg-surface py-16">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Blog Yazılarımız</h2>
          <p className="section-subtitle">Haberler ve güncel içerikler</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bloglar.map((yazi) => (
            <Link
              key={yazi.id}
              to={`/blog/${yazi.slug}`}
              className="card group block transition hover:border-primary/40"
            >
              <span className="text-3xl">{yazi.oneCikan ? '⭐' : '📰'}</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-primary">
                {yazi.baslik}
              </h3>
              {yazi.ozet && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{yazi.ozet}</p>
              )}
              <p className="mt-3 text-xs text-slate-500">{blogTarihFormatla(yazi.olusturma)}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
            Tüm blog yazıları →
          </Link>
        </div>
      </div>
    </section>
  );
}
