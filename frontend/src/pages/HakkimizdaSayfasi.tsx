const degerler = [
  {
    ikon: '🎯',
    baslik: 'Misyonumuz',
    aciklama: 'İşletmelerin kod bilmeden profesyonel web sitelerini yönetebileceği esnek ve güvenilir bir platform sunmak.',
  },
  {
    ikon: '⚡',
    baslik: 'Hız & Güven',
    aciklama: 'Güvenli altyapı, hızlı teslimat ve 7/24 teknik destek ile yanınızdayız.',
  },
  {
    ikon: '🧩',
    baslik: 'Widget Mimarisi',
    aciklama: 'Header, slider, içerik alanları ve footer gibi tüm bölümler admin panelden özelleştirilebilir.',
  },
  {
    ikon: '🏢',
    baslik: 'Multi-Tenant',
    aciklama: 'Ajanslar birden fazla müşteri sitesini tek panelden kolayca yönetebilir.',
  },
];

const istatistikler = [
  { deger: '500+', etiket: 'Mutlu Müşteri' },
  { deger: '7/24', etiket: 'Teknik Destek' },
  { deger: '100%', etiket: 'Orijinal Ürün' },
  { deger: '10+', etiket: 'Yıllık Deneyim' },
];

export function HakkimizdaSayfasi() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-violet-700 to-fuchsia-800 py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-site relative">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
            Hakkımızda
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-black sm:text-4xl lg:text-5xl">
            Güzel Teknoloji ile dijital dünyada fark yaratın
          </h1>
          <p className="mt-4 max-w-xl text-base text-violet-100 sm:text-lg">
            Küçük ve orta ölçekli işletmelere satılabilir CMS çözümleri sunuyoruz.
            Teknolojinin en güzel hali — güvenli, hızlı ve uygun fiyatlı.
          </p>
        </div>
      </section>

      <section className="container-site -mt-10 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {istatistikler.map((s) => (
            <div key={s.etiket} className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-lg shadow-slate-900/5">
              <p className="text-3xl font-black text-primary">{s.deger}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{s.etiket}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title text-2xl sm:text-3xl">Neden Güzel Teknoloji?</h2>
            <p className="section-subtitle mt-3">
              Modern altyapı, kullanıcı dostu arayüz ve güçlü özelliklerle işinizi büyütün.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {degerler.map((d) => (
              <article
                key={d.baslik}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-2xl transition group-hover:scale-110">
                  {d.ikon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{d.baslik}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.aciklama}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-2xl">Vizyonumuz</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Türkiye&apos;nin her köşesindeki işletmelerin dijital varlıklarını güçlendirmek,
              teknolojiyi herkes için erişilebilir kılmak ve sürdürülebilir büyümeye katkı sağlamak.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Widget tabanlı mimarimiz sayesinde her site benzersiz bir deneyim sunarken,
              yönetimi son derece kolay kalır.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['🛡️ Güvenlik', '🚀 Performans', '🎨 Tasarım', '🤝 Destek'].map((m) => (
              <div
                key={m}
                className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
