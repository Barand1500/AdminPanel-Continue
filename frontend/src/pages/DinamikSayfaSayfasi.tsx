import { useMemo } from 'react';
import { useNavigation, useLoaderData, useOutletContext, Link } from 'react-router-dom';
import type { PublicSayfa } from '@/features/site/sayfaApi';
import { SayfaIcerikParcalari } from '@/components/ortak/SayfaIcerikParcalari';
import { SayfaBaslikGosterimi } from '@/components/ortak/SayfaBaslikGosterimi';
import { SayfaBulunamadi } from '@/pages/SayfaBulunamadi';
import type { SitePublicData } from '@/types/site';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import { sayfaHiyerarsisiTamamla, sayfaIcerikVar } from '@/utils/sayfaAgaci';
import { idString } from '@/utils/idKarsilastir';
import {
  sayfaDuzenEtiketiKaldir,
  sayfaDuzenModuOku,
  sayfaTamGenisDuzenMi,
} from '@/utils/sayfaIcerikIsle';
import { WidgetBolge } from '@/components/widget/WidgetBolge';
import { sayfaBolgeWidgetlariHaric, sayfaWidgetlari } from '@/utils/widgetYerlesim';

export interface DinamikSayfaLoaderVerisi {
  bulunamadi: boolean;
  sayfa: PublicSayfa | null;
}

function SayfaBaslikBlok({
  sayfa,
  altSayfalar,
  icerikVar,
  ortala,
}: {
  sayfa: PublicSayfa;
  altSayfalar: PublicSayfa[];
  icerikVar: boolean;
  ortala?: boolean;
}) {
  return (
    <div className={ortala === false ? '' : 'mx-auto max-w-2xl text-center'}>
      <h1 className="section-title text-3xl">
        <SayfaBaslikGosterimi baslik={sayfa.baslik} ikon={sayfa.ikon} />
      </h1>
      {!icerikVar && altSayfalar.length > 0 && (
        <p className="mt-3 text-sm text-slate-500">Alt bölümlerden birini seçin</p>
      )}
    </div>
  );
}

function AltSayfaGrid({ altSayfalar, ustBasliksiz }: { altSayfalar: PublicSayfa[]; ustBasliksiz?: boolean }) {
  return (
    <div className={`mx-auto max-w-5xl ${ustBasliksiz ? 'mt-8' : 'mt-12'}`}>
      <div className="sayfa-alt-kart-grid">
        {altSayfalar.map((alt) => (
          <Link key={alt.id} to={sayfaYolunuBul(alt.slug)} className="sayfa-alt-kart group">
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
  );
}

export function DinamikSayfaSayfasi() {
  const { sayfa } = useLoaderData() as DinamikSayfaLoaderVerisi;
  const { sayfalar, widgetlar } = useOutletContext<SitePublicData>();
  const navigation = useNavigation();
  const yukleniyor = navigation.state === 'loading';
  const tumSayfaWidgetlar = useMemo(
    () => (sayfa ? sayfaWidgetlari(widgetlar, sayfa.id) : []),
    [widgetlar, sayfa]
  );
  const bolgeWidgetlar = useMemo(
    () => (sayfa ? sayfaBolgeWidgetlariHaric(tumSayfaWidgetlar, sayfa.icerik) : []),
    [tumSayfaWidgetlar, sayfa]
  );

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

  const duzen = sayfaDuzenModuOku(sayfa.icerik);
  const icerikHtml = sayfaDuzenEtiketiKaldir(sayfa.icerik);
  const icerikVar = sayfaIcerikVar(icerikHtml);
  const tamGenis = sayfaTamGenisDuzenMi(duzen);
  const ozelHtml = duzen === 'tam-basliksiz';
  const baslikGoster =
    !ozelHtml && (icerikVar || sayfa.ikon || altSayfalar.length > 0);

  const icerikKapsayiciSinif =
    duzen === 'dar'
      ? 'mx-auto mt-12 max-w-2xl'
      : duzen === 'normal'
        ? 'mx-auto mt-12 max-w-4xl'
        : 'sayfa-icerik-tam-wrap';

  const altSayfaGoster = altSayfalar.length > 0;
  const ortaBolumGoster = baslikGoster || icerikVar || altSayfaGoster;

  if (tamGenis) {
    return (
      <>
        <WidgetBolge widgetlar={bolgeWidgetlar} bolge="sayfa_ustu" />
        {baslikGoster && (
          <section className="py-8 sm:py-10">
            <div className="container-site">
              <SayfaBaslikBlok sayfa={sayfa} altSayfalar={altSayfalar} icerikVar={icerikVar} />
            </div>
          </section>
        )}
        {icerikVar && (
          <section className="sayfa-icerik-tam-bolum">
            <SayfaIcerikParcalari
              html={sayfa.icerik}
              widgetlar={tumSayfaWidgetlar}
              shadowSinif="sayfa-icerik-tam-host"
            />
          </section>
        )}
        {altSayfaGoster && (
          <section className="py-12 sm:py-16">
            <div className="container-site">
              <AltSayfaGrid altSayfalar={altSayfalar} ustBasliksiz={ozelHtml && icerikVar} />
            </div>
          </section>
        )}
        <WidgetBolge widgetlar={bolgeWidgetlar} bolge="sayfa_alti" />
      </>
    );
  }

  return (
    <>
      <WidgetBolge widgetlar={bolgeWidgetlar} bolge="sayfa_ustu" />
      {ortaBolumGoster && (
        <section className="py-12 sm:py-16">
          <div className="container-site">
            {baslikGoster && (
              <SayfaBaslikBlok sayfa={sayfa} altSayfalar={altSayfalar} icerikVar={icerikVar} />
            )}

            {icerikVar && (
              <div className={icerikKapsayiciSinif}>
                <SayfaIcerikParcalari html={sayfa.icerik} widgetlar={tumSayfaWidgetlar} />
              </div>
            )}

            {altSayfaGoster && (
              <AltSayfaGrid altSayfalar={altSayfalar} ustBasliksiz={!icerikVar} />
            )}
          </div>
        </section>
      )}
      <WidgetBolge widgetlar={bolgeWidgetlar} bolge="sayfa_alti" />
    </>
  );
}
