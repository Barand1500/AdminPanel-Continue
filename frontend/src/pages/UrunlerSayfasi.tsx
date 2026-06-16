import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { UrunKarti } from '@/components/eticaret/UrunKarti';
import { BosUrunDurumu } from '@/components/eticaret/UrunBolumu';

export function UrunlerSayfasi() {
  const { urunler } = useOutletContext<SitePublicData>();

  return (
    <section className="py-8">
      <div className="container-site">
        <h1 className="section-title">Tüm Ürünler</h1>
        <p className="mt-1 text-sm text-slate-500">
          {urunler.length > 0 ? `${urunler.length} urun listeleniyor` : 'Henuz urun yok'}
        </p>

        {urunler.length === 0 ? (
          <BosUrunDurumu mesaj="Admin panelinden ürün ekleyerek mağazayı doldurabilirsiniz." />
        ) : (
          <div className="product-grid mt-6">
            {urunler.map((urun) => (
              <UrunKarti key={urun.id} urun={urun} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
