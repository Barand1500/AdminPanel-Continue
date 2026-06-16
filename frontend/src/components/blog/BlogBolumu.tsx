import { Link } from 'react-router-dom';
import type { BlogYazisiOzet } from '@/types/blog';
import { BlogKart } from './BlogKart';

interface BlogBolumuProps {
  baslik?: string;
  altBaslik?: string;
  bloglar: BlogYazisiOzet[];
  tumunuGoster?: boolean;
}

export function BlogBolumu({
  baslik = 'Blog & Haberler',
  altBaslik = 'Güncel yazılarımızı keşfedin',
  bloglar,
  tumunuGoster = true,
}: BlogBolumuProps) {
  if (bloglar.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{baslik}</h2>
            {altBaslik && <p className="section-subtitle">{altBaslik}</p>}
          </div>
          {tumunuGoster && bloglar.length > 0 && (
            <Link
              to="/blog"
              className="text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              Tümünü gör →
            </Link>
          )}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bloglar.map((yazi) => (
            <BlogKart key={yazi.id} yazi={yazi} />
          ))}
        </div>
      </div>
    </section>
  );
}
