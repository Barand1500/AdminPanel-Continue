import { useNavigation } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import type { PublicSayfa } from '@/features/site/sayfaApi';
import { SayfaShadowIcerik } from '@/components/ortak/SayfaShadowIcerik';
import { SayfaBulunamadi } from '@/pages/SayfaBulunamadi';

export interface DinamikSayfaLoaderVerisi {
  bulunamadi: boolean;
  sayfa: PublicSayfa | null;
}

export function DinamikSayfaSayfasi() {
  const { sayfa } = useLoaderData() as DinamikSayfaLoaderVerisi;
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

  const gorsel = sayfa.kapakGorsel ? medyaTamUrl(sayfa.kapakGorsel) : null;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="section-title text-3xl">{sayfa.baslik}</h1>
        </div>

        {gorsel && (
          <div className="mx-auto mt-8 max-w-4xl">
            <img
              src={gorsel}
              alt={sayfa.baslik}
              className="w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
            />
          </div>
        )}

        {sayfa.icerik.trim() && (
          <div className="mx-auto mt-12 max-w-4xl">
            <SayfaShadowIcerik html={sayfa.icerik} />
          </div>
        )}
      </div>
    </section>
  );
}
