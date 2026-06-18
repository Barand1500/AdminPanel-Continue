import { useNavigation, useLoaderData, useOutletContext, Link } from 'react-router-dom';
import type { PublicSayfa } from '@/features/site/sayfaApi';
import { SayfaShadowIcerik } from '@/components/ortak/SayfaShadowIcerik';
import { SayfaBaslikGosterimi } from '@/components/ortak/SayfaBaslikGosterimi';
import { SayfaBulunamadi } from '@/pages/SayfaBulunamadi';
import type { SitePublicData } from '@/types/site';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import { sayfaHiyerarsisiTamamla, sayfaIcerikVar } from '@/utils/sayfaAgaci';
import { idString } from '@/utils/idKarsilastir';

export interface DinamikSayfaLoaderVerisi {
  bulunamadi: boolean;
  sayfa: PublicSayfa | null;
}

export function DinamikSayfaSayfasi() {
  const { sayfa } = useLoaderData() as DinamikSayfaLoaderVerisi;
  const { sayfalar } = useOutletContext<SitePublicData>();
  const navigation = useNavigation();
  const yukleniyor = navigation.state === 'loading';

  if (yukleniyor) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!sayfa) return <SayfaBulunamadi />;

  const altSayfalar = sayfaHiyerarsisiTamamla(sayfalar).filter(
    (s) => s.ustSayfaId && idString(s.ustSayfaId) === idString(sayfa.id)
  );

  const icerikVar = sayfaIcerikVar(sayfa.icerik);
  const baslikGoster = icerikVar || sayfa.ikon || altSayfalar.length > 0;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-site">
        {baslikGoster && (
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="section-title text-3xl">
              <SayfaBaslikGosterimi baslik={sayfa.baslik} ikon={sayfa.ikon} />
            </h1>
            {!icerikVar && altSayfalar.length > 0 && (
              <p className="mt-3 text-sm text-slate-500">Alt bölümlerden birini seçin</p>
            )}
          </div>
        )}

        {icerikVar && (
          <div className="mx-auto mt-12 max-w-4xl">
            <SayfaShadowIcerik html={sayfa.icerik} />
          </div>
        )}

        {altSayfalar.length > 0 && (
          <div className={`mx-auto mt-12 max-w-5xl ${!icerikVar ? 'mt-8' : ''}`}>
            <div className="sayfa-alt-kart-grid">
              {altSayfalar.map((alt) => (
                <Link
                  key={alt.id}
                  to={sayfaYolunuBul(alt.slug)}
                  className="sayfa-alt-kart group"
                >
                  {alt.ikon && <span className="sayfa-alt-kart-ikon">{alt.ikon}</span>}
                  <span className="sayfa-alt-kart-baslik">{alt.baslik}</span>
                  <span className="sayfa-alt-kart-yol">/{alt.slug}</span>
                  <span className="sayfa-alt-kart-ok" aria-hidden>
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
