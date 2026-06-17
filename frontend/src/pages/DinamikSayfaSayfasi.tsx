import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sayfaDetayGetir } from '@/features/site/sayfaApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import { SayfaBulunamadi } from '@/pages/SayfaBulunamadi';

export function DinamikSayfaSayfasi() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').split('/')[0] ?? '';

  const [yukleniyor, setYukleniyor] = useState(true);
  const [sayfa, setSayfa] = useState<Awaited<ReturnType<typeof sayfaDetayGetir>>>(null);

  useEffect(() => {
    if (!slug) {
      setSayfa(null);
      setYukleniyor(false);
      return;
    }

    const controller = new AbortController();
    setYukleniyor(true);

    void sayfaDetayGetir(slug, controller.signal).then((veri) => {
      if (controller.signal.aborted) return;
      setSayfa(veri);
      setYukleniyor(false);
    });

    return () => controller.abort();
  }, [slug]);

  if (yukleniyor) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!sayfa) return <SayfaBulunamadi />;

  const gorsel = sayfa.kapakGorsel ? medyaTamUrl(sayfa.kapakGorsel) : null;

  return (
    <article>
      <header className="bg-gradient-to-br from-primary/5 to-violet-50 py-12">
        <div className="container-site max-w-4xl">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{sayfa.baslik}</h1>
        </div>
      </header>

      {gorsel && (
        <div className="container-site max-w-4xl -mt-2">
          <img
            src={gorsel}
            alt={sayfa.baslik}
            className="w-full rounded-2xl border border-slate-200 object-cover shadow-lg"
          />
        </div>
      )}

      <div className="container-site max-w-4xl py-12">
        <div
          className="sayfa-icerik-html max-w-none text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sayfa.icerik }}
        />
      </div>
    </article>
  );
}
