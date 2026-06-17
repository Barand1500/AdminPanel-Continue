import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { UrunKarti } from '@/components/eticaret/UrunKarti';

export function UrunlerSayfasi() {
  const { urunler } = useOutletContext<SitePublicData>();

  if (urunler.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container-site">
        <h1 className="section-title">Tüm Ürünler</h1>
        <p className="mt-1 text-sm text-slate-500">{urunler.length} urun listeleniyor</p>
        <div className="product-grid mt-6">
          {urunler.map((urun) => (
            <UrunKarti key={urun.id} urun={urun} />
          ))}
        </div>
      </div>
    </section>
  );
}
