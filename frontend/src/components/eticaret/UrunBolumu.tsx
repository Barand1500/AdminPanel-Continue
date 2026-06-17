import { Link } from 'react-router-dom';
import type { Urun } from '@/types/site';
import { UrunKarti } from './UrunKarti';

interface UrunBolumuProps {
  baslik: string;
  urunler: Urun[];
  filtre?: 'yeni' | 'cokSatan';
  tumunuGorLink?: string;
}

export function UrunBolumu({ baslik, urunler, filtre, tumunuGorLink = '/urunler' }: UrunBolumuProps) {
  const liste = filtre
    ? urunler.filter((u) => (filtre === 'yeni' ? u.yeni : u.cokSatan))
    : urunler;

  if (liste.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container-site">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">{baslik}</h2>
          <Link to={tumunuGorLink} className="text-sm font-semibold text-primary hover:underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="product-grid">
          {liste.slice(0, 6).map((urun) => (
            <UrunKarti key={urun.id} urun={urun} />
          ))}
        </div>
      </div>
    </section>
  );
}
