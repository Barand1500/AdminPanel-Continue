const hizmetler = [
  {
    baslik: 'Kurumsal Web Sitesi',
    aciklama: 'Mobil uyumlu, hizli ve SEO dostu kurumsal site tasarimi.',
  },
  {
    baslik: 'CMS Yonetim Paneli',
    aciklama: 'Windows tarzli arayuz ile widget, sayfa ve menu yonetimi.',
  },
  {
    baslik: 'Multi-Tenant Altyapi',
    aciklama: 'Her musteri icin ayri site, merkezi ajans yonetimi.',
  },
  {
    baslik: 'SEO ve Icerik Yonetimi',
    aciklama: 'Sayfa bazli SEO, medya galerisi ve icerik editoru.',
  },
];

export function UrunlerHizmetlerSayfasi() {
  return (
    <section className="py-16">
      <div className="container-site">
        <div className="max-w-2xl">
          <h1 className="section-title">Urunler / Hizmetler</h1>
          <p className="section-subtitle">
            Isletmenizin ihtiyacina uygun dijital cozumler.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {hizmetler.map((hizmet) => (
            <article key={hizmet.baslik} className="card">
              <h2 className="text-lg font-semibold text-slate-900">{hizmet.baslik}</h2>
              <p className="mt-2 text-sm text-slate-600">{hizmet.aciklama}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
