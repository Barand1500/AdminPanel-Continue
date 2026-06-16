import { Link } from 'react-router-dom';

export function SepetSayfasi() {
  return (
    <section className="py-12">
      <div className="container-site">
        <h1 className="section-title">Sepetim</h1>
        <p className="section-subtitle mt-2">Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.</p>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <span className="text-5xl">🛒</span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Sepetiniz boş</h2>
            <p className="mt-2 text-sm text-slate-500">
              Alışverişe başlamak için ürünlerimize göz atın.
            </p>
            <Link to="/urunler" className="btn-primary mt-6 inline-flex">
              Alışverişe Başla
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-accent/50 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Ara Toplam</span>
              <span className="font-bold text-slate-900">0,00 ₺</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Kargo</span>
              <span className="font-medium text-green-600">Ücretsiz</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-3">
              <span className="font-bold text-slate-900">Toplam</span>
              <span className="text-xl font-black text-primary">0,00 ₺</span>
            </div>
            <button
              type="button"
              disabled
              className="btn-primary mt-4 w-full py-3 opacity-50 cursor-not-allowed"
            >
              Siparişi Tamamla
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
