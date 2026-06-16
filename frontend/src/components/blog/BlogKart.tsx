import { Link } from 'react-router-dom';
import type { BlogYazisiOzet } from '@/types/blog';
import { blogTarihFormatla } from '@/types/blog';
import { medyaTamUrl } from '@/features/admin/medyaApi';

interface BlogKartProps {
  yazi: BlogYazisiOzet;
  kompakt?: boolean;
}

export function BlogKart({ yazi, kompakt }: BlogKartProps) {
  const gorsel = yazi.kapakGorsel ? medyaTamUrl(yazi.kapakGorsel) : null;

  return (
    <Link
      to={`/blog/${yazi.slug}`}
      className={`card group flex h-full flex-col overflow-hidden transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${
        kompakt ? '' : ''
      }`}
    >
      <div className={`relative overflow-hidden bg-slate-100 ${kompakt ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
        {gorsel ? (
          <img
            src={gorsel}
            alt={yazi.baslik}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-violet-100 text-4xl">
            📰
          </div>
        )}
        {yazi.oneCikan && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Öne Çıkan
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {yazi.kategori && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{yazi.kategori}</span>
          )}
          <time dateTime={yazi.olusturma}>{blogTarihFormatla(yazi.olusturma)}</time>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-primary">
          {yazi.baslik}
        </h3>
        {yazi.ozet && (
          <p className={`mt-2 text-sm leading-relaxed text-slate-600 ${kompakt ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {yazi.ozet}
          </p>
        )}
        {yazi.yazar && <p className="mt-auto pt-3 text-xs text-slate-500">{yazi.yazar}</p>}
      </div>
    </Link>
  );
}
