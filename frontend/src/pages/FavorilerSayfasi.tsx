import { Link } from 'react-router-dom';

export function FavorilerSayfasi() {
  return (
    <section className="py-12">
      <div className="container-site">
        <h1 className="section-title">Favorilerim</h1>
        <p className="section-subtitle mt-2">Beğendiğiniz ürünler burada listelenir.</p>

        <div className="mx-auto mt-12 max-w-md rounded-2xl border-2 border-dashed border-primary/20 bg-white p-12 text-center">
          <span className="text-5xl">❤️</span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Henüz favori ürününüz yok</h2>
          <p className="mt-2 text-sm text-slate-500">
            Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.
          </p>
          <Link to="/urunler" className="btn-primary mt-6 inline-flex">
            Ürünleri Keşfet
          </Link>
        </div>
      </div>
    </section>
  );
}
