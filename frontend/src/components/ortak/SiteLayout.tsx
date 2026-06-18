import { useMemo } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { SayfaModalProvider } from '@/contexts/SayfaModalContext';
import { SiteDilProvider } from '@/contexts/SiteDilContext';
import { SiteHeader } from '@/components/ortak/SiteHeader';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { BakimEkrani } from '@/components/ortak/BakimEkrani';
import { SiteKapaliEkrani } from '@/components/ortak/SiteKapaliEkrani';
import { FloatingButonlar } from '@/components/eticaret/FloatingButonlar';
import { SiteTemaProvider } from '@/contexts/SiteTemaContext';
import { SiteAuthProvider } from '@/contexts/SiteAuthContext';
import { useSiteVerisi } from '@/hooks/useSiteVerisi';
import { useSiteTemaUygula } from '@/hooks/useSiteTemaUygula';
import { headerAyarlariBirlestir } from '@/types/header';
import { headerMenuOlustur } from '@/utils/menuYardimci';
import { varsayilanSayfa404 } from '@/types/sistemAyarlari';
import { bakimModuAktifMi, siteKapaliMi, sistemAyarlariCoz } from '@/utils/sistemAyarlariYardimci';
import { navKategorileriMenuyeCevir } from '@/utils/navKategoriAgaci';

function SiteLayoutIcerik() {
  const { veri, yukleniyor } = useSiteVerisi();
  const { site } = veri;
  const headerAyarlari = headerAyarlariBirlestir(site.ayarlar);
  const menuOgeleri = headerMenuOlustur(veri.sayfalar, headerAyarlari, site.ayarlar);
  const sistem = sistemAyarlariCoz(site.ayarlar);
  const matches = useMatches() as { data?: { bulunamadi?: boolean } }[];
  const dinamikMatch = [...matches].reverse().find((m) => typeof m.data?.bulunamadi === 'boolean');
  const is404 = dinamikMatch?.data?.bulunamadi === true;
  const menuTipi = { ...varsayilanSayfa404, ...sistem?.sayfa404 }.menuTipi;
  const menuKategoriler = useMemo(
    () => navKategorileriMenuyeCevir(veri.navKategoriler),
    [veri.navKategoriler]
  );

  useSiteTemaUygula(site.ayarlar, site.ad);

  const headerGoster = !is404 || menuTipi === 'ust' || menuTipi === 'her-ikisi';
  const footerGoster = !is404 || menuTipi === 'footer' || menuTipi === 'her-ikisi';

  if (yukleniyor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (siteKapaliMi(site)) {
    return <SiteKapaliEkrani siteAdi={site.ad} ayarlar={site.ayarlar} />;
  }

  if (bakimModuAktifMi(site.ayarlar)) {
    return <BakimEkrani siteAdi={site.ad} ayarlar={site.ayarlar} />;
  }

  return (
    <SiteDilProvider ayarlar={site.ayarlar} sayfalar={veri.sayfalar}>
      <div className="site-public flex min-h-screen flex-col">
        {headerGoster && (
          <SiteHeader
            siteAdi={site.ad}
            ayarlar={site.ayarlar}
            menuOgeleri={menuOgeleri}
            kategoriler={menuKategoriler}
          />
        )}
        <main className="flex-1">
          <Outlet context={veri} />
        </main>
        {footerGoster && <SiteFooter siteAdi={site.ad} ayarlar={site.ayarlar} />}
        <FloatingButonlar ayarlar={site.ayarlar} />
      </div>
    </SiteDilProvider>
  );
}

export function SiteLayout() {
  return (
    <SiteTemaProvider>
      <SiteAuthProvider>
        <SayfaModalProvider>
          <SiteLayoutIcerik />
        </SayfaModalProvider>
      </SiteAuthProvider>
    </SiteTemaProvider>
  );
}
