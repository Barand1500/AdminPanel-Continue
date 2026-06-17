import { useNavigation, useLoaderData, useOutletContext, Link } from 'react-router-dom';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import type { PublicSayfa } from '@/features/site/sayfaApi';
import { SayfaShadowIcerik } from '@/components/ortak/SayfaShadowIcerik';
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
  const gorsel = sayfa.kapakGorsel ? medyaTamUrl(sayfa.kapakGorsel) : null;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-site">
        {(icerikVar || gorsel) && (
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="section-title text-3xl">{sayfa.baslik}</h1>
          </div>
        )}

        {!icerikVar && !gorsel && altSayfalar.length > 0 && (
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="section-title text-3xl">{sayfa.baslik}</h1>
            <p className="mt-3 text-sm text-slate-500">Alt bölümlerden birini seçin</p>
          </div>
        )}

        {gorsel && (
          <div className="mx-auto mt-8 max-w-4xl">
            <img
              src={gorsel}
              alt={sayfa.baslik}
              className="w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
            />
          </div>
        )}

        {icerikVar && (
          <div className="mx-auto mt-12 max-w-4xl">
            <SayfaShadowIcerik html={sayfa.icerik} />
          </div>
        )}

        {altSayfalar.length > 0 && (
          <div className={`mx-auto mt-12 max-w-5xl ${!icerikVar && !gorsel ? 'mt-8' : ''}`}>
            <div className="sayfa-alt-kart-grid">
              {altSayfalar.map((alt) => (
                <Link
                  key={alt.id}
                  to={sayfaYolunuBul(alt.slug)}
                  className="sayfa-alt-kart group"
                >
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
