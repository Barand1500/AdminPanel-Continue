import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sayfaDetayGetir } from '@/features/site/sayfaApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import { sayfaIcerikHazirla } from '@/utils/sayfaIcerikIsle';
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

  const hazirIcerik = useMemo(
    () => (sayfa?.icerik ? sayfaIcerikHazirla(sayfa.icerik) : null),
    [sayfa?.icerik]
  );

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
    <section className="py-12 sm:py-16">
      <div className="container-site">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{sayfa.baslik}</h1>
        </header>

        {gorsel && (
          <div className="mb-8 max-w-4xl">
            <img
              src={gorsel}
              alt={sayfa.baslik}
              className="w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
            />
          </div>
        )}

        {hazirIcerik?.html && (
          <div
            className="sayfa-icerik-html max-w-none"
            dangerouslySetInnerHTML={{ __html: hazirIcerik.html }}
          />
        )}
      </div>
    </section>
  );
}
