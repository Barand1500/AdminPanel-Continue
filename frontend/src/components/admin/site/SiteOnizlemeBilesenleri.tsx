import { useEffect, useMemo, useState } from 'react';
import type { SiteAyarlari } from '@/types/site';
import type { HeaderAyarlari } from '@/types/header';
import type { Kategori } from '@/data/kategoriler';
import type { NavKategoriKayit } from '@/types/navKategori';
import { headerAyarlariBirlestir } from '@/types/header';
import { headerTipiNormalize } from '@/data/headerTipleri';
import { headerTipDemoPaketi } from '@/data/headerTipDemoVerisi';
import { SiteHeader } from '@/components/ortak/SiteHeader';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { SiteDilProvider } from '@/contexts/SiteDilContext';
import { adminSayfalariGetir } from '@/features/admin/sayfaApi';
import { navKategorileriGetir } from '@/features/admin/navKategoriApi';
import { navKategorileriMenuyeCevir } from '@/utils/navKategoriAgaci';
import { headerMenuOlustur } from '@/utils/menuYardimci';

interface SiteHeaderOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
  demoMod?: boolean;
}

export function SiteHeaderOnizleme({
  siteAdi,
  ayarlar,
  headerAyarlari: headerProp,
  iletisim,
  demoMod = false,
}: SiteHeaderOnizlemeProps) {
  const [sayfalar, setSayfalar] = useState<Awaited<ReturnType<typeof adminSayfalariGetir>>>([]);
  const [navKayitlar, setNavKayitlar] = useState<NavKategoriKayit[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[] | undefined>();

  useEffect(() => {
    if (demoMod) return;
    adminSayfalariGetir()
      .then(setSayfalar)
      .catch(() => setSayfalar([]));
    navKategorileriGetir()
      .then((k) => {
        setNavKayitlar(k);
        setKategoriler(navKategorileriMenuyeCevir(k));
      })
      .catch(() => {
        setNavKayitlar([]);
        setKategoriler(undefined);
      });
  }, [demoMod]);

  const headerJson = headerProp ?? headerAyarlariBirlestir(ayarlar);
  const tip = headerTipiNormalize(headerJson.headerTipi);
  const demo = headerTipDemoPaketi(tip);

  const onizlemeAyarlar = useMemo((): SiteAyarlari => {
    const base = ayarlar ?? {};

    if (!demoMod) {
      return {
        ...base,
        telefon: iletisim?.telefon ?? base.telefon,
        email: iletisim?.email ?? base.email,
        headerAyarlariJson: headerJson,
      };
    }

    const mergedHeader = headerAyarlariBirlestir({
      ...base,
      headerAyarlariJson: headerJson,
    });

    return {
      ...base,
      anaRenk: demo.anaRenk,
      ikincilRenk: demo.ikincilRenk,
      telefon: demo.telefon || undefined,
      email: demo.email || undefined,
      headerAyarlariJson: {
        ...mergedHeader,
        markaMetni: demo.markaMetni,
        slogan: demo.slogan || mergedHeader.slogan,
        logoUrl: null,
        arama: mergedHeader.arama
          ? { ...mergedHeader.arama, placeholder: demo.aramaPlaceholder }
          : mergedHeader.arama,
        tipEk: {
          ...mergedHeader.tipEk,
          ...(tip === 'modern' && !mergedHeader.tipEk?.ctaMetni
            ? { ctaMetni: 'İletişim', ctaLink: '/iletisim' }
            : {}),
        },
      },
    };
  }, [ayarlar, headerJson, iletisim, demoMod, demo, tip]);

  const menuOgeleri = useMemo(() => {
    if (demoMod) return demo.menu;
    return headerMenuOlustur(sayfalar, onizlemeAyarlar.headerAyarlariJson, onizlemeAyarlar);
  }, [demoMod, demo.menu, sayfalar, onizlemeAyarlar]);

  const gosterilecekKategoriler = demoMod ? demo.kategoriler : kategoriler;

  return (
    <SiteDilProvider
      ayarlar={onizlemeAyarlar}
      sayfalar={demoMod ? [] : sayfalar}
      navKategoriler={demoMod ? [] : navKayitlar}
    >
      <div className="ap-site-header-onizleme site-public min-w-0">
        <SiteHeader
          siteAdi={demoMod ? demo.markaMetni : siteAdi}
          ayarlar={onizlemeAyarlar}
          menuOgeleri={menuOgeleri}
          kategoriler={gosterilecekKategoriler}
        />
      </div>
    </SiteDilProvider>
  );
}

interface SiteFooterOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
}

export function SiteFooterOnizleme({ siteAdi, ayarlar }: SiteFooterOnizlemeProps) {
  return <SiteFooter siteAdi={siteAdi} ayarlar={ayarlar} />;
}
