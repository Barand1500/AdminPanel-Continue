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

interface BosUrunDurumuProps {
  baslik?: string;
  mesaj?: string;
}

export function BosUrunDurumu({
  baslik = 'Henüz ürün eklenmedi',
  mesaj = 'Admin panelinden ürün eklediğinizde burada görünecek.',
}: BosUrunDurumuProps) {
  return (
    <div className="container-site py-16">
      <div className="mx-auto max-w-lg rounded-2xl border-2 border-dashed border-primary/20 bg-white p-12 text-center">
        <span className="text-5xl">🛍️</span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">{baslik}</h2>
        <p className="mt-2 text-sm text-slate-500">{mesaj}</p>
      </div>
    </div>
  );
}
